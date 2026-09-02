@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================================================
echo  ESTIBORDO - SIMULADO INTERATIVO E METRICAS
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERRO: Node.js nao foi encontrado.
  echo Instale o Node.js 20 ou superior e tente novamente.
  pause
  exit /b 1
)

echo Instalando ou conferindo dependencias...
call npm install
if errorlevel 1 goto :erro

echo.
echo Validando o build de producao...
call npm run build
if errorlevel 1 goto :erro

echo.
echo ============================================================
echo  ATUALIZACAO VALIDADA COM SUCESSO
echo ============================================================
echo.
echo Para publicar na Vercel, execute:
echo   git add .
echo   git commit -m "Adiciona prova interativa e metricas por materia"
echo   git push origin main
echo.
pause
exit /b 0

:erro
echo.
echo ERRO: a instalacao ou o build falhou. Nenhuma publicacao foi feita.
pause
exit /b 1
