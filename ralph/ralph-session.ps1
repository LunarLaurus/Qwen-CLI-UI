# ralph-session.ps1
# OpenCode session execution for Ralph Loop
# Requires ralph-config.ps1 to be dot-sourced first

function Start-OpenCodeServer {
    Write-Log ("Starting OpenCode headless server on port " + $Script:Config.ServerPort + "...") "INFO"

    if ($Script:Config.DryRun) {
        Write-Log ("DRY RUN: Would start opencode serve --port " + $Script:Config.ServerPort) "DEBUG"
        return $true
    }

    try {
        $serverProcess = Start-Process -FilePath "opencode" `
            -ArgumentList "serve", "--port", $Script:Config.ServerPort `
            -WindowStyle Hidden `
            -PassThru `
            -ErrorAction Stop

        $Script:Config.ServerProcessId = $serverProcess.Id
        Write-Log ("OpenCode server started (PID: " + $serverProcess.Id + ")") "SUCCESS"
        Write-Log "Waiting for server to become ready..." "INFO"
        Start-Sleep -Seconds 3
        return $true
    }
    catch {
        Write-Log ("Failed to start OpenCode server: " + $_) "ERROR"
        return $false
    }
}

function Stop-OpenCodeServer {
    if ($Script:Config.ServerProcessId) {
        try {
            Write-Log ("Stopping OpenCode server (PID: " + $Script:Config.ServerProcessId + ")...") "INFO"
            Stop-Process -Id $Script:Config.ServerProcessId -Force -ErrorAction SilentlyContinue
            Write-Log "OpenCode server stopped" "SUCCESS"
        }
        catch {
            Write-Log ("Error stopping server: " + $_) "WARNING"
        }
    }
}

function Test-Prerequisites {
    Write-Log "Checking prerequisites..." "INFO"

    $opencode = Get-Command opencode -ErrorAction SilentlyContinue
    if (-not $opencode) {
        Write-Log "ERROR: opencode not found in PATH" "ERROR"
        return $false
    }

    if (-not (Test-Path -Path $Script:Config.ProjectDir)) {
        Write-Log ("ERROR: Project directory not found: " + $Script:Config.ProjectDir) "ERROR"
        return $false
    }

    $planFile = Join-Path $Script:Config.ProjectDir "IMPLEMENTATION_PLAN.md"
    if (-not (Test-Path -Path $planFile)) {
        Write-Log "ERROR: IMPLEMENTATION_PLAN.md not found" "ERROR"
        return $false
    }

    $promptFile = Join-Path $Script:Config.ProjectDir "PROMPT_build.md"
    if (-not (Test-Path -Path $promptFile)) {
        Write-Log "ERROR: PROMPT_build.md not found" "ERROR"
        return $false
    }

    Write-Log "All prerequisites met" "SUCCESS"
    return $true
}

function Invoke-OpenCodeSession {
    param([int]$IterationNumber)

    Write-Log ("Starting OpenCode session " + $IterationNumber + " (" + $Script:Config.Model + ")...") "INFO"

    $PromptTempFile = Join-Path $env:TEMP ("ralph_prompt_" + $IterationNumber + ".txt")

    try {
        $PromptFile    = Join-Path $Script:Config.ProjectDir "PROMPT_build.md"
        $PromptContent = Get-Content -Path $PromptFile -Raw -Encoding UTF8

        $PlanFile    = Join-Path $Script:Config.ProjectDir "IMPLEMENTATION_PLAN.md"
        $PlanContent = Get-Content -Path $PlanFile -Raw -Encoding UTF8

        # Build prompt via concatenation - no here-strings
        $FullPrompt = "=== IMPLEMENTATION PLAN ===" + "`n" + $PlanContent + "`n`n" + "=== BUILD PROMPT ===" + "`n" + $PromptContent

        if ($Script:Config.DryRun) {
            Write-Log ("DRY RUN: opencode run --attach " + $Script:Config.ServerUrl + " --model " + $Script:Config.Model) "DEBUG"
            Write-Log ("DRY RUN: Prompt length: " + $FullPrompt.Length + " characters") "DEBUG"
            return $true
        }

        $OutputLogFile = Join-Path $Script:Config.LogDir ("iteration_" + $IterationNumber + "_output.log")
        Write-Log ("Executing: opencode run --attach " + $Script:Config.ServerUrl + " --model " + $Script:Config.Model) "DEBUG"

        # Write prompt to temp file and pipe via stdin - passing as a bare arg treats it as a file path
        [System.IO.File]::WriteAllText($PromptTempFile, $FullPrompt, [System.Text.Encoding]::UTF8)
        $output     = Get-Content -Path $PromptTempFile -Raw | & opencode run --attach $Script:Config.ServerUrl --dir $Script:Config.ProjectDir 2>&1
        $outputText  = $output -join "`n"
        $outputLines = @($output).Count

        Write-Log ("Session completed (" + $outputLines + " lines of output)") "SUCCESS"
        $outputText | Out-File -FilePath $OutputLogFile -Encoding UTF8
        Write-Log ("Output saved to: iteration_" + $IterationNumber + "_output.log") "DEBUG"

        # Print summary - ASCII only, no box-drawing characters
        Write-Host ""
        Write-Host ("--- Iteration #" + $IterationNumber + " Output ---") -ForegroundColor Cyan
        Write-Host ""

        if ($output.Count -gt 0) {
            Write-Host "First 10 lines:" -ForegroundColor Yellow
            $output | Select-Object -First 10 | ForEach-Object {
                Write-Host ("  " + $_) -ForegroundColor Gray
            }
            Write-Host ""
            Write-Host "Summary:"                                                        -ForegroundColor Yellow
            Write-Host ("  Total lines: " + $outputLines)                               -ForegroundColor Gray
            Write-Host ("  Output file: iteration_" + $IterationNumber + "_output.log") -ForegroundColor Gray

            $outputUpper = $outputText.ToUpper()
            if ($outputUpper -match "COMPLETE|SUCCESS|DONE|FINISHED") {
                Write-Host "  Status: Task appears completed" -ForegroundColor Green
            }
            elseif ($outputUpper -match "ERROR|FAIL") {
                Write-Host "  Status: Encountered an error"   -ForegroundColor Red
            }
            else {
                Write-Host "  Status: Work in progress"       -ForegroundColor Yellow
            }
        }

        Write-Host ("--- End Iteration #" + $IterationNumber + " ---") -ForegroundColor Cyan
        Write-Host ""

        return $true
    }
    catch {
        Write-Log ("OpenCode session failed: " + $_) "ERROR"
        return $false
    }
    finally {
        Remove-Item -Path $PromptTempFile -Force -ErrorAction SilentlyContinue
    }
}