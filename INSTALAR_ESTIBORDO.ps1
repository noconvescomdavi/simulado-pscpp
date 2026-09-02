param(
  [string]$Repo = "C:\simulado-pscpp"
)

$ErrorActionPreference = "Stop"
$Source = Split-Path -Parent $MyInvocation.MyCommand.Path
$Backup = Join-Path $Repo ("_backup_estibordo_" + (Get-Date -Format "yyyyMMdd_HHmmss"))

Write-Host "ESTIBORDO - instalando identidade no site..." -ForegroundColor Cyan
Write-Host "Repositorio: $Repo"

if (!(Test-Path $Repo)) {
  throw "Repositorio nao encontrado: $Repo"
}

New-Item -ItemType Directory -Force -Path $Backup | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Backup "app") | Out-Null

foreach ($f in @("components.js","layout.js","page.js","globals.css")) {
  $current = Join-Path $Repo "app\$f"
  if (Test-Path $current) {
    Copy-Item $current (Join-Path $Backup "app\$f") -Force
  }
}

Copy-Item (Join-Path $Source "app\*") (Join-Path $Repo "app") -Recurse -Force

$PublicTarget = Join-Path $Repo "public\estibordo"
New-Item -ItemType Directory -Force -Path $PublicTarget | Out-Null
Copy-Item (Join-Path $Source "public\estibordo\*") $PublicTarget -Recurse -Force

Write-Host ""
Write-Host "Arquivos aplicados." -ForegroundColor Green
Write-Host "Backup criado em: $Backup" -ForegroundColor Yellow
Write-Host ""
Write-Host "Agora execute:" -ForegroundColor Cyan
Write-Host "  cd /d C:\simulado-pscpp"
Write-Host "  npm install"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Abra: http://localhost:3000"
