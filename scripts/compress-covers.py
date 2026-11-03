# -*- coding: utf-8 -*-
"""Compress public/obkl covers into lightweight webp and refresh the manifest."""
import os
import shutil
from PIL import Image, ImageDraw, ImageFont

SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OBKL = os.path.join(SITE, "public", "obkl")
OUT = os.path.join(SITE, "public", "covers")
MANIFEST = os.path.join(SITE, "src", "galleryManifest.js")
BACKUP = os.path.abspath(os.path.join(SITE, "..", "obkl-originals"))

os.makedirs(OUT, exist_ok=True)

# Seasonal covers first — filenames matched by a unique fragment, without publishing children's names.
SEASONAL = [
    ("казка", "Зимова казка"),
    ("подарунк", "З подарунками"),
    ("Макара", "Різдвяна"),
    ("Соломії", "Різдвяний вечір"),
    ("Софії", "Святкова зима"),
    ("санях", "У санях"),
]


def save_webp(src, dest, max_w=900, quality=82):
    with Image.open(src) as im:
        im = im.convert("RGB")
        w, h = im.size
        if w > max_w:
            h = max(1, int(round(h * max_w / w)))
            w = max_w
            im = im.resize((w, h), Image.Resampling.LANCZOS)
        im.save(dest, "WEBP", quality=quality, method=6)
        return w, h


if not os.path.isdir(OBKL) or not os.listdir(OBKL):
    raise SystemExit("Drop new covers into public/obkl, then run this script. Existing webp covers were left untouched.")
files = [f for f in os.listdir(OBKL) if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))]
used = set()
ordered = []
for fragment, title in SEASONAL:
    match = next((f for f in files if fragment in f and f not in used), None)
    if match:
        used.add(match)
        ordered.append((match, title))

for f in sorted(files):
    if f not in used:
        ordered.append((f, "Персональна"))

for old in os.listdir(OUT):
    if old.startswith("cover-") and old.endswith(".webp"):
        os.remove(os.path.join(OUT, old))

covers = []
for i, (name, title) in enumerate(ordered, start=1):
    dest_name = f"cover-{i:02d}.webp"
    w, h = save_webp(os.path.join(OBKL, name), os.path.join(OUT, dest_name))
    size = os.path.getsize(os.path.join(OUT, dest_name))
    covers.append({"src": f"/covers/{dest_name}", "w": w, "h": h, "title": title})
    print(f"{dest_name}  {size // 1024} KB  <-  {name}")

# Refresh covers in the existing manifest, keep real-life items.
real_block = ""
if os.path.isfile(MANIFEST):
    text = open(MANIFEST, encoding="utf-8").read()
    marker = "export const realLife"
    if marker in text:
        real_block = text[text.index(marker):]
if not real_block.strip():
    real_block = "export const realLife = [\n];\n"

lines = ["// Covers are compressed from public/obkl. Add a webp to public/covers and a line here."]
lines.append("export const covers = [")
for item in covers:
    title = item["title"].replace("'", "\\'")
    lines.append(
        "  { src: '%s', w: %d, h: %d, title: '%s' }," % (item["src"], item["w"], item["h"], title)
    )
lines.append("];")
lines.append("")
lines.append(real_block.strip())
lines.append("")
with open(MANIFEST, "w", encoding="utf-8") as handle:
    handle.write("\n".join(lines))

if covers:
    og = Image.new("RGB", (1200, 630), "#10281F")
    draw = ImageDraw.Draw(og)
    draw.rectangle((0, 0, 16, 630), fill="#C6A15B")
    font = r"C:\Windows\Fonts\segoeuib.ttf"
    draw.text((64, 70), "ПОДАРУНОК ДО МИКОЛАЯ", font=ImageFont.truetype(font, 28), fill="#E7C98A")
    draw.text((64, 128), "Розмальовка\nпо вашому фото", font=ImageFont.truetype(font, 56), fill="#FFF8EF")
    draw.text((64, 330), "У комплекті: календар А5\nна 2027 і 2 стікерпаки", font=ImageFont.truetype(font, 30), fill="#F3E6D0")
    draw.text((64, 520), "my-rozm.shop   ·   від 400 грн", font=ImageFont.truetype(font, 28), fill="#C6A15B")
    with Image.open(os.path.join(OUT, "cover-01.webp")) as cover:
        cover = cover.convert("RGB")
        cover.thumbnail((400, 540), Image.Resampling.LANCZOS)
        framed = Image.new("RGB", (cover.width + 16, cover.height + 16), "#F6E7C1")
        framed.paste(cover, (8, 8))
        og.paste(framed, (740, int((630 - framed.height) / 2)))
    og.save(os.path.join(SITE, "public", "og.jpg"), "JPEG", quality=82, optimize=True)

os.makedirs(BACKUP, exist_ok=True)
for name in files:
    src = os.path.join(OBKL, name)
    dst = os.path.join(BACKUP, name)
    if os.path.isfile(src):
        shutil.move(src, dst)
print("moved originals to", BACKUP)
print("covers", len(covers))
