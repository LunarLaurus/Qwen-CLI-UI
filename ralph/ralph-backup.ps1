# ralph-backup.ps1
# Backup creation and cleanup for Ralph Loop
# Requires ralph-config.ps1 and ralph-state.ps1 to be dot-sourced first

function New-SessionBackup {
    param(
        [int]$BackupNumber,
        [string]$Reason = ""
    )

    Write-Log ("Creating backup #" + $BackupNumber + " (" + $Reason + ")...") "INFO"

    if (-not (Test-Path -Path $Script:Config.BackupDir)) {
        New-Item -ItemType Directory -Path $Script:Config.BackupDir -Force | Out-Null
    }

    $Timestamp  = Get-Date -Format "yyyyMMdd_HHmmss"
    $BackupName = "goblin_dice_rollaz_backup" + $BackupNumber + "_" + $Timestamp + ".zip"
    $BackupPath = Join-Path $Script:Config.BackupDir $BackupName

    $ExcludePatterns = @(
        '\.git', '\.gitignore', 'node_modules', 'bin', 'obj',
        'dist', 'build', '\.vscode', '\.vs', '\.opencode',
        '__pycache__', '\.pytest_cache', 'backups',
        '\\nul$', '^nul'
    )

    $Files = New-Object System.Collections.ArrayList
    Get-ChildItem -Path $Script:Config.ProjectDir -Recurse -File | ForEach-Object {
        $FilePath      = $_.FullName
        $ShouldExclude = $false
        foreach ($Pattern in $ExcludePatterns) {
            if ($FilePath -match $Pattern) {
                $ShouldExclude = $true
                break
            }
        }
        if (-not $ShouldExclude) {
            [void]$Files.Add($_)
        }
    }

    if ($Files.Count -eq 0) {
        Write-Log "No files to backup" "WARNING"
        return $null
    }

    # Build metadata without here-strings
    $taskJson      = Get-TaskSummary | ConvertTo-Json -Compress
    $MetadataLines = @(
        "Backup Information",
        "==================",
        ("Backup Number:   " + $BackupNumber),
        ("Timestamp:       " + $Timestamp),
        ("Reason:          " + $Reason),
        ("Project:         " + $Script:Config.ProjectDir),
        ("File Count:      " + $Files.Count),
        ("Model:           " + $Script:Config.Model),
        "",
        "Tasks Summary:",
        $taskJson
    )
    $MetadataContent = $MetadataLines -join "`r`n"
    $MetadataFile    = Join-Path $env:TEMP "backup_metadata.txt"
    [System.IO.File]::WriteAllText($MetadataFile, $MetadataContent, [System.Text.Encoding]::UTF8)

    $TempBackup = Join-Path $env:TEMP ("goblin_backup_" + $BackupNumber)
    if (Test-Path -Path $TempBackup) {
        Remove-Item -Path $TempBackup -Recurse -Force
    }
    New-Item -ItemType Directory -Path $TempBackup -Force | Out-Null

    foreach ($File in $Files) {
        $RelativePath = $File.FullName.Substring($Script:Config.ProjectDir.Length + 1)
        $DestPath     = Join-Path $TempBackup $RelativePath
        $DestDir      = Split-Path $DestPath -Parent
        if (-not (Test-Path -Path $DestDir)) {
            New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
        }
        Copy-Item -Path $File.FullName -Destination $DestPath -Force
    }

    Copy-Item -Path $MetadataFile -Destination (Join-Path $TempBackup "BACKUP_METADATA.txt") -Force

    try {
        if ($Script:Config.DryRun) {
            Write-Log ("DRY RUN: Would create backup: " + $BackupName + " (" + $Files.Count + " files)") "DEBUG"
        }
        else {
            $SourceGlob = Join-Path $TempBackup "*"
            Compress-Archive -Path $SourceGlob -DestinationPath $BackupPath -Force
            Write-Log ("Backup created: " + $BackupName + " (" + $Files.Count + " files)") "SUCCESS"
        }
        return $BackupPath
    }
    catch {
        Write-Log ("Failed to create backup: " + $_) "ERROR"
        return $null
    }
    finally {
        Remove-Item -Path $TempBackup   -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -Path $MetadataFile -Force          -ErrorAction SilentlyContinue
    }
}

function Cleanup-OldBackups {
    if (-not (Test-Path -Path $Script:Config.BackupDir)) { return }

    $Backups = Get-ChildItem -Path $Script:Config.BackupDir -Filter "goblin_dice_rollaz_backup*.zip" |
               Sort-Object LastWriteTime -Descending

    if ($Backups.Count -gt $Script:Config.BackupKeepCount) {
        $ToDelete = $Backups | Select-Object -Skip $Script:Config.BackupKeepCount
        foreach ($Backup in $ToDelete) {
            if ($Script:Config.DryRun) {
                Write-Log ("DRY RUN: Would delete old backup: " + $Backup.Name) "DEBUG"
            }
            else {
                Remove-Item -Path $Backup.FullName -Force
                Write-Log ("Deleted old backup: " + $Backup.Name) "DEBUG"
            }
        }
    }
}
