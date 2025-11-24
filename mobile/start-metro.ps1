# Script PowerShell pour démarrer Metro Bundler proprement
Write-Host "=== Démarrage de Metro Bundler ===" -ForegroundColor Cyan

# 1. Tuer les processus Metro existants sur le port 8081
Write-Host "`nRecherche des processus sur le port 8081..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    foreach ($pid in $processes) {
        Write-Host "  Arrêt du processus PID $pid..." -ForegroundColor Red
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "  ✓ Port 8081 libéré" -ForegroundColor Green
} else {
    Write-Host "  ✓ Port 8081 déjà libre" -ForegroundColor Green
}

# 2. Démarrer Metro
Write-Host "`nDémarrage de Metro Bundler..." -ForegroundColor Yellow
npm start
