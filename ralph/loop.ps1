# loop.ps1
# Goblin Dice Rollaz - Ralph Loop (OpenCode with Headless Server)
# Entry point - dot-sources all modules and runs the main loop
#
# Usage:
#   .\loop.ps1
#   .\loop.ps1 -Verbose
#   .\loop.ps1 -DryRun
#   .\loop.ps1 -SleepMin 5 -SleepMax 10 -Model "big-pickle"

#Requires -Version 5.1

param(
    [int]$SleepMin      = 1,
    [int]$SleepMax      = 3,
    [string]$Model      = "big-pickle",
    [string]$ProjectDir = "C:\Users\Lauren\Documents\git projects\doom\GoblinDiceRollaz",
    [string]$BackupDir  = "C:\Users\Lauren\Documents\git projects\doom\backups",
    [string]$ServerPort = "4096",
    [switch]$Verbose,
    [switch]$DryRun
)

$ErrorActionPreference = "Continue"
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Load modules
. (Join-Path $ScriptRoot "ralph-config.ps1")  -SleepMin $SleepMin -SleepMax $SleepMax `
    -Model $Model -ProjectDir $ProjectDir -BackupDir $BackupDir -ServerPort $ServerPort `
    -VerboseMode $Verbose.IsPresent -DryRunMode $DryRun.IsPresent

. (Join-Path $ScriptRoot "ralph-state.ps1")
. (Join-Path $ScriptRoot "ralph-backup.ps1")
. (Join-Path $ScriptRoot "ralph-session.ps1")

# ----------------------------------------------------------------------------
# Sleep helper
# ----------------------------------------------------------------------------

function Start-RalphSleep {
    param([string]$Reason)

    $SleepSeconds = (Get-Random -Minimum $Script:Config.SleepMin -Maximum ($Script:Config.SleepMax + 1)) * 60
    $WakeTime     = (Get-Date).AddSeconds($SleepSeconds)

    Write-Host ""
    Write-Host ("Checkpoint: " + $Reason) -ForegroundColor Magenta
    Write-Host ("Sleeping " + $Script:Config.SleepMin + "-" + $Script:Config.SleepMax + " min (" + $SleepSeconds + " sec)") -ForegroundColor Gray
    Write-Host ("Resuming at: " + $WakeTime.ToString("HH:mm:ss")) -ForegroundColor Gray
    Write-Host ""

    if ($Script:Config.DryRun) {
        Write-Log ("DRY RUN: Would sleep " + $SleepSeconds + " seconds") "DEBUG"
    }
    else {
        Start-Sleep -Seconds $SleepSeconds
    }
}

# ----------------------------------------------------------------------------
# Stats
# ----------------------------------------------------------------------------

function Show-FinalStats {
    param(
        [datetime]$StartTime,
        [int]$IterationCount,
        [int]$BackupCount
    )

    $Elapsed  = (Get-Date) - $StartTime
    $AvgMin   = if ($IterationCount -gt 0) { [math]::Round($Elapsed.TotalMinutes / $IterationCount, 1) } else { 0 }
    $Summary  = Get-TaskSummary

    Write-Host ""
    Write-Host "Final Statistics" -ForegroundColor Cyan
    Write-Host ("  Iterations:   " + $IterationCount)                          -ForegroundColor Cyan
    Write-Host ("  Backups:      " + $BackupCount)                             -ForegroundColor Magenta
    Write-Host ("  Elapsed:      " + [math]::Round($Elapsed.TotalHours, 1) + " hours") -ForegroundColor Cyan
    Write-Host ("  Avg/iter:     " + $AvgMin + " minutes")                     -ForegroundColor Cyan
    Write-Host ("  Tasks done:   " + $Summary.Completed + "/" + $Summary.Total) -ForegroundColor Green
    Write-Host ("  Remaining:    " + $Summary.Incomplete)                      -ForegroundColor Yellow
    Write-Host ""
}

# ----------------------------------------------------------------------------
# Main loop
# ----------------------------------------------------------------------------

