# ralph-config.ps1
# Shared configuration and logging for Ralph Loop
# Dot-source this from other scripts: . .\ralph-config.ps1

param(
    [int]$SleepMin = 3,
    [int]$SleepMax = 5,
    [string]$Model = "big-pickle",
    [string]$ProjectDir = "C:\Users\Lauren\Documents\git projects\doom\GoblinDiceRollaz",
    [string]$BackupDir  = "C:\Users\Lauren\Documents\git projects\doom\backups",
    [string]$ServerPort = "4096",
    [bool]$VerboseMode  = $false,
    [bool]$DryRunMode   = $false
)

$OpenCodePath = "C:\Users\Lauren\.opencode\bin"
if ($env:PATH -notlike "*$OpenCodePath*") {
    $env:PATH = "$OpenCodePath;$env:PATH"
}

$Script:Config = @{
    SleepMin           = $SleepMin
    SleepMax           = $SleepMax
    Model              = $Model
    ProjectDir         = $ProjectDir
    BackupDir          = $BackupDir
    ServerPort         = $ServerPort
    ServerUrl          = "http://localhost:" + $ServerPort
    Verbose            = $VerboseMode
    DryRun             = $DryRunMode
    LogDir             = (Join-Path $BackupDir "logs")
    StateFile          = (Join-Path $BackupDir "ralph_state.json")
    TaskStateFile      = (Join-Path $BackupDir "ralph_task_state.json")
    BackupKeepCount    = 20
    FallbackIterations = 20
    ServerProcessId    = $null
}

if (-not (Test-Path -Path $Script:Config.BackupDir)) {
    New-Item -ItemType Directory -Path $Script:Config.BackupDir -Force | Out-Null
}
if (-not (Test-Path -Path $Script:Config.LogDir)) {
    New-Item -ItemType Directory -Path $Script:Config.LogDir -Force | Out-Null
}

# ----------------------------------------------------------------------------
# Logging
# ----------------------------------------------------------------------------

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet("INFO","SUCCESS","WARNING","ERROR","DEBUG")]
        [string]$Level = "INFO"
    )

    $Timestamp        = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogFile          = Join-Path $Script:Config.LogDir "ralph_loop.log"
    $FormattedMessage = "[" + $Timestamp + "] [" + $Level + "] " + $Message

    switch ($Level) {
        "SUCCESS" { Write-Host $FormattedMessage -ForegroundColor Green  }
        "WARNING" { Write-Host $FormattedMessage -ForegroundColor Yellow }
        "ERROR"   { Write-Host $FormattedMessage -ForegroundColor Red    }
        "DEBUG"   { if ($Script:Config.Verbose) { Write-Host $FormattedMessage -ForegroundColor Gray } }
        default   { Write-Host $FormattedMessage -ForegroundColor Cyan   }
    }

    Add-Content -Path $LogFile -Value $FormattedMessage -ErrorAction SilentlyContinue
}

function Write-Header {
    param([string]$Text)
    $Line = "=" * 50
    Write-Host ""
    Write-Host $Line           -ForegroundColor Cyan
    Write-Host ("  " + $Text) -ForegroundColor Cyan
    Write-Host $Line           -ForegroundColor Cyan
    Write-Host ""
}
