@echo off
rem ------------------------------------------------------------------
rem  Detiene el WordPress local de Intellihelp: servidor PHP (5180) y
rem  la instancia propia de MariaDB (3307). No toca otros servicios.
rem ------------------------------------------------------------------
setlocal
set "MARIADB=C:\Program Files\MariaDB 13.0\bin"

set "HABIA=0"
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:"127.0.0.1:5180 .*LISTENING"') do (
  taskkill /PID %%p /F >nul 2>&1
  set "HABIA=1"
)
if "%HABIA%"=="1" (echo Sitio en 5180 detenido.) else (echo El sitio en 5180 no estaba corriendo.)

rem Apagado limpio por named pipe con el usuario de Windows (permiso SHUTDOWN solamente).
"%MARIADB%\mariadb-admin.exe" --protocol=pipe --socket=ith_wp_3307 -u%USERNAME% shutdown >nul 2>&1
if not errorlevel 1 (
  echo MariaDB 3307 detenida.
  goto fin
)
netstat -ano | findstr /r /c:"127.0.0.1:3307 .*LISTENING" >nul
if errorlevel 1 (
  echo MariaDB 3307 no estaba corriendo.
) else (
  echo No se pudo apagar MariaDB 3307 de forma limpia. Usar la clave root de CREDENCIALES-LOCALES.txt:
  echo   "%MARIADB%\mariadb-admin.exe" -h127.0.0.1 -P3307 -uroot -p shutdown
)

:fin
endlocal
