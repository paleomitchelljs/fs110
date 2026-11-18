#!/bin/bash
# Screenshot slides headless: tools/shoot.sh OUTDIR L3/4.1 L3/5 ...
# Needs Google Chrome. Each name is the address hash: level/segment.build.
OUT=$1; shift; mkdir -p "$OUT"
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
for h in "$@"; do
  "$C" --headless=new --disable-gpu --hide-scrollbars --window-size=1600,900 --virtual-time-budget=4000 \
    --screenshot="$OUT/${h//\//_}.png" "file://$HERE/index.html#$h" >/dev/null 2>&1
done
