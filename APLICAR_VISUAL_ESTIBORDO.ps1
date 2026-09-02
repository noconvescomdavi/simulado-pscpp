param([string]$Repo="C:\simulado-pscpp")
$ErrorActionPreference="Stop"
$Source=Split-Path -Parent $MyInvocation.MyCommand.Path
if(!(Test-Path $Repo)){throw "Repositorio nao encontrado: $Repo"}
$Backup=Join-Path $Repo ("_backup_visual_estibordo_"+(Get-Date -Format "yyyyMMdd_HHmmss"))
New-Item -ItemType Directory -Force -Path (Join-Path $Backup "app") | Out-Null
foreach($f in @("components.js","layout.js","page.js","globals.css")){
  $orig=Join-Path $Repo "app\$f"
  if(Test-Path $orig){Copy-Item $orig (Join-Path $Backup "app\$f") -Force}
}
Copy-Item (Join-Path $Source "app\*") (Join-Path $Repo "app") -Force
New-Item -ItemType Directory -Force -Path (Join-Path $Repo "public\estibordo") | Out-Null
Copy-Item (Join-Path $Source "public\estibordo\*") (Join-Path $Repo "public\estibordo") -Recurse -Force
Write-Host ""
Write-Host "ESTIBORDO FINAL aplicado com sucesso — logo e lancha aprovadas." -ForegroundColor Green
Write-Host "Backup: $Backup" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para testar no PowerShell:"
Write-Host "Set-Location C:\simulado-pscpp"
Write-Host "npm run dev"