function Start-RalphLoop {
    Write-Header "GOBLIN DICE ROLLAZ - Ralph Loop"

    Write-Host "Configuration:" -ForegroundColor Cyan
    Write-Host ("  Sleep:      " + $Script:Config.SleepMin + "-" + $Script:Config.SleepMax + " min") -ForegroundColor Cyan
    Write-Host ("  Model:      " + $Script:Config.Model)      -ForegroundColor Magenta
    Write-Host ("  Server:     " + $Script:Config.ServerUrl)  -ForegroundColor Magenta
    Write-Host ("  Project:    " + $Script:Config.ProjectDir) -ForegroundColor Cyan
    Write-Host ("  Backups:    " + $Script:Config.BackupDir)  -ForegroundColor Cyan
    Write-Host "  Mode:       Backup on task completion, fallback every 20 iterations" -ForegroundColor Magenta
    if ($Script:Config.DryRun) {
        Write-Host "  DRY RUN - no changes will be made" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""

    if (-not (Test-Prerequisites)) {
        Write-Log "Prerequisites check failed, aborting" "ERROR"
        exit 1
    }

    if (-not (Start-OpenCodeServer)) {
        Write-Log "Failed to start OpenCode server, aborting" "ERROR"
        exit 1
    }

    $null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Stop-OpenCodeServer }

    $State     = Get-RalphState
    $TaskState = Get-TaskState

    if ($State.TotalIterations -gt 0) {
        Write-Log ("Resuming from iteration " + $State.TotalIterations + ", " + $State.TotalBackups + " backups so far") "INFO"
    }

    $LoopStartTime         = Get-Date
    $Iteration             = 0
    $BackupCount           = [int]$State.TotalBackups
    $IterationsSinceBackup = [int]$TaskState.IterationsSinceBackup

    Show-TaskProgress

    $TaskState.LastCompletedCount = (Get-TaskSummary).Completed

    while ($true) {
        $Iteration++
        $IterationsSinceBackup++

        Write-Header ("ITERATION " + $Iteration + "  (since backup: " + $IterationsSinceBackup + ")")
        Show-TaskProgress

        $SessionSuccess = Invoke-OpenCodeSession -IterationNumber $Iteration
        if (-not $SessionSuccess) {
            Write-Log "Session failed, continuing to next iteration..." "WARNING"
        }

        $State.TotalIterations = $Iteration
        Save-RalphState $State

        # All done?
        if ((Get-IncompleteTaskCount) -eq 0) {
            Write-Header "ALL TASKS COMPLETE!"
            Write-Host "All tasks marked complete!" -ForegroundColor Green
            Write-Log ("All tasks complete after " + $Iteration + " iterations") "SUCCESS"

            $BackupCount++
            New-SessionBackup -BackupNumber $BackupCount -Reason "ALL TASKS COMPLETE"
            Cleanup-OldBackups
            $State.TotalBackups = $BackupCount
            Save-RalphState $State
            break
        }

        # Did we make progress this iteration?
        $CurrentTaskCount = (Get-TaskSummary).Completed
        $TaskCompleted    = $CurrentTaskCount -gt $TaskState.LastCompletedCount

        if ($TaskCompleted) {
            Write-Log ("Progress: " + $TaskState.LastCompletedCount + " -> " + $CurrentTaskCount + " tasks complete") "SUCCESS"

            $BackupCount++
            $ts           = Get-TaskSummary
            $backupReason = "Task completion (" + $CurrentTaskCount + "/" + $ts.Total + ")"
            New-SessionBackup -BackupNumber $BackupCount -Reason $backupReason
            Cleanup-OldBackups
            $State.TotalBackups = $BackupCount
            Save-RalphState $State

            $TaskState.LastCompletedCount    = $CurrentTaskCount
            $TaskState.IterationsSinceBackup = 0
            $IterationsSinceBackup           = 0
            Save-TaskState $TaskState

            $ts = Get-TaskSummary
            Start-RalphSleep -Reason ("Tasks completed! " + $CurrentTaskCount + "/" + $ts.Total)
        }
        elseif ($IterationsSinceBackup -ge $Script:Config.FallbackIterations) {
            Write-Log ("Fallback: " + $IterationsSinceBackup + " iterations without task completion") "WARNING"

            $BackupCount++
            New-SessionBackup -BackupNumber $BackupCount -Reason "Fallback (20 iterations, no task completion)"
            Cleanup-OldBackups
            $State.TotalBackups = $BackupCount
            Save-RalphState $State

            $TaskState.IterationsSinceBackup = 0
            $IterationsSinceBackup           = 0
            Save-TaskState $TaskState

            Start-RalphSleep -Reason "Fallback checkpoint (20 iterations)"
        }
    }

    Write-Header "Ralph Loop Complete!"
    Show-FinalStats -StartTime $LoopStartTime -IterationCount $Iteration -BackupCount $BackupCount

    Write-Log ("Finished: " + $Iteration + " iterations, " + $BackupCount + " backups") "SUCCESS"
    Write-Host ("Backups: " + $Script:Config.BackupDir)                          -ForegroundColor Cyan
    Write-Host ("Log:     " + (Join-Path $Script:Config.LogDir "ralph_loop.log")) -ForegroundColor Cyan

    Stop-OpenCodeServer
}

# ----------------------------------------------------------------------------
# Entry point
# ----------------------------------------------------------------------------

try {
    Start-RalphLoop
}
catch {
    Write-Log ("Fatal error: " + $_) "ERROR"
    Write-Log ("Stack: " + $_.ScriptStackTrace) "ERROR"
    Stop-OpenCodeServer
    exit 1
}
