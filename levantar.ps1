# Levanta en segundo plano (sin ventanas) solo lo que usa el proyecto:
#   Sitio        http://127.0.0.1:5174/            (TEMPLATE-NICO, Vite)
#   API PHP      127.0.0.1:5176                    (agenda y consulta)
#   Correo local 127.0.0.1:2525
#   Blog         http://127.0.0.1:5180/            (WordPress, solo Novedades)
#   MariaDB      127.0.0.1:3307                    (base del blog)
# Si un puerto ya está ocupado, no lo vuelve a levantar. Para cortar todo: detener.cmd
# Los registros de cada servidor quedan en %TEMP%\ith-servidores\.

$raiz = $PSScriptRoot
$nico = Join-Path $raiz 'TEMPLATE-NICO'
$wp   = Join-Path $raiz 'WORDPRESS'
$php  = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe'
$maria = 'C:\Program Files\MariaDB 13.0\bin'
$vite = Join-Path $raiz 'OLD\web-multipagina-vite\node_modules\vite\bin\vite.js'
$ca   = 'C:\Program Files\Git\mingw64\etc\ssl\certs\ca-bundle.crt'
$logs = Join-Path $env:TEMP 'ith-servidores'
New-Item -ItemType Directory -Force $logs | Out-Null
if (-not $env:ITH_CRM_CONFIG) { $env:ITH_CRM_CONFIG = Join-Path $raiz 'config\crm.local.php' }

# Animaciones de Windows: al iniciar sesión a veces se apagan solas y el navegador
# entonces muestra la página sin movimiento (prefers-reduced-motion). Se vuelven a prender.
try {
  Add-Type -Namespace ITH -Name Anim -MemberDefinition '[DllImport("user32.dll")] public static extern bool SystemParametersInfo(int a, int b, IntPtr c, int d);' -ErrorAction Stop
  [ITH.Anim]::SystemParametersInfo(0x1043, 0, [IntPtr]1, 3) | Out-Null
  Write-Host 'Animaciones de Windows activadas.'
} catch {}

function Ocupado($puerto) {
  [bool](Get-NetTCPConnection -State Listen -LocalPort $puerto -ErrorAction SilentlyContinue)
}
function Levantar($nombre, $puerto, $exe, $argumentos, $dir) {
  if (Ocupado $puerto) { Write-Host "$nombre ya estaba corriendo ($puerto)."; return }
  Start-Process -FilePath $exe -ArgumentList $argumentos -WorkingDirectory $dir -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $logs "$puerto.log") -RedirectStandardError (Join-Path $logs "$puerto.err")
  Write-Host "$nombre arrancado ($puerto)."
}

# Orion (panel 5173) dado de baja el 09/11/2026: no se levanta más.
Levantar 'Correo local' 2525 'node' @("`"$nico\dev\smtp-local.mjs`"", '2525') $nico
Levantar 'API PHP' 5176 "$php\php.exe" @('-d', "extension_dir=`"$php\ext`"", '-d', 'extension=curl', '-d', 'extension=openssl', '-d', 'extension=mbstring', '-d', "curl.cainfo=`"$ca`"", '-d', 'SMTP=127.0.0.1', '-d', 'smtp_port=2525', '-d', 'sendmail_from=no-reply@intellihelp.tech', '-S', '127.0.0.1:5176', '-t', "`"$nico`"") $nico
Levantar 'Sitio (Vite)' 5174 'node' @("`"$vite`"", "`"$nico`"", '--port', '5174', '--strictPort', '--host', '127.0.0.1') $nico
Levantar 'MariaDB' 3307 "$maria\mariadbd.exe" @("--defaults-file=`"$wp\datos\mariadb\my.ini`"") $wp
for ($i = 0; $i -lt 20 -and -not (Ocupado 3307); $i++) { Start-Sleep -Milliseconds 500 }
$env:PHPRC = "$wp\php"
Levantar 'Blog (WordPress)' 5180 "$php\php.exe" @('-c', "`"$wp\php\php.ini`"", '-S', '127.0.0.1:5180', '-t', "`"$wp\sitio`"", "`"$wp\php\router.php`"") "$wp\sitio"

Write-Host ''
Write-Host '  Sitio:  http://127.0.0.1:5174/'
Write-Host '  Blog:   http://127.0.0.1:5180/  (admin: /wp-admin/)'
