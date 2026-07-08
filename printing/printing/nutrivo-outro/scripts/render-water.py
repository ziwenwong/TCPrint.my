from __future__ import annotations

import math
import os
import subprocess
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

WIDTH = 1080
HEIGHT = 1920
FPS = 30
FRAMES = 90
ICON_WIDTH = 472
WORD_WIDTH = 790

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT.parent / "outputs" / "nutrivo-outro"
OUTPUT = OUTPUT_DIR / "nutrivo-outro-water.mp4"
PREVIEW = OUTPUT_DIR / "preview-water.png"
ICON = ROOT / "public" / "nutrivo-icon.png"
WORDMARK = ROOT / "public" / "nutrivo-wordmark.png"


def ffmpeg_path() -> Path:
    matches = list(
        ROOT.glob(
            "node_modules/.pnpm/@remotion+compositor-darwin-arm64@*/node_modules/"
            "@remotion/compositor-darwin-arm64/ffmpeg"
        )
    )
    if not matches:
        raise FileNotFoundError("Remotion ffmpeg binary was not found.")
    return matches[0]


def clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def cubic_bezier(x1: float, y1: float, x2: float, y2: float, progress: float) -> float:
    progress = clamp01(progress)

    def sample_x(t: float) -> float:
        inv = 1 - t
        return 3 * inv * inv * t * x1 + 3 * inv * t * t * x2 + t * t * t

    def sample_y(t: float) -> float:
        inv = 1 - t
        return 3 * inv * inv * t * y1 + 3 * inv * t * t * y2 + t * t * t

    low = 0.0
    high = 1.0
    t = progress
    for _ in range(16):
        x = sample_x(t)
        if abs(x - progress) < 1e-4:
            break
        if x < progress:
            low = t
        else:
            high = t
        t = (low + high) / 2
    return sample_y(t)


def interpolate(
    frame: int,
    start: float,
    end: float,
    out_start: float,
    out_end: float,
    easing=lambda value: value,
) -> float:
    progress = clamp01((frame - start) / (end - start))
    eased = easing(progress)
    return out_start + (out_end - out_start) * eased


