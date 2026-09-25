$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "Preparando ESTIBORDO LOCAL..." -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "Instale Node.js 20 ou superior." }
$major = [int]((node --version).TrimStart("v").Split(".")[0])
if ($major -lt 20) { throw "Node.js 20 ou superior e necessario." }

if (-not (Test-Path ".env.local")) {
@"
DATABASE_URL=postgresql://postgres:TROQUE_A_SENHA@127.0.0.1:5432/pscpp
AUTH_SECRET=TROQUE_POR_UMA_CHAVE_LOCAL_COM_PELO_MENOS_32_CARACTERES
AUTH_SESSION_DAYS=90
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=ESTIBORDO
DB_POOL_MAX=10
"@ | Set-Content ".env.local" -Encoding UTF8
  Write-Host ".env.local criado. Ajuste DATABASE_URL e AUTH_SECRET antes de iniciar." -ForegroundColor Yellow
}
npm ci
npm run build
Write-Host "Base local preparada. Execute scripts\iniciar-estibordo-local.ps1." -ForegroundColor Green
