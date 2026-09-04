@echo off
setlocal EnableExtensions
chcp 65001 >nul

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%CD%"

:find_from_current
if exist "%PROJECT_ROOT%\package.json" goto project_found
for %%I in ("%PROJECT_ROOT%\..") do set "PARENT=%%~fI"
if /I "%PARENT%"=="%PROJECT_ROOT%" goto try_script_dir
set "PROJECT_ROOT=%PARENT%"
goto find_from_current

:try_script_dir
for %%I in ("%SCRIPT_DIR%.") do set "PROJECT_ROOT=%%~fI"

:find_from_script
if exist "%PROJECT_ROOT%\package.json" goto project_found
for %%I in ("%PROJECT_ROOT%\..") do set "PARENT=%%~fI"
if /I "%PARENT%"=="%PROJECT_ROOT%" goto ask_project
set "PROJECT_ROOT=%PARENT%"
goto find_from_script

:ask_project
echo Não foi possível localizar automaticamente a raiz do projeto.
set /p "PROJECT_ROOT=Informe o caminho completo da pasta que contém package.json: "
if not exist "%PROJECT_ROOT%\package.json" goto invalid_project

:project_found
where node >nul 2>nul || goto missing_node
where npm.cmd >nul 2>nul || goto missing_npm

set "BANK_SOURCE=%SCRIPT_DIR%data\questions\conhecimentos-gerais.json"
set "VALIDATOR_SOURCE=%SCRIPT_DIR%scripts\validate-question-bank.mjs"
set "BANK_TARGET=%PROJECT_ROOT%\data\questions\conhecimentos-gerais.json"
set "VALIDATOR_TARGET=%PROJECT_ROOT%\scripts\validate-question-bank.mjs"

if not exist "%BANK_SOURCE%" goto missing_payload
if not exist "%VALIDATOR_SOURCE%" goto missing_payload
if not exist "%PROJECT_ROOT%\data\questions" mkdir "%PROJECT_ROOT%\data\questions"
if not exist "%PROJECT_ROOT%\scripts" mkdir "%PROJECT_ROOT%\scripts"

for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set "STAMP=%%I"
if not defined STAMP set "STAMP=backup"

if exist "%BANK_TARGET%" (
  set "BANK_BACKUP=%BANK_TARGET%.backup-%STAMP%"
  copy /Y "%BANK_TARGET%" "%BANK_BACKUP%" >nul || goto backup_failed
)
if exist "%VALIDATOR_TARGET%" (
  set "VALIDATOR_BACKUP=%VALIDATOR_TARGET%.backup-%STAMP%"
  copy /Y "%VALIDATOR_TARGET%" "%VALIDATOR_BACKUP%" >nul || goto backup_failed
)

copy /Y "%BANK_SOURCE%" "%BANK_TARGET%" >nul || goto install_failed
copy /Y "%VALIDATOR_SOURCE%" "%VALIDATOR_TARGET%" >nul || goto install_failed

pushd "%PROJECT_ROOT%"
echo.
echo [1/2] Validando o banco...
node scripts\validate-question-bank.mjs data\questions\conhecimentos-gerais.json
if errorlevel 1 goto validation_failed

echo.
echo [2/2] Executando o build da aplicação...
call npm.cmd run build
if errorlevel 1 goto build_failed

echo.
echo Instalação e validações concluídas com sucesso.
choice /C SN /N /M "Deseja criar um commit local com estes dois arquivos? [S/N] "
if errorlevel 2 goto success
where git >nul 2>nul || goto missing_git
git add -- data/questions/conhecimentos-gerais.json scripts/validate-question-bank.mjs
git commit -m "Adiciona banco de Conhecimentos Gerais com 1000 questões"
if errorlevel 1 goto commit_failed
choice /C SN /N /M "Deseja enviar o commit para o remoto agora? [S/N] "
if errorlevel 2 goto success
git push
if errorlevel 1 goto push_failed
goto success

:validation_failed
popd
echo ERRO: o validador rejeitou o banco. Restaurando os arquivos anteriores.
goto rollback

:build_failed
popd
echo ERRO: o build falhou. Restaurando os arquivos anteriores.
goto rollback

:rollback
if defined BANK_BACKUP copy /Y "%BANK_BACKUP%" "%BANK_TARGET%" >nul
if defined VALIDATOR_BACKUP copy /Y "%VALIDATOR_BACKUP%" "%VALIDATOR_TARGET%" >nul
exit /b 1

:success
popd
echo Nenhum push foi executado sem confirmação explícita.
pause
exit /b 0

:invalid_project
echo ERRO: o caminho informado não contém package.json.
exit /b 1

:missing_node
echo ERRO: Node.js não foi localizado no PATH.
exit /b 1

:missing_npm
echo ERRO: npm.cmd não foi localizado no PATH.
exit /b 1

:missing_git
popd
echo O banco foi instalado e testado, mas o Git não foi localizado. Nenhum commit foi criado.
pause
exit /b 0

:missing_payload
echo ERRO: o JSON ou o validador não foi encontrado dentro deste pacote.
exit /b 1

:backup_failed
echo ERRO: não foi possível criar o backup. Nenhum arquivo foi substituído.
exit /b 1

:install_failed
echo ERRO: não foi possível copiar os arquivos. Restaurando o que for possível.
goto rollback

:commit_failed
popd
echo O banco foi instalado e testado, mas o commit não foi criado. Nenhum push foi executado.
pause
exit /b 1

:push_failed
popd
echo O commit local foi criado, mas o push falhou. Verifique o remoto e tente novamente.
pause
exit /b 1
