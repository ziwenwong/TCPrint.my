from pathlib import Path
from math import sin, cos, radians

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "assets" / "images"
LOGO_PATH = IMAGE_DIR / "tc-creative-print-logo.png"
SIZE = 1400

RED = "#cf202b"
DARK_RED = "#9f111a"
BLACK = "#191b1f"
CHARCOAL = "#32363d"
BLUE = "#00a6df"
MAGENTA = "#ec008c"
YELLOW = "#ffd400"
TEAL = "#1aa0aa"
LIGHT = "#f4f6f8"
MUTED = "#d9dde3"


def font(candidates, size):
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


TITLE_FONT = font(
    [
        "/System/Library/Fonts/Supplemental/Impact.ttf",
        "/System/Library/Fonts/Supplemental/Arial Black.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    ],
    118,
)
TITLE_FONT_SMALL = font(
    [
        "/System/Library/Fonts/Supplemental/Impact.ttf",
        "/System/Library/Fonts/Supplemental/Arial Black.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    ],
    96,
)
LABEL_FONT = font(
    [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
    ],
    56,
)
SMALL_FONT = font(
    [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
    ],
    38,
)


def prepare_logo():
    logo = Image.open(LOGO_PATH).convert("RGBA")
    pixels = logo.load()
    for y in range(logo.height):
        for x in range(logo.width):
            r, g, b, a = pixels[x, y]
            if r > 244 and g > 244 and b > 244:
                pixels[x, y] = (255, 255, 255, 0)
    bbox = logo.getbbox()
    return logo.crop(bbox) if bbox else logo


LOGO = prepare_logo()


def shadowed_paste(base, item, xy, blur=18, offset=(12, 14), alpha=80):
    shadow = Image.new("RGBA", item.size, (0, 0, 0, 0))
    mask = item.getchannel("A")
    shadow.putalpha(mask.point(lambda p: min(alpha, p)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(shadow, (xy[0] + offset[0], xy[1] + offset[1]))
    base.alpha_composite(item, xy)


def logo_image(width):
    ratio = width / LOGO.width
    return LOGO.resize((width, int(LOGO.height * ratio)), Image.Resampling.LANCZOS)


def paste_logo(base, center, width, angle=0):
    logo = logo_image(width)
    if angle:
        logo = logo.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    x = int(center[0] - logo.width / 2)
    y = int(center[1] - logo.height / 2)
    base.alpha_composite(logo, (x, y))


def base_card(red_background=False):
    img = Image.new("RGBA", (SIZE, SIZE), LIGHT)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((58, 58, SIZE - 58, SIZE - 58), radius=0, fill=RED)
    inset = (90, 90, SIZE - 90, SIZE - 90)
    draw.rectangle(inset, fill=RED if red_background else "white")
    draw.rectangle(inset, outline="white", width=10)
    if not red_background:
        draw.polygon([(90, 90), (395, 90), (90, 395)], fill="#fff2f3")
        draw.polygon([(SIZE - 90, SIZE - 90), (SIZE - 390, SIZE - 90), (SIZE - 90, SIZE - 390)], fill="#e8fbff")
    return img


def centered_text(draw, text, y, font_obj=TITLE_FONT, fill="white", stroke=RED, width=7):
    lines = text.split("\n")
    heights = []
    widths = []
    for line in lines:
        box = draw.textbbox((0, 0), line, font=font_obj, stroke_width=width)
        widths.append(box[2] - box[0])
        heights.append(box[3] - box[1])
    line_gap = 18
    total_h = sum(heights) + line_gap * (len(lines) - 1)
    cy = y - total_h / 2
    for line, h, w in zip(lines, heights, widths):
        x = SIZE / 2 - w / 2
        draw.text((x + 8, cy + 10), line, font=font_obj, fill="black", stroke_width=width + 1, stroke_fill="black")
        draw.text((x, cy), line, font=font_obj, fill=fill, stroke_width=width, stroke_fill=stroke)
        cy += h + line_gap


def label_text(draw, text, xy, fill=BLACK):
    draw.text((xy[0] + 3, xy[1] + 4), text, font=LABEL_FONT, fill=(0, 0, 0, 50))
    draw.text(xy, text, font=LABEL_FONT, fill=fill)


def rounded_rect_layer(size, radius, fill, outline=None, width=4):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=fill, outline=outline, width=width)
    return layer


def draw_card_mockup(base, pos, size, angle=0, color="white", stripe=TEAL, logo_width=210):
    card = rounded_rect_layer(size, 34, color, "#cfd4dc", 4)
    d = ImageDraw.Draw(card)
    d.rectangle((0, size[1] - 58, size[0], size[1] - 34), fill=stripe)
    d.rounded_rectangle((44, size[1] - 106, size[0] - 44, size[1] - 86), radius=10, fill="#dfe4ea")
    paste_logo(card, (size[0] / 2, size[1] / 2 - 22), logo_width)
    card = card.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    shadowed_paste(base, card, pos, blur=16)


def draw_sticker_sheet(base, pos, size, angle=0, circles=False):
    sheet = rounded_rect_layer(size, 24, "white", "#d6dbe2", 4)
    d = ImageDraw.Draw(sheet)
    cols = 3 if circles else 2
    rows = 3
    for r in range(rows):
        for c in range(cols):
            cx = int((c + 0.5) * size[0] / cols)
            cy = int(110 + r * (size[1] - 170) / (rows - 1))
            if circles:
                d.ellipse((cx - 76, cy - 76, cx + 76, cy + 76), fill="#fff", outline="#cdd3db", width=3)
                paste_logo(sheet, (cx, cy + 2), 104)
            else:
                d.rounded_rectangle((cx - 118, cy - 72, cx + 118, cy + 72), radius=28, fill="#fff", outline="#cdd3db", width=3)
                paste_logo(sheet, (cx, cy + 4), 128)
    sheet = sheet.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    shadowed_paste(base, sheet, pos, blur=18)


def draw_large_format_sticker():
    img = base_card(False)
    draw = ImageDraw.Draw(img)
    centered_text(draw, "LARGE FORMAT\nSTICKER", 210, TITLE_FONT_SMALL)

    # Printer body
    draw.rounded_rectangle((245, 990, 1155, 1192), radius=58, fill=BLACK)
    draw.rounded_rectangle((300, 1118, 1100, 1258), radius=48, fill="#101114")
    draw.rectangle((330, 945, 1070, 1015), fill="#0d0e10")
    draw.ellipse((318, 909, 1082, 1042), fill="#202226", outline="#060607", width=5)
    draw.rectangle((370, 972, 1030, 1028), fill="#2f3339")

    paper = rounded_rect_layer((590, 430), 20, "white", "#d3d8df", 4)
    pd = ImageDraw.Draw(paper)
    pd.rectangle((0, 0, 590, 64), fill=RED)
    pd.rectangle((0, 348, 590, 392), fill=TEAL)
    paste_logo(paper, (295, 210), 300)
    paper = paper.rotate(-3, expand=True, resample=Image.Resampling.BICUBIC)
    shadowed_paste(img, paper, (405, 580), blur=16)

    draw_sticker_sheet(img, (920, 518), (305, 355), angle=10, circles=True)
    paste_logo(img, (270, 805), 150, angle=-8)
    paste_logo(img, (1150, 875), 135, angle=10)
    return img


def draw_lightbox_sticker():
    img = base_card(False)
    draw = ImageDraw.Draw(img)
    centered_text(draw, "LIGHT BOX\nSTICKER", 210, TITLE_FONT_SMALL)

    wall = rounded_rect_layer((920, 560), 34, "#f7f9fb", "#d3d9e2", 5)
    wd = ImageDraw.Draw(wall)
    wd.rectangle((0, 430, 920, 560), fill="#eef2f6")
    wd.rectangle((68, 470, 852, 492), fill="#d7dde5")
    wd.rectangle((112, 512, 808, 532), fill="#e2e7ed")
    shadowed_paste(img, wall, (240, 520), blur=20)

    glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle((270, 535, 1130, 895), radius=50, fill=(255, 236, 128, 80))
    gd.rounded_rectangle((330, 600, 1070, 835), radius=36, fill=(0, 166, 223, 45))
    glow = glow.filter(ImageFilter.GaussianBlur(46))
    img.alpha_composite(glow)

    sign = rounded_rect_layer((780, 320), 32, "white", "#c8ced8", 7)
    sd = ImageDraw.Draw(sign)
    sd.rectangle((0, 0, 780, 62), fill=RED)
    sd.rectangle((0, 258, 780, 320), fill=TEAL)
    sd.rounded_rectangle((48, 92, 732, 228), radius=24, fill="#fbfdff", outline="#eef2f6", width=5)
    paste_logo(sign, (390, 160), 430)
    shadowed_paste(img, sign, (310, 600), blur=26, alpha=120)

    draw.line((405, 552, 405, 600), fill=CHARCOAL, width=9)
    draw.line((995, 552, 995, 600), fill=CHARCOAL, width=9)
    draw.ellipse((390, 538, 420, 568), fill="#cfd6df", outline="#8e98a6", width=3)
    draw.ellipse((980, 538, 1010, 568), fill="#cfd6df", outline="#8e98a6", width=3)
    draw.text((398, 1028), "CM size auto convert to sq ft", font=SMALL_FONT, fill=CHARCOAL)
    label_text(draw, "RM6 / sq ft", (555, 1120), fill=RED)
    return img


def draw_foamboard():
    img = base_card(False)
    draw = ImageDraw.Draw(img)
    centered_text(draw, "FOAM BOARD\nMOUNTING", 210, TITLE_FONT_SMALL)

    # Foam board stack
    for i, offset in enumerate([72, 42, 12]):
        board = rounded_rect_layer((480, 280), 20, "white", "#cbd2da", 5)
        bd = ImageDraw.Draw(board)
        bd.rectangle((0, 0, 480, 56), fill=[RED, BLUE, BLACK][i])
        bd.rectangle((0, 245, 480, 280), fill="#e7ebef")
        paste_logo(board, (240, 152), 230)
        board = board.rotate(-10 + i * 3, expand=True, resample=Image.Resampling.BICUBIC)
        shadowed_paste(img, board, (170 + offset, 820 - offset), blur=15)

    # Easel and display board
    draw.line((930, 655, 755, 1200), fill="#8a5a25", width=20)
    draw.line((930, 655, 1120, 1200), fill="#8a5a25", width=20)
    draw.line((790, 1080, 1090, 1080), fill="#8a5a25", width=16)
    board = rounded_rect_layer((480, 620), 18, "#ffd94e", "#b57e19", 6)
    bd = ImageDraw.Draw(board)
    bd.rectangle((0, 0, 480, 74), fill=RED)
    bd.text((74, 108), "DISPLAY", font=LABEL_FONT, fill=BLACK)
    bd.text((92, 172), "BOARD", font=LABEL_FONT, fill=BLACK)
    paste_logo(board, (240, 365), 280)
    board = board.rotate(4, expand=True, resample=Image.Resampling.BICUBIC)
    shadowed_paste(img, board, (705, 455), blur=20)
    label_text(draw, "5mm foam board", (178, 1182), fill=CHARCOAL)
    return img


def draw_banner():
    img = base_card(True)
    draw = ImageDraw.Draw(img)
    centered_text(draw, "BANNER", 185, TITLE_FONT)
    banner = Image.new("RGBA", (1040, 500), (0, 0, 0, 0))
    bd = ImageDraw.Draw(banner)
    bd.rounded_rectangle((0, 0, 1039, 499), radius=16, fill="white", outline="#d9dde4", width=4)
    bd.polygon([(0, 0), (310, 0), (0, 235)], fill=RED)
    bd.polygon([(1039, 499), (730, 499), (1039, 265)], fill=TEAL)
    bd.polygon([(0, 499), (220, 499), (0, 345)], fill=BLACK)
    for x, y in [(52, 52), (520, 52), (988, 52), (52, 448), (520, 448), (988, 448)]:
        bd.ellipse((x - 22, y - 22, x + 22, y + 22), fill="#eef2f5", outline="#8d949d", width=5)
        bd.ellipse((x - 10, y - 10, x + 10, y + 10), fill="white")
    paste_logo(banner, (520, 250), 520)
    shadowed_paste(img, banner, (180, 455), blur=24)
    for start, end in [((160, 435), (214, 488)), ((1240, 435), (1186, 488)), ((160, 975), (214, 922)), ((1240, 975), (1186, 922))]:
        draw.line((start[0], start[1], end[0], end[1]), fill=BLACK, width=8)
    label_text(draw, "Tarpaulin  |  Eyelet option", (330, 1075), fill="white")
    return img


def draw_bunting():
    img = base_card(False)
    draw = ImageDraw.Draw(img)
    centered_text(draw, "ROLL UP\nBUNTING", 205, TITLE_FONT_SMALL)

    # Roll up stand
    draw.rounded_rectangle((865, 1005, 1165, 1050), radius=20, fill="#c5c9cf", outline="#757b84", width=4)
    draw.line((1015, 490, 1015, 1010), fill="#8d939b", width=8)
    banner = Image.new("RGBA", (420, 680), (0, 0, 0, 0))
    bd = ImageDraw.Draw(banner)
    bd.rounded_rectangle((0, 0, 419, 679), radius=12, fill="white", outline="#cbd2da", width=4)
    bd.rectangle((0, 0, 420, 95), fill=RED)
    bd.polygon([(0, 330), (420, 240), (420, 410), (0, 500)], fill=BLACK)
    bd.polygon([(0, 512), (420, 425), (420, 680), (0, 680)], fill=TEAL)
    bd.rounded_rectangle((54, 170, 366, 305), radius=22, fill="white", outline="#e2e6eb", width=3)
    paste_logo(banner, (210, 238), 230)
    shadowed_paste(img, banner, (805, 380), blur=18)

    # Hanging bunting sample
    sample = rounded_rect_layer((390, 650), 18, "white", "#cbd2da", 4)
    sd = ImageDraw.Draw(sample)
    sd.rectangle((0, 0, 390, 86), fill=RED)
    sd.polygon([(0, 250), (390, 130), (390, 305), (0, 420)], fill="#fff1f2")
    sd.rectangle((0, 564, 390, 650), fill=BLACK)
    paste_logo(sample, (195, 330), 245)
    shadowed_paste(img, sample.rotate(-5, expand=True, resample=Image.Resampling.BICUBIC), (205, 440), blur=18)
    draw.rounded_rectangle((180, 355, 640, 390), radius=18, fill="#c5c9cf", outline="#757b84", width=4)
    label_text(draw, "80cm x 200cm", (188, 1095), fill=CHARCOAL)
    return img


def draw_poster():
    img = base_card(True)
    draw = ImageDraw.Draw(img)
    centered_text(draw, "POSTER", 185, TITLE_FONT)
    for pos, angle, color, scale in [
        ((190, 405), -8, "white", 1.0),
        ((520, 360), 5, "#f9fafb", 1.08),
        ((790, 440), 10, "white", 0.92),
    ]:
        w, h = int(390 * scale), int(560 * scale)
        poster = rounded_rect_layer((w, h), 12, color, "#d6dbe2", 4)
        pd = ImageDraw.Draw(poster)
        pd.rectangle((0, 0, w, 96), fill=RED)
        pd.rectangle((42, h - 128, w - 42, h - 98), fill=TEAL)
        pd.rectangle((42, h - 76, w - 120, h - 50), fill="#d9dde3")
        paste_logo(poster, (w / 2, h / 2 - 10), int(w * 0.55))
        poster = poster.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
        shadowed_paste(img, poster, pos, blur=18)
    label_text(draw, "A3 / A2 / Custom", (345, 1088), fill="white")
    return img


def draw_business_card():
    img = base_card(False)
    draw = ImageDraw.Draw(img)
    centered_text(draw, "BUSINESS\nCARD", 205, TITLE_FONT_SMALL)
    draw_card_mockup(img, (260, 515), (620, 330), angle=-10, color="white", stripe=TEAL, logo_width=280)
    draw_card_mockup(img, (560, 620), (620, 330), angle=7, color=BLACK, stripe=RED, logo_width=280)
    draw_card_mockup(img, (315, 805), (620, 330), angle=0, color="white", stripe=YELLOW, logo_width=270)
    for i in range(5):
        x = 842 + i * 24
        draw.rounded_rectangle((x, 988 - i * 16, x + 230, 1128 - i * 16), radius=22, fill="#fff", outline="#ccd2db", width=3)
    paste_logo(img, (990, 1050), 145, angle=-6)
    label_text(draw, "Name card printing", (320, 1168), fill=CHARCOAL)
    return img


def draw_custom_size():
    img = base_card(True)
    draw = ImageDraw.Draw(img)
    centered_text(draw, "CUSTOM SIZE\nPRINTING", 210, TITLE_FONT_SMALL)

    # Measuring ruler
    draw.rounded_rectangle((180, 1015, 1220, 1090), radius=24, fill=YELLOW, outline="#af8d00", width=4)
    for i in range(26):
        x = 220 + i * 38
        h = 44 if i % 5 == 0 else 25
        draw.line((x, 1016, x, 1016 + h), fill=BLACK, width=4)

    sheets = [
        ((230, 470), (360, 470), -8, "white"),
        ((515, 430), (420, 555), 4, "#f9fafb"),
        ((780, 545), (390, 410), 10, "white"),
    ]
    for pos, size, angle, color in sheets:
        sheet = rounded_rect_layer(size, 18, color, "#d2d8e0", 4)
        sd = ImageDraw.Draw(sheet)
        sd.rectangle((0, 0, size[0], 64), fill=TEAL)
        sd.rectangle((34, size[1] - 88, size[0] - 34, size[1] - 60), fill=RED)
        paste_logo(sheet, (size[0] / 2, size[1] / 2), int(size[0] * 0.52))
        sheet = sheet.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
        shadowed_paste(img, sheet, pos, blur=18)

    draw.line((250, 395, 1130, 395), fill="white", width=7)
    draw.polygon([(250, 395), (295, 370), (295, 420)], fill="white")
    draw.polygon([(1130, 395), (1085, 370), (1085, 420)], fill="white")
    draw.line((1190, 440, 1190, 950), fill="white", width=7)
    draw.polygon([(1190, 440), (1165, 485), (1215, 485)], fill="white")
    draw.polygon([(1190, 950), (1165, 905), (1215, 905)], fill="white")
    return img


def draw_other_printing():
    img = base_card(False)
    draw = ImageDraw.Draw(img)
    centered_text(draw, "OTHER\nPRINTING", 205, TITLE_FONT_SMALL)

    # Shirt
    draw.polygon([(220, 620), (350, 545), (445, 600), (555, 545), (685, 620), (620, 750), (580, 710), (585, 1085), (320, 1085), (325, 710), (285, 750)], fill=BLACK)
    draw.rounded_rectangle((330, 740, 580, 880), radius=28, fill="white", outline="#d8dde4", width=4)
    paste_logo(img, (455, 810), 190)

    # Flyer/poster
    flyer = rounded_rect_layer((355, 500), 20, "white", "#cbd2da", 4)
    fd = ImageDraw.Draw(flyer)
    fd.rectangle((0, 0, 355, 80), fill=RED)
    fd.rectangle((44, 345, 311, 372), fill=TEAL)
    fd.rectangle((44, 398, 260, 420), fill="#d9dde3")
    paste_logo(flyer, (178, 220), 215)
    shadowed_paste(img, flyer.rotate(-8, expand=True, resample=Image.Resampling.BICUBIC), (805, 430), blur=18)

    # Red packets
    for i in range(3):
        packet = rounded_rect_layer((210, 370), 22, RED, DARK_RED, 4)
        pd = ImageDraw.Draw(packet)
        pd.rectangle((38, 296, 172, 322), fill=YELLOW)
        paste_logo(packet, (105, 155), 116)
        packet = packet.rotate(-4 + i * 5, expand=True, resample=Image.Resampling.BICUBIC)
        shadowed_paste(img, packet, (725 + i * 86, 850 - i * 22), blur=14)

    # Flag and mouse pad
    draw.line((1090, 850, 1090, 1145), fill=CHARCOAL, width=8)
    draw.polygon([(1090, 850), (1282, 900), (1090, 960)], fill="white", outline="#cbd2da")
    paste_logo(img, (1165, 914), 120)
    draw.rounded_rectangle((725, 1120, 1210, 1260), radius=48, fill=BLACK)
    draw.rounded_rectangle((835, 1152, 1100, 1232), radius=22, fill="white")
    paste_logo(img, (968, 1192), 205)
    draw.text((205, 1162), "Flyer | T-shirt | Gift items", font=SMALL_FONT, fill=CHARCOAL)
    return img


def save(name, image):
    rgb = Image.new("RGB", image.size, LIGHT)
    rgb.paste(image.convert("RGB"))
    rgb.save(IMAGE_DIR / name, quality=95)


def main():
    outputs = {
        "large-format-sticker.png": draw_large_format_sticker(),
        "light-box-sticker.png": draw_lightbox_sticker(),
        "foamboard-mounting.png": draw_foamboard(),
        "banner.png": draw_banner(),
        "bunting-stand.png": draw_bunting(),
        "poster.png": draw_poster(),
        "business-card.png": draw_business_card(),
        "custom-size-printing.png": draw_custom_size(),
        "other-printing.png": draw_other_printing(),
    }
    for filename, image in outputs.items():
        save(filename, image)
        print(f"Generated {filename}")


if __name__ == "__main__":
    main()
