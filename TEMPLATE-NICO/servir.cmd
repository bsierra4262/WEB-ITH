@echo off
rem ------------------------------------------------------------------
rem  Sitio principal de Intellihelp en local (la home, /diagnostico-sin-cargo/, /postulate/ y /privacidad/).
rem  Levanta cada servidor en su propia ventana, que queda abierta aunque el servidor se corte, asi se ve el error.
rem  Para cortar uno: Ctrl+C en su ventana y despues cerrarla.
rem    - Correo local en 127.0.0.1:2525 (dev\smtp-local.mjs): sin el, mail() falla y la consulta da error.
rem    - PHP en 127.0.0.1:5176 para api\agenda.php y api\contact.php, contra el CRM de pruebas.
rem    - Vite en http://127.0.0.1:5174/ con recarga en vivo; manda /api al PHP y /novedades al blog (vite.config.js).
rem  Si alguno ya esta corriendo (el puerto esta ocupado), no lo levanta de nuevo.
rem  El blog "Novedades" es el WordPress de ..\WORDPRESS: se levanta aparte con WORDPRESS\servir.cmd.
rem  La configuracion del CRM (clave y secreto) NO esta en esta carpeta: se usa la del sitio multipagina por la
rem  variable ITH_CRM_CONFIG. Si ya esta definida, se respeta.
rem ------------------------------------------------------------------
setlocal
set "AQUI=%~dp0"
if "%AQUI:~-1%"=="\" set "AQUI=%AQUI:~0,-1%"
set "RAIZ=%AQUI%\.."
set "PHP_DIR=%LOCALAPPDATA%\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe"
set "CA_BUNDLE=C:\Program Files\Git\mingw64\etc\ssl\certs\ca-bundle.crt"
set "VITE_JS=%RAIZ%\WEB\node_modules\vite\bin\vite.js"
if not defined ITH_CRM_CONFIG set "ITH_CRM_CONFIG=%RAIZ%\WEB\config\crm.local.php"

rem Abierto con doble clic: al final se espera una tecla para que esta ventana no se cierre sola.
set "DOBLE_CLIC=0"
for %%x in (%cmdcmdline%) do if /i "%%~x"=="/c" set "DOBLE_CLIC=1"

where node >nul 2>&1
if errorlevel 1 (
  echo No encuentro Node.js. Instalalo ^(20.19 o superior^) y volve a probar.
  goto error
)
if not exist "%PHP_DIR%\php.exe" (
  echo No encuentro PHP en %PHP_DIR%. Instalalo con: winget install PHP.PHP.8.2
  goto error
)
if not exist "%VITE_JS%" (
  echo No encuentro Vite en %VITE_JS%. Instalalo con: cd ..\WEB y npm install
  goto error
)
if not exist "%ITH_CRM_CONFIG%" echo Aviso: no existe %ITH_CRM_CONFIG%. La agenda va a mostrar el formulario de consulta.

rem --- Correo local ---------------------------------------------------
netstat -ano | findstr /r /c:"127.0.0.1:2525 .*LISTENING" >nul
if not errorlevel 1 (
  echo El correo local ya estaba corriendo en 127.0.0.1:2525.
) else (
  echo Arrancando el correo local en 127.0.0.1:2525...
  start "ITH correo local 2525" /d "%AQUI%" cmd /k ""node" "%AQUI%\dev\smtp-local.mjs" 2525"
)

rem --- PHP de la API --------------------------------------------------
netstat -ano | findstr /r /c:"127.0.0.1:5176 .*LISTENING" >nul
if not errorlevel 1 (
  echo El PHP de la API ya estaba corriendo en 127.0.0.1:5176.
) else (
  echo Arrancando el PHP de la API en 127.0.0.1:5176...
  start "ITH PHP 5176" /d "%AQUI%" cmd /k ""%PHP_DIR%\php.exe" -d extension_dir="%PHP_DIR%\ext" -d extension=curl -d extension=openssl -d extension=mbstring -d curl.cainfo="%CA_BUNDLE%" -d SMTP=127.0.0.1 -d smtp_port=2525 -d sendmail_from=no-reply@intellihelp.tech -S 127.0.0.1:5176 -t "%AQUI%""
)

rem --- Vite -----------------------------------------------------------
netstat -ano | findstr /r /c:"127.0.0.1:5174 .*LISTENING" >nul
if not errorlevel 1 (
  echo Vite ya estaba corriendo en http://127.0.0.1:5174/
) else (
  echo Arrancando Vite en http://127.0.0.1:5174/ ...
  start "ITH Vite 5174" /d "%AQUI%" cmd /k ""node" "%VITE_JS%" "%AQUI%" --port 5174 --strictPort --host 127.0.0.1"
)

echo.
echo   Sitio:  http://127.0.0.1:5174/
echo   Blog:   http://127.0.0.1:5174/novedades/  (necesita WORDPRESS\servir.cmd)
echo.
if "%DOBLE_CLIC%"=="1" pause
endlocal
exit /b 0

:error
echo.
if "%DOBLE_CLIC%"=="1" pause
endlocal
exit /b 1