def multiply_alpha(image: Image.Image, factor: float) -> Image.Image:
    rgba = np.array(image.convert("RGBA"), dtype=np.uint8)
    rgba[:, :, 3] = np.clip(rgba[:, :, 3].astype(np.float32) * factor, 0, 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def resized_asset(path: Path, width: int) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    height = round(width * image.height / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


ICON_IMG = resized_asset(ICON, ICON_WIDTH)
WORD_IMG = resized_asset(WORDMARK, WORD_WIDTH)

Y = np.linspace(0, 1, HEIGHT, dtype=np.float32)[:, None]
X = np.linspace(0, 1, WIDTH, dtype=np.float32)[None, :]


def background(frame: int, visibility: float) -> Image.Image:
    t = frame / FPS
    top = np.array([2, 18, 14], dtype=np.float32)
    bottom = np.array([1, 8, 6], dtype=np.float32)
    mid = np.array([5, 42, 31], dtype=np.float32)
    base = top * (1 - Y[:, :, None]) + bottom * Y[:, :, None]
    base = np.broadcast_to(base, (HEIGHT, WIDTH, 3)).copy()

    center = np.sqrt(((X - 0.5) / 0.62) ** 2 + ((Y - 0.45) / 0.34) ** 2)
    center = np.clip(1 - center, 0, 1) ** 1.6
    base += center[:, :, None] * mid * 1.4

    flow_a = np.sin((X * 5.4 + Y * 2.8 - t * 0.62) * math.tau)
    flow_b = np.sin((X * 2.1 - Y * 5.2 + t * 0.42) * math.tau)
    flow_c = np.sin((X * 8.2 + Y * 0.8 + t * 0.23) * math.tau)
    caustic = np.clip((flow_a + flow_b + flow_c - 1.0) / 2.2, 0, 1) ** 2
    base += caustic[:, :, None] * np.array([92, 184, 140], dtype=np.float32) * 0.18 * visibility

    vertical_sway = (np.sin((Y * 7.0 + t * 0.55) * math.tau) + 1) / 2
    base += vertical_sway[:, :, None] * np.array([3, 24, 18], dtype=np.float32) * 0.5

    canvas = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    ribbons = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(ribbons)
    for i, y_base in enumerate([520, 735, 1030, 1245]):
        points: list[tuple[int, int]] = []
        phase = i * 1.7
        for x in range(-140, WIDTH + 141, 18):
            y = y_base + math.sin(x * 0.008 + t * 1.15 + phase) * 42
            y += math.sin(x * 0.014 - t * 0.8 + phase) * 16
            points.append((x, round(y)))
        alpha = round((24 - i * 3) * visibility)
        draw.line(points, fill=(126, 214, 177, alpha), width=20 - i * 2, joint="curve")
    ribbons = ribbons.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(ribbons)
    return canvas


def natural_glow(asset: Image.Image, opacity: float, radius: float) -> Image.Image:
    alpha = asset.getchannel("A")
    glow = Image.new("RGBA", asset.size, (39, 111, 21, 0))
    glow.putalpha(alpha)
    glow = multiply_alpha(glow, opacity).filter(ImageFilter.GaussianBlur(radius))
    return glow


def paste_center(canvas: Image.Image, image: Image.Image, center_x: float, top: float) -> None:
    canvas.alpha_composite(image, (round(center_x - image.width / 2), round(top)))


def render_frame(frame: int) -> Image.Image:
    ease_out = lambda value: cubic_bezier(0.16, 1, 0.3, 1, value)
    ease_in = lambda value: cubic_bezier(0.7, 0, 0.84, 0, value)
    ease_in_out = lambda value: cubic_bezier(0.45, 0, 0.55, 1, value)

    enter = interpolate(frame, 0.08 * FPS, 0.95 * FPS, 0, 1, ease_out)
    exit_progress = interpolate(frame, 2.55 * FPS, 2.95 * FPS, 1, 0, ease_in)
    visibility = enter * exit_progress
    canvas = background(frame, visibility)

    group_y = interpolate(frame, 0.08 * FPS, 0.95 * FPS, 58, 0, ease_out)
    group_scale = interpolate(frame, 0.08 * FPS, 0.95 * FPS, 0.94, 1, ease_out)
    blur = interpolate(frame, 0.08 * FPS, 0.95 * FPS, 9, 0, ease_out)
    icon_float = 0

    icon = ICON_IMG
    word = WORD_IMG
    if abs(group_scale - 1) > 0.001:
        icon = icon.resize(
            (round(ICON_IMG.width * group_scale), round(ICON_IMG.height * group_scale)),
            Image.Resampling.LANCZOS,
        )
        word = word.resize(
            (round(WORD_IMG.width * group_scale), round(WORD_IMG.height * group_scale)),
            Image.Resampling.LANCZOS,
        )

    logo_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    icon_top = HEIGHT / 2 - icon.height / 2 + group_y + icon_float
    word_top = icon_top + icon.height + 58
    center_x = WIDTH / 2

    ripple_progress = interpolate(frame, 0.38 * FPS, 1.65 * FPS, 0, 1, ease_in_out)
    ripple_alpha = visibility * (1 - ripple_progress) * 70
    if ripple_alpha > 1:
        ripple = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(ripple)
        radius = 205 + ripple_progress * 190
        box = [
            center_x - radius,
            icon_top + icon.height / 2 - radius,
            center_x + radius,
            icon_top + icon.height / 2 + radius,
        ]
        draw.ellipse(box, outline=(148, 230, 178, round(ripple_alpha)), width=3)
        logo_layer.alpha_composite(ripple.filter(ImageFilter.GaussianBlur(2)))

    icon_glow = natural_glow(icon, 0.34 * visibility, 26)
    word_glow = natural_glow(word, 0.18 * visibility, 22)
    paste_center(logo_layer, icon_glow, center_x, icon_top)
    paste_center(logo_layer, word_glow, center_x, word_top)
    paste_center(logo_layer, icon, center_x, icon_top)
    paste_center(logo_layer, word, center_x, word_top)

    line_progress = interpolate(frame, 0.55 * FPS, 1.35 * FPS, 0, 1, ease_out)
    line_width = round(min(WIDTH * 0.5, 540) * line_progress)
    if line_width > 0:
        gradient = 1 - np.abs(np.linspace(-1, 1, line_width, dtype=np.float32)) ** 1.35
        line = np.zeros((2, line_width, 4), dtype=np.uint8)
        line[:, :, :3] = np.array([99, 188, 133], dtype=np.uint8)
        line[:, :, 3] = np.clip(gradient * 170 * visibility, 0, 255).astype(np.uint8)
        line_image = Image.fromarray(line, "RGBA")
        line_top = word_top + word.height + 86
        logo_layer.alpha_composite(line_image, (round((WIDTH - line_width) / 2), round(line_top)))

    if blur > 0.1:
        logo_layer = logo_layer.filter(ImageFilter.GaussianBlur(blur))
    if visibility < 1:
        logo_layer = multiply_alpha(logo_layer, visibility)
    canvas.alpha_composite(logo_layer)

    fade_to_black = 1 - exit_progress
    if fade_to_black > 0:
        black = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, round(255 * fade_to_black)))
        canvas.alpha_composite(black)
    return canvas.convert("RGB")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    ffmpeg = ffmpeg_path()
    ffmpeg_lib_dir = str(ffmpeg.parent)
    env = os.environ.copy()
    env["DYLD_LIBRARY_PATH"] = ffmpeg_lib_dir
    env["DYLD_FALLBACK_LIBRARY_PATH"] = ffmpeg_lib_dir
    command = [
        str(ffmpeg),
        "-y",
        "-loglevel",
        "error",
        "-framerate",
        str(FPS),
        "-f",
        "image2pipe",
        "-vcodec",
        "png",
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "18",
        "-preset",
        "slow",
        "-movflags",
        "+faststart",
        str(OUTPUT),
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE, env=env)
    assert process.stdin is not None
    for frame in range(FRAMES):
        image = render_frame(frame)
        if frame == 45:
            image.save(PREVIEW)
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        process.stdin.write(buffer.getvalue())
    process.stdin.close()
    code = process.wait()
    if code != 0:
        raise SystemExit(code)
    print(f"Rendered {OUTPUT}")
    print(f"Preview {PREVIEW}")


if __name__ == "__main__":
    main()
