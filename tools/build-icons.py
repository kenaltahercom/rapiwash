#!/usr/bin/env python3
"""Bangun css/icons.css dari assets/icons/*.svg.
Ikon disematkan sebagai data URI agar tetap tampil saat index.html dibuka langsung dari file
(Chrome memblokir CSS mask dari file eksternal pada file://). Jalankan ulang setelah menambah/mengubah ikon:
    python3 tools/build-icons.py
"""
import glob, os, re
from urllib.parse import quote

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = ["/* Dibuat otomatis oleh tools/build-icons.py dari assets/icons/*.svg. Jangan diedit manual. */\n"]
for f in sorted(glob.glob(os.path.join(root, "assets/icons/*.svg"))):
    name = os.path.basename(f)[:-4]
    svg = open(f, encoding="utf-8").read().strip()
    svg = re.sub(r"\s+", " ", svg).replace('"', "'")
    out.append(f'.i-{name}{{--i:url("data:image/svg+xml,{quote(svg, safe=" /:=\'()-,.")}")}}\n')
open(os.path.join(root, "css/icons.css"), "w", encoding="utf-8").write("".join(out))
print(len(out) - 1, "ikon ->", "css/icons.css")
