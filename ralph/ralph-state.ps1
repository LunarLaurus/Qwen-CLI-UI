# ralph-state.ps1
# State persistence and task tracking for Ralph Loop
# Requires ralph-config.ps1 to be dot-sourced first

# ----------------------------------------------------------------------------
# Ralph State (iteration/backup counts)
# ----------------------------------------------------------------------------

function Get-RalphState {
    if (Test-Path -Path $Script:Config.StateFile) {
        try {
            $raw = Get-Content -Path $Script:Config.StateFile -Raw
            return ($raw | ConvertFrom-Json)
        }
        catch {
            Write-Log "Could not read state file, starting fresh" "WARNING"
        }
    }

    return New-Object -TypeName PSObject -Property @{
        TotalIterations = 0
        TotalBackups    = 0
        StartTime       = (Get-Date).ToString("o")
    }
}

function Save-RalphState {
    param([PSObject]$State)
    try {
        $State | ConvertTo-Json | Out-File -FilePath $Script:Config.StateFile -Force -Encoding UTF8
        Write-Log "State saved" "DEBUG"
    }
    catch {
        Write-Log ("Could not save state: " + $_) "WARNING"
    }
}

# ----------------------------------------------------------------------------
# Task State (tracks completions between backups)
# ----------------------------------------------------------------------------

function Get-TaskState {
    if (Test-Path -Path $Script:Config.TaskStateFile) {
        try {
            $raw = Get-Content -Path $Script:Config.TaskStateFile -Raw
            return ($raw | ConvertFrom-Json)
        }
        catch {
            Write-Log "Could not read task state, starting fresh" "WARNING"
        }
    }

    return New-Object -TypeName PSObject -Property @{
        LastCompletedCount    = 0
        IterationsSinceBackup = 0
    }
}

function Save-TaskState {
    param([PSObject]$State)
    try {
        $State | ConvertTo-Json | Out-File -FilePath $Script:Config.TaskStateFile -Force -Encoding UTF8
    }
    catch {
        Write-Log ("Could not save task state: " + $_) "WARNING"
    }
}

# ----------------------------------------------------------------------------
# Task Progress (reads IMPLEMENTATION_PLAN.md)
# ----------------------------------------------------------------------------

function Get-IncompleteTaskCount {
    $planFile = Join-Path $Script:Config.ProjectDir "IMPLEMENTATION_PLAN.md"
    if (-not (Test-Path -Path $planFile)) { return 0 }

    $content = Get-Content -Path $planFile -Raw
    return ([regex]::Matches($content, '-\s+\[\s*\]')).Count
}

function Get-TaskSummary {
    $planFile = Join-Path $Script:Config.ProjectDir "IMPLEMENTATION_PLAN.md"
    if (-not (Test-Path -Path $planFile)) {
        return New-Object -TypeName PSObject -Property @{
            Total      = 0
            Completed  = 0
            Incomplete = 0
            Percentage = 0
        }
    }

    $content        = Get-Content -Path $planFile -Raw
    $totalTasks     = ([regex]::Matches($content, '-\s+\[')).Count
    $completedCount = ([regex]::Matches($content, '-\s+\[[xX]\]')).Count
    $incomplete     = $totalTasks - $completedCount
    $percentage     = if ($totalTasks -gt 0) { [math]::Round(100 * $completedCount / $totalTasks, 1) } else { 0 }

    return New-Object -TypeName PSObject -Property @{
        Total      = $totalTasks
        Completed  = $completedCount
        Incomplete = $incomplete
        Percentage = $percentage
    }
}

function Show-TaskProgress {
    $summary = Get-TaskSummary
    Write-Host ""
    Write-Host "Task Progress"                                 -ForegroundColor Cyan
    Write-Host ("  Total:      " + $summary.Total)            -ForegroundColor Cyan
    Write-Host ("  Completed:  " + $summary.Completed)        -ForegroundColor Green
    Write-Host ("  Remaining:  " + $summary.Incomplete)       -ForegroundColor Yellow
    Write-Host ("  Progress:   " + $summary.Percentage + "%") -ForegroundColor Cyan
    Write-Host ""
}
