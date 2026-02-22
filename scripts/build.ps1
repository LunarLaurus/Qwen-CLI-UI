#!/usr/bin/env pwsh
# Qwen CLI UI - Automated Build Script for Windows
# Usage: .\scripts\build.ps1 [-Environment production|development] [-SkipTests] [-Clean]

param(
    [ValidateSet('production', 'development')]
    [string]$Environment = 'production',
    
    [switch]$SkipTests,
    [switch]$Clean,
    [switch]$NoCache
)

$ErrorActionPreference = 'Stop'

# Colors for output
function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Error { Write-Host "[ERROR] $args" -ForegroundColor Red }
function Write-Warning { Write-Host "[WARN] $args" -ForegroundColor Yellow }

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

Write-Info "Qwen CLI UI Build Script"
Write-Info "========================"
Write-Info "Environment: $Environment"
Write-Info "Project Root: $ProjectRoot"

# Change to project directory
Set-Location $ProjectRoot

# Check Node.js version
Write-Info "Checking Node.js version..."
$NodeVersion = node --version
Write-Info "Node.js version: $NodeVersion"

# Check if version is 20.19+ or 22.12+
$MajorVersion = [int]($NodeVersion -replace 'v(\d+)\..*', '$1')
$MinorVersion = [int]($NodeVersion -replace 'v\d+\.(\d+)\..*', '$1')

if ($MajorVersion -lt 20 -or ($MajorVersion -eq 20 -and $MinorVersion -lt 19)) {
    Write-Warning "Node.js 20.19+ or 22.12+ is recommended. Current: $NodeVersion"
}

# Clean if requested
if ($Clean) {
    Write-Info "Cleaning build artifacts..."
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
        Write-Info "Removed dist/"
    }
    if (Test-Path "node_modules\.vite") {
        Remove-Item -Recurse -Force "node_modules\.vite"
        Write-Info "Removed node_modules/.vite/"
    }
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Info "Installing dependencies..."
    npm install
}

# Run tests unless skipped
if (-not $SkipTests) {
    Write-Info "Running tests..."
    $TestResult = npm test 2>&1
    $TestExitCode = $LASTEXITCODE
    
    if ($TestExitCode -ne 0) {
        Write-Warning "Tests failed with exit code $TestExitCode"
        Write-Warning "Continuing build anyway (use -SkipTests to skip tests)"
    } else {
        Write-Success "All tests passed"
    }
}

# Build frontend
Write-Info "Building frontend..."
if ($NoCache) {
    $env:VITE_NO_CACHE = 'true'
}

if ($Environment -eq 'production') {
    npm run build
} else {
    npm run build -- --mode development
}

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

Write-Success "Build completed successfully!"
Write-Info "Output directory: dist/"

# Show build stats
if (Test-Path "dist") {
    $BuildSize = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Info "Total build size: $([math]::Round($BuildSize, 2)) MB"
}

Write-Success "Build ready for deployment!"
