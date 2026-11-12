"""Генерация иконок PWA «Е-Паслуга» без npm-пакетов (нужен только Pillow).

Запуск из корня репозитория:  python scripts/make_icons.py

Знак — буква «Е» из трёх скруглённых штрихов; средний штрих короче
и заканчивается оранжевой точкой (цвет «Далони»): «у вас что-то есть».
Геометрия задана в сетке 512×512 и одинакова для PNG и favicon.svg.
"""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
ICONS = PUBLIC / "icons"

BG = "#1e2a8a"  # --color-navy-deep
GLYPH = "#ffffff"
DOT = "#e2a06f"  # --color-family-orange
CORNER = 112  # скругление «обычной» иконки в сетке 512

# Штрихи буквы: (x1, y1, x2, y2), скругление = половина толщины
BARS = [
    (156, 136, 204, 376),  # ствол
    (156, 136, 356, 184),  # верх
    (156, 232, 284, 280),  # середина
    (156, 328, 356, 376),  # низ
]
DOT_CIRCLE = (332, 256, 24)  # cx, cy, r
SS = 4  # суперсэмплинг для сглаживания


def draw_icon(size: int, rounded: bool, scale: float = 1.0) -> Image.Image:
    big = size * SS
    k = big / 512
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if rounded:
        d.rounded_rectangle((0, 0, big - 1, big - 1), radius=round(CORNER * k), fill=BG)
    else:
        d.rectangle((0, 0, big, big), fill=BG)

    def tx(v: float) -> float:
        return (256 + (v - 256) * scale) * k

    for x1, y1, x2, y2 in BARS:
        r = min(x2 - x1, y2 - y1) / 2 * scale * k
        d.rounded_rectangle((tx(x1), tx(y1), tx(x2), tx(y2)), radius=r, fill=GLYPH)
    cx, cy, r = DOT_CIRCLE
    rr = r * scale * k
    d.ellipse((tx(cx) - rr, tx(cy) - rr, tx(cx) + rr, tx(cy) + rr), fill=DOT)
    return img.resize((size, size), Image.LANCZOS)


def svg() -> str:
    bars = "".join(
        f'<rect x="{x1}" y="{y1}" width="{x2 - x1}" height="{y2 - y1}" rx="24"/>'
        for x1, y1, x2, y2 in BARS
    )
    cx, cy, r = DOT_CIRCLE
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
        f'<rect width="512" height="512" rx="{CORNER}" fill="{BG}"/>'
        f'<g fill="{GLYPH}">{bars}</g>'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{DOT}"/>'
        "</svg>\n"
    )


def shortcut(kind: str) -> Image.Image:
    """Иконки ярлыков (manifest.shortcuts), 96×96."""
    big = 512
    bg, fg = ("#f4ebed", "#7a3a49") if kind == "dalon" else ("#eceefb", "#2f3bbd")
    img = Image.new("RGBA", (big, big), bg)
    d = ImageDraw.Draw(img)
    if kind == "dalon":
        # Ладонь из логотипа «Далони»: сетка 40×40, центр знака (21, 20)
        k = 8.6

        def p(x: float, y: float) -> tuple[float, float]:
            return (256 + (x - 21) * k, 256 + (y - 20) * k)

        def bar(x: float, y: float, w: float, h: float, layer: ImageDraw.ImageDraw) -> None:
            r = min(w, h) / 2 * k
            layer.rounded_rectangle((*p(x, y), *p(x + w, y + h)), radius=r, fill=fg)

        thumb = Image.new("RGBA", (big, big), (0, 0, 0, 0))
        bar(4, 15, 6, 14, ImageDraw.Draw(thumb))
        img.alpha_composite(thumb.rotate(18, center=p(7, 22), resample=Image.BICUBIC))
        for x, y, w, h in [(11.5, 5, 6, 22), (18.5, 3, 6, 24), (25.5, 5.5, 6, 21.5), (32, 10, 5.5, 17), (9, 22, 29, 15)]:
            bar(x, y, w, h, d)
    elif kind == "apps":
        d.rounded_rectangle((156, 116, 356, 396), radius=36, outline=fg, width=30)
        for y in (196, 256, 316):
            d.rounded_rectangle((206, y - 13, 306 if y != 316 else 266, y + 13), radius=13, fill=fg)
    else:
        d.ellipse((136, 136, 336, 336), outline=fg, width=34)
        d.line((310, 310, 384, 384), fill=fg, width=40)
        d.ellipse((364, 364, 404, 404), fill=fg)
    return img.resize((96, 96), Image.LANCZOS)


def main() -> None:
    ICONS.mkdir(parents=True, exist_ok=True)
    for kind in ("dalon", "apps", "search"):
        shortcut(kind).save(ICONS / f"shortcut-{kind}-96.png", optimize=True)
    for size in (192, 512):
        draw_icon(size, rounded=True).save(ICONS / f"icon-{size}.png", optimize=True)
        # maskable: фон на весь квадрат, знак внутри безопасной зоны (круг 80 %)
        draw_icon(size, rounded=False, scale=0.9).save(ICONS / f"maskable-{size}.png", optimize=True)
    # iOS сам скругляет углы и не любит прозрачность
    draw_icon(180, rounded=False, scale=1.05).convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)
    favicon = draw_icon(256, rounded=True)
    favicon.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    (PUBLIC / "favicon.svg").write_text(svg(), encoding="utf-8")
    print("Иконки записаны в", PUBLIC)


if __name__ == "__main__":
    main()
