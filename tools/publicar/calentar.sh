#!/usr/bin/env bash
# Después de limpiar la caché del hosting (que vacía también la CDN), pide cada página unas veces para que la CDN la
# vuelva a guardar: así el primer visitante real no espera al servidor. Muestra el tiempo de respuesta y si salió de
# la CDN (HIT) o del servidor (DYNAMIC/MISS).
set -u
BASE="https://www.intellihelp.tech"
for ruta in / /diagnostico-sin-cargo/ /postulate/ /privacidad/ /gracias-reserva/ /novedades/; do
  for i in 1 2 3; do
    curl -s -o /dev/null -D /tmp/calentar.h -H "Accept-Encoding: br" "$BASE$ruta"
    sleep 1
  done
  estado=$(grep -i "x-hcdn-cache-status" /tmp/calentar.h | tr -d '\r' | awk '{print $2}')
  t=$(curl -s -o /dev/null -w "%{time_starttransfer}" -H "Accept-Encoding: br" "$BASE$ruta")
  printf "%-26s %-8s %ss\n" "$ruta" "${estado:-?}" "$t"
done
