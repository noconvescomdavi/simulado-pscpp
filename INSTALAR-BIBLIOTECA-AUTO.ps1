#requires -Version 5.1
$ErrorActionPreference="Stop"
$Repo="C:\simulado-pscpp"
$Here=Split-Path -Parent $MyInvocation.MyCommand.Path
if(!(Test-Path (Join-Path $Repo ".git"))){throw "Repositorio nao encontrado em $Repo"}

$items=@("db\migrations\006_library_search.sql","scripts\import_library_auto.py","scripts\seed_syllabus_topics.py","lib\library.js","app\api\library","biblioteca-pdfs\manifest.example.json")
foreach($item in $items){
  $src=Join-Path $Here $item;$dst=Join-Path $Repo $item
  if((Test-Path $src) -and (Get-Item $src).PSIsContainer){
    New-Item -ItemType Directory -Path $dst -Force|Out-Null
    Copy-Item (Join-Path $src "*") $dst -Recurse -Force
  }elseif(Test-Path $src){
    New-Item -ItemType Directory -Path (Split-Path $dst -Parent) -Force|Out-Null
    Copy-Item $src $dst -Force
  }
}
New-Item -ItemType Directory -Path (Join-Path $Repo "biblioteca-pdfs") -Force|Out-Null
$gi=Join-Path $Repo ".gitignore"
$txt=Get-Content $gi -Raw
foreach($line in @("biblioteca-pdfs/*.pdf","biblioteca-pdfs/manifest.json")){
  if($txt -notmatch [regex]::Escape($line)){Add-Content $gi "`r`n$line"}
}
Write-Host "Pacote instalado em $Repo" -ForegroundColor Green
Write-Host "Leia o README antes de importar os PDFs." -ForegroundColor Yellow
