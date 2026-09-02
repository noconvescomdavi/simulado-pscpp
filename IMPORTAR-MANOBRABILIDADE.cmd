@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

set "ARQUIVO_JSON=%~1"
if not defined ARQUIVO_JSON set "ARQUIVO_JSON=%USERPROFILE%\Downloads\banco_300_questoes_manobrabilidade.json"

echo.
echo ============================================================
echo  SIMULADOS PSCPP - IMPORTADOR DE MANOBRABILIDADE
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERRO: Node.js nao foi encontrado.
  echo Instale o Node.js 20 ou superior e tente novamente.
  pause
  exit /b 1
)

if not exist "%ARQUIVO_JSON%" (
  echo ERRO: Arquivo nao encontrado:
  echo %ARQUIVO_JSON%
  echo.
  echo Arraste o JSON sobre este arquivo CMD ou informe o caminho entre aspas.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Instalando dependencias do projeto...
  call npm install
  if errorlevel 1 goto :erro
)

echo Importando e validando 300 questoes...
call npm run import:manobrabilidade -- "%ARQUIVO_JSON%"
if errorlevel 1 goto :erro

echo Validando o build de producao...
call npm run build
if errorlevel 1 goto :erro

echo.
echo ============================================================
echo  IMPORTACAO E BUILD CONCLUIDOS COM SUCESSO
echo ============================================================
echo.
echo Para publicar na Vercel, execute:
echo   git add .
echo   git commit -m "Adiciona 300 questoes de manobrabilidade"
echo   git push origin main
echo.
pause
exit /b 0

:erro
echo.
echo ERRO: a importacao ou o build falhou. Nenhuma publicacao foi feita.
pause
exit /b 1
