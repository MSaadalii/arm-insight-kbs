from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1] / "dist"
NAVY = "#0B1F33"
TEAL_TOP = (94, 234, 212)
TEAL_BOTTOM = (18, 163, 152)

def font_for(size):
    candidates = [
        "C:/Windows/Fonts/seguisb.ttf", "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
    ]
    for candidate in candidates:
        try:
            font = ImageFont.truetype(candidate, size)
            if font.getbbox("↗")[2] > 0:
                return font
        except (OSError, AttributeError):
            pass
    return ImageFont.load_default()

def make(size, maskable=False):
    image = Image.new("RGBA", (size, size), NAVY if maskable else (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    inset = round(size * (0.10 if maskable else 0.04))
    left, top, right, bottom = inset, inset, size - inset, size - inset
    radius = round(size * (0.18 if maskable else 0.22))
    # Rasterize gradient into a mask so the rounded square has clean corners.
    gradient = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gradient)
    for y in range(top, bottom):
        t = (y - top) / max(1, bottom - top - 1)
        color = tuple(round(a + (b - a) * t) for a, b in zip(TEAL_TOP, TEAL_BOTTOM))
        gd.line((left, y, right, y), fill=color)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((left, top, right, bottom), radius=radius, fill=255)
    image.paste(gradient, (0, 0), mask)
    draw = ImageDraw.Draw(image)
    font = font_for(round(size * (0.36 if maskable else 0.42)))
    label = "A"
    box = draw.textbbox((0, 0), label, font=font, anchor="lt")
    tw, th = box[2] - box[0], box[3] - box[1]
    # Maskable art stays within the central 80% safe zone.
    cx = cy = size / 2
    x = round(cx - tw * 0.56 - box[0])
    y = round(cy - th / 2 - box[1])
    draw.text((x, y), label, font=font, fill=NAVY)
    # Draw ↗ as polygons so icon rendering does not depend on font glyph coverage.
    start = (round(cx + size * 0.025), round(cy + size * 0.075))
    elbow = (round(cx + size * 0.115), round(cy - size * 0.015))
    tip = (round(cx + size * 0.145), round(cy - size * 0.11))
    draw.line((start, elbow, tip), fill=NAVY, width=max(2, round(size * 0.022)), joint="curve")
    ah = size * 0.05
    draw.polygon([tip, (round(tip[0] - ah), round(tip[1] + ah * 0.2)), (round(tip[0] - ah * 0.15), round(tip[1] + ah))], fill=NAVY)
    name = "icon-maskable-512.png" if maskable else f"icon-{size}.png"
    image.save(OUT / name, "PNG", optimize=True)

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    make(192)
    make(512)
    make(512, maskable=True)
