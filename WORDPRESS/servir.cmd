@echo off
rem ------------------------------------------------------------------
rem  WordPress local de Intellihelp
rem  Levanta MariaDB (127.0.0.1:3307) si no esta corriendo y el servidor
rem  PHP en http://127.0.0.1:5180, cada uno en su propia ventana.
rem  Es solo el blog "Novedades"; el sitio principal es el HTML de
rem  ..\TEMPLATE-NICO (servir.cmd de esa carpeta).
rem  Para cortar todo: detener.cmd
rem ------------------------------------------------------------------
setlocal
set "RAIZ=%~dp0"
if "%RAIZ:~-1%"=="\" set "RAIZ=%RAIZ:~0,-1%"
set "MARIADB=C:\Program Files\MariaDB 13.0\bin"
set "PHPEXE=%LOCALAPPDATA%\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe"
set "PHPRC=%RAIZ%\php"
rem Abierto con doble clic: al final se espera una tecla para que esta ventana no se cierre sola.
set "DOBLE_CLIC=0"
for %%x in (%cmdcmdline%) do if /i "%%~x"=="/c" set "DOBLE_CLIC=1"

rem --- MariaDB --------------------------------------------------------
"%MARIADB%\mariadb-admin.exe" --protocol=pipe --socket=ith_wp_3307 -u%USERNAME% ping >nul 2>&1
if not errorlevel 1 (
  echo MariaDB ya estaba corriendo en 127.0.0.1:3307.
  goto php
)
netstat -ano | findstr /r /c:"127.0.0.1:3307 .*LISTENING" >nul
if not errorlevel 1 (
  echo MariaDB ya estaba corriendo en 127.0.0.1:3307.
  goto php
)
echo Arrancando MariaDB en 127.0.0.1:3307...
start "ITH WordPress - MariaDB 3307" /min "%MARIADB%\mariadbd.exe" --defaults-file="%RAIZ%\datos\mariadb\my.ini"
set /a INTENTOS=0
:esperar_db
ping -n 2 127.0.0.1 >nul
netstat -ano | findstr /r /c:"127.0.0.1:3307 .*LISTENING" >nul
if not errorlevel 1 goto db_ok
set /a INTENTOS+=1
if %INTENTOS% lss 20 goto esperar_db
echo No arranco MariaDB. Revisar datos\mariadb\mariadb.err
if "%DOBLE_CLIC%"=="1" pause
exit /b 1
:db_ok
echo MariaDB lista.

rem --- Servidor PHP ---------------------------------------------------
:php
netstat -ano | findstr /r /c:"127.0.0.1:5180 .*LISTENING" >nul
if not errorlevel 1 (
  echo El sitio ya estaba corriendo en http://127.0.0.1:5180/
  goto fin
)
echo Arrancando el sitio en http://127.0.0.1:5180/ ...
start "ITH WordPress - 127.0.0.1:5180" /min /d "%RAIZ%\sitio" "%PHPEXE%" -c "%RAIZ%\php\php.ini" -S 127.0.0.1:5180 -t "%RAIZ%\sitio" "%RAIZ%\php\router.php"

:fin
echo.
echo   Sitio:  http://127.0.0.1:5180/
echo   Admin:  http://127.0.0.1:5180/wp-admin/
echo   Claves: CREDENCIALES-LOCALES.txt
echo.
if "%DOBLE_CLIC%"=="1" pause
endlocal
