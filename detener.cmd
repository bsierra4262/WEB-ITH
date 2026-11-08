@echo off
rem Detiene todo lo que levanta levantar.cmd: panel local 5173 (si existe), sitio 5174, API 5176, correo 2525, blog 5180 y MariaDB 3307.
setlocal
for %%p in (5173 5174 5176 2525 5180) do (
  for /f "tokens=5" %%i in ('netstat -ano ^| findstr /r /c:"127.0.0.1:%%p .*LISTENING"') do taskkill /PID %%i /F >nul 2>&1
)
"C:\Program Files\MariaDB 13.0\bin\mariadb-admin.exe" --protocol=pipe --socket=ith_wp_3307 -u%USERNAME% shutdown >nul 2>&1
echo Servidores detenidos.
endlocal
