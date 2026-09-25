$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host ""
Write-Host "ESTIBORDO LOCAL" -ForegroundColor Cyan
Write-Host "---------------"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "Node.js nao encontrado no PATH." }
if (-not (Test-Path ".env.local")) {
  Write-Host "Arquivo .env.local ausente. Crie-o com DATABASE_URL apontando para o PostgreSQL local." -ForegroundColor Yellow
  exit 1
}

if (-not (Test-Path "node_modules")) {
  Write-Host "Instalando dependencias..."
  npm ci
}

if (-not (Test-Path ".next")) {
  Write-Host "Gerando build local..."
  npm run build
}

$ips = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } |
  Select-Object -ExpandProperty IPAddress -Unique

Write-Host ""
Write-Host "Computador: http://localhost:3000" -ForegroundColor Green
foreach ($ip in $ips) { Write-Host "Rede/Hotspot: http://$($ip):3000" -ForegroundColor Green }
Write-Host ""
Write-Host "O servidor permanecera ativo enquanto esta janela estiver aberta." -ForegroundColor DarkGray

npm run start -- -H 0.0.0.0 -p 3000
