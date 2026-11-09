"""Prepara la publicación del sitio (TEMPLATE-NICO) para que cargue lo más rápido posible.

Qué hace, en orden:
  1. Fuente: calcula la versión de fonts/*.woff2 (hash del contenido) y la escribe en el @font-face de css/styles.css
     y en los <link rel="preload"> de cada página. Las dos direcciones tienen que coincidir: si no, el navegador baja
     la fuente dos veces.
  2. CSS y JS: arma en tools/publicar/dist/ una copia minificada de cada archivo de css/ y js/ (esbuild, sin juntar ni
     transformar el código: solo saca comentarios y espacios). El código fuente queda igual, con sus comentarios.
  3. Páginas: en cada .html cambia las direcciones de css/, js/ y fonts/ para que lleven ?v=<versión>, calculada sobre
     el archivo minificado. El servidor guarda un año lo que tiene versión (ver .htaccess, ITH_VERSIONADO): en la
     segunda visita no se descarga nada, y apenas un archivo cambia, cambia su versión y el navegador lo pide de nuevo.

Uso (desde la raíz del repo):  python tools/publicar/construir.py
Después se suben al servidor los .html de TEMPLATE-NICO y el contenido de tools/publicar/dist/ (css/ y js/).
"""
import hashlib
import pathlib
import re
import shutil
import subprocess
import sys

RAIZ = pathlib.Path(__file__).resolve().parents[2]
SITIO = RAIZ / 'TEMPLATE-NICO'
DIST = pathlib.Path(__file__).resolve().parent / 'dist'
PAGINAS = [p for p in SITIO.rglob('*.html') if not ({'node_modules', 'dev', 'video'} & set(p.relative_to(SITIO).parts))]


def version(datos: bytes) -> str:
    return hashlib.sha256(datos).hexdigest()[:10]


def esbuild(origen: pathlib.Path, destino: pathlib.Path) -> None:
    destino.parent.mkdir(parents=True, exist_ok=True)
    r = subprocess.run(
        f'npx --yes esbuild@0.28.2 "{origen}" --minify --log-level=error --charset=utf8 --outfile="{destino}"',
        shell=True, capture_output=True, text=True)
    if r.returncode != 0 or not destino.exists():
        sys.exit(f'esbuild falló con {origen.name}:\n{r.stderr}')


def main() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)

    # 1. Fuente con versión, en el CSS de origen (así el minificado ya la trae)
    versiones = {}
    for fuente in sorted((SITIO / 'fonts').glob('*.woff2')):
        versiones[f'fonts/{fuente.name}'] = version(fuente.read_bytes())
    estilos = SITIO / 'css' / 'styles.css'
    texto = estilos.read_text(encoding='utf-8')
    for ruta, v in versiones.items():
        nombre = ruta.split('/')[-1]
        texto = re.sub(r'(\.\./fonts/' + re.escape(nombre) + r')(\?v=[\w-]+)?(?=["\')])', rf'\1?v={v}', texto)
    estilos.write_text(texto, encoding='utf-8')

    # 2. CSS y JS minificados
    for carpeta, ext in (('css', '.css'), ('js', '.js')):
        for origen in sorted((SITIO / carpeta).glob('*' + ext)):
            destino = DIST / carpeta / origen.name
            esbuild(origen, destino)
            versiones[f'{carpeta}/{origen.name}'] = version(destino.read_bytes())
            print(f'  {carpeta}/{origen.name}: {origen.stat().st_size // 1024} KB -> {destino.stat().st_size // 1024} KB')

    # 3. Páginas: ?v= en cada referencia (css/x.css, ../css/x.css, /css/x.css)
    patron = re.compile(r'((?:href|src)=")((?:\.\./|/)?)((?:css|js|fonts)/[\w.-]+\.(?:css|js|woff2))(\?v=[\w-]+)?(")')
    for pagina in PAGINAS:
        html = pagina.read_text(encoding='utf-8')
        nuevo = patron.sub(lambda m: f'{m[1]}{m[2]}{m[3]}?v={versiones[m[3]]}{m[5]}' if m[3] in versiones else m[0], html)
        if nuevo != html:
            pagina.write_text(nuevo, encoding='utf-8')
            print(f'  {pagina.relative_to(SITIO)}: versiones actualizadas')
    print(f'Listo: {len(versiones)} archivos con versión; copia minificada en {DIST.relative_to(RAIZ)}')


if __name__ == '__main__':
    main()
