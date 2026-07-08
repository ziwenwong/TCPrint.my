from __future__ import annotations

import math
import os
import subprocess
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

WIDTH = 1080
HEIGHT = 1920
FPS = 30
FRAMES = 90
LOGO_WIDTH = 880

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT.parent / "outputs" / "nutrivo-outro"
OUTPUT = OUTPUT_DIR / "nutrivo-outro.mp4"
PREVIEW = OUTPUT_DIR / "preview.png"
LOGO = ROOT / "public" / "nutrivo-logo.png"


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


def multiply_alpha(image: Image.Image, factor: float, mask: Image.Image | None = None) -> Image.Image:
    rgba = np.array(image.convert("RGBA"), dtype=np.uint8)
    alpha = rgba[:, :, 3].astype(np.float32) * factor
    if mask is not None:
        alpha *= np.array(mask, dtype=np.float32) / 255
    rgba[:, :, 3] = np.clip(alpha, 0, 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def make_background_fields() -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    y = np.linspace(0, 1, HEIGHT, dtype=np.float32)[:, None]
    x = np.linspace(0, 1, WIDTH, dtype=np.float32)[None, :]

    start = np.array([1, 3, 1], dtype=np.float32)
    end = np.array([7, 16, 6], dtype=np.float32)
    diagonal = (x + y) / 2
    base = start + (end - start) * diagonal[:, :, None]

    radial = np.sqrt(((x - 0.5) / 0.62) ** 2 + ((y - 0.47) / 0.31) ** 2)
    radial = np.clip(1 - radial, 0, 1) ** 1.65
    base += radial[:, :, None] * np.array([13, 36, 5], dtype=np.float32)

    lift = np.sqrt(((x - 0.5) / 0.56) ** 2 + ((y - 0.52) / 0.2) ** 2)
    lift = np.clip(1 - lift, 0, 1) ** 1.9

    angle = math.radians(-8)
    sweep_coord = (x - 0.5) * math.cos(angle) + (y - 0.5) * math.sin(angle)
    return base, lift.astype(np.float32), sweep_coord.astype(np.float32)


def prepare_logo() -> tuple[Image.Image, Image.Image, Image.Image]:
    source = Image.open(LOGO).convert("RGBA")
    logo_height = round(LOGO_WIDTH * source.height / source.width)
    resized = source.resize((LOGO_WIDTH, logo_height), Image.Resampling.LANCZOS)
    base = ImageEnhance.Brightness(resized).enhance(1.28)
    base = ImageEnhance.Color(base).enhance(1.18)
    glow = ImageEnhance.Brightness(resized).enhance(1.45)
    glow = ImageEnhance.Color(glow).enhance(1.35)
    shine = ImageEnhance.Brightness(resized).enhance(2.15)
    shine = ImageEnhance.Color(shine).enhance(1.35)
    return base, glow, shine


BASE_BG, LIFT_FIELD, SWEEP_COORD = make_background_fields()
LOGO_BASE, LOGO_GLOW, LOGO_SHINE = prepare_logo()


def logo_container(frame: int, visibility: float, shine_center: float, shine_opacity: float) -> Image.Image:
    margin = 82
    layer = Image.new(
        "RGBA",
        (LOGO_BASE.width + margin * 2, LOGO_BASE.height + margin * 2),
        (0, 0, 0, 0),
    )

    shadow = multiply_alpha(LOGO_BASE, 0.5).filter(ImageFilter.GaussianBlur(38))
    layer.alpha_composite(shadow, (margin, margin + 20))

    glow = multiply_alpha(LOGO_GLOW, 0.46).filter(ImageFilter.GaussianBlur(28))
    layer.alpha_composite(glow, (margin, margin))
    layer.alpha_composite(LOGO_BASE, (margin, margin))

    mask = Image.new("L", LOGO_BASE.size, 0)
    draw = ImageDraw.Draw(mask)
    w, h = LOGO_BASE.size
    draw.polygon(
        [
            ((shine_center - 7) / 100 * w, 0),
            ((shine_center + 3) / 100 * w, 0),
            ((shine_center - 4) / 100 * w, h),
            ((shine_center - 14) / 100 * w, h),
        ],
        fill=255,
    )
    shine = multiply_alpha(LOGO_SHINE, shine_opacity, mask)
    layer.alpha_composite(shine, (margin, margin))

    if visibility < 1:
        layer = multiply_alpha(layer, visibility)
    return layer


def line_layer(width: int, opacity: float) -> Image.Image:
    if width <= 0 or opacity <= 0:
        return Image.new("RGBA", (1, 2), (0, 0, 0, 0))
    gradient = 1 - np.abs(np.linspace(-1, 1, width, dtype=np.float32)) ** 1.4
    line = np.zeros((2, width, 4), dtype=np.uint8)
    line[:, :, :3] = np.array([78, 166, 35], dtype=np.uint8)
    line[:, :, 3] = np.clip(gradient * 255 * opacity, 0, 255).astype(np.uint8)
    return Image.fromarray(line, "RGBA")


def render_frame(frame: int) -> Image.Image:
    ease_out = lambda value: cubic_bezier(0.16, 1, 0.3, 1, value)
    ease_in = lambda value: cubic_bezier(0.7, 0, 0.84, 0, value)
    ease_in_out = lambda value: cubic_bezier(0.45, 0, 0.55, 1, value)

    enter = interpolate(frame, 0.08 * FPS, 0.9 * FPS, 0, 1, ease_out)
    exit_progress = interpolate(frame, 2.55 * FPS, 2.95 * FPS, 1, 0, ease_in)
    visibility = enter * exit_progress

    logo_scale = interpolate(frame, 0.08 * FPS, 0.9 * FPS, 0.92, 1, ease_out)
    logo_y = interpolate(frame, 0.08 * FPS, 0.9 * FPS, 34, 0, ease_out)
    logo_blur = interpolate(frame, 0.08 * FPS, 0.9 * FPS, 10, 0, ease_out)
    background_lift = interpolate(frame, 0, 1.35 * FPS, 0.15, 0.55, ease_in_out)
    background_lift = interpolate(frame, 1.35 * FPS, 2.6 * FPS, background_lift, 0.28, ease_in_out)
    sweep = interpolate(frame, 0.15 * FPS, 1.45 * FPS, -42, 74, ease_out)
    line_reveal = interpolate(frame, 0.4 * FPS, 1.25 * FPS, 0, 1, ease_out)
    shine_center = interpolate(frame, 0.6 * FPS, 1.85 * FPS, -20, 120, ease_in_out)
    shine_in = interpolate(frame, 0.55 * FPS, 0.78 * FPS, 0, 0.55)
    shine_out = interpolate(frame, 1.65 * FPS, 1.95 * FPS, 1, 0)
    shine_opacity = shine_in * shine_out * visibility

    frame_rgb = BASE_BG.copy()
    frame_rgb += LIFT_FIELD[:, :, None] * background_lift * np.array([52, 125, 15], dtype=np.float32) * 0.24

    sweep_center = -0.78 + ((sweep + 42) / 116) * 1.56
    band = np.exp(-((SWEEP_COORD - sweep_center) / 0.045) ** 2) * visibility
    frame_rgb += band[:, :, None] * np.array([219, 255, 171], dtype=np.float32) * 0.09
    frame_rgb += np.exp(-((SWEEP_COORD - sweep_center) / 0.12) ** 2)[:, :, None] * np.array(
        [104, 198, 55], dtype=np.float32
    ) * 0.035 * visibility

    canvas = Image.fromarray(np.clip(frame_rgb, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

    logo = logo_container(frame, visibility, shine_center, shine_opacity)
    scaled_size = (round(logo.width * logo_scale), round(logo.height * logo_scale))
    logo = logo.resize(scaled_size, Image.Resampling.LANCZOS)
    if logo_blur > 0.1:
        logo = logo.filter(ImageFilter.GaussianBlur(logo_blur))
    x = round((WIDTH - logo.width) / 2)
    y = round((HEIGHT - logo.height) / 2 + logo_y)
    canvas.alpha_composite(logo, (x, y))

    full_line_width = min(int(WIDTH * 0.58), 620)
    line_width = max(1, round(full_line_width * line_reveal))
    line = line_layer(line_width, visibility * 0.75)
    line_x = round((WIDTH - line.width) / 2)
    line_y = round(HEIGHT / 2 + LOGO_WIDTH / 6 + 74)
    canvas.alpha_composite(line, (line_x, line_y))

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
