@echo off
rem Levanta el sitio, la API, el correo local, el blog y su base, sin ventanas.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0levantar.ps1"
for %%x in (%cmdcmdline%) do if /i "%%~x"=="/c" timeout /t 8 >nul
