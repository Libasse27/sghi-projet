# Script de demarrage du backend SGHI sans bases de donnees
# Pour le developpement initial

Write-Host "Demarrage du backend SGHI (mode sans DB)..." -ForegroundColor Green
Write-Host ""

# Nettoyer le dossier dist
if (Test-Path "backend\dist") {
    Write-Host "Nettoyage du dossier dist..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "backend\dist"
}

# Verifier que les node_modules existent
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Installation des dependances backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

Write-Host "Lancement du serveur..." -ForegroundColor Green
Write-Host ""
Write-Host "Note: Les bases de donnees sont desactivees (DISABLE_DB=true)" -ForegroundColor Cyan
Write-Host "   Pour activer les DB, modifiez backend\.env" -ForegroundColor Cyan
Write-Host ""

# Demarrer le backend
npm run backend:dev
