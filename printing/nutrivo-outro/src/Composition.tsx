import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

const logoSrc = staticFile("nutrivo-logo.png");
const iconSrc = staticFile("nutrivo-icon.png");
const wordmarkSrc = staticFile("nutrivo-wordmark.png");

export const NutrivoOutro = () => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();

  const enter = interpolate(frame, [0.08 * fps, 0.9 * fps], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const exit = interpolate(frame, [2.55 * fps, 2.95 * fps], [1, 0], {
    ...clamp,
    easing: easeIn,
  });
  const visibility = enter * exit;

  const logoScale = interpolate(enter, [0, 1], [0.92, 1]);
  const logoY = interpolate(enter, [0, 1], [34, 0]);
  const logoBlur = interpolate(enter, [0, 1], [10, 0]);
  const logoWidth = Math.min(width * 0.82, 920);

  const backgroundLift = interpolate(frame, [0, 1.35 * fps, 2.6 * fps], [0.15, 0.55, 0.28], {
    ...clamp,
    easing: easeInOut,
  });
  const sweep = interpolate(frame, [0.15 * fps, 1.45 * fps], [-42, 74], {
    ...clamp,
    easing: easeOut,
  });
  const lineReveal = interpolate(frame, [0.4 * fps, 1.25 * fps], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const shineCenter = interpolate(frame, [0.6 * fps, 1.85 * fps], [-20, 120], {
    ...clamp,
    easing: easeInOut,
  });
  const shineOpacity =
    interpolate(frame, [0.55 * fps, 0.78 * fps], [0, 0.55], clamp) *
    interpolate(frame, [1.65 * fps, 1.95 * fps], [1, 0], clamp) *
    visibility;

  const containerStyle: CSSProperties = {
    opacity: visibility,
    transform: `translateY(${logoY}px) scale(${logoScale})`,
    filter: `blur(${logoBlur}px)`,
  };

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 50% 47%, rgba(31, 83, 7, 0.35) 0%, rgba(12, 35, 4, 0.18) 34%, rgba(1, 3, 1, 0) 64%), linear-gradient(135deg, #010301 0%, #071006 52%, #010201 100%)",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 54%, rgba(52, 125, 15, 0.24), rgba(0, 0, 0, 0) 48%)",
          opacity: backgroundLift,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-22%",
          top: height * 0.28,
          width: "144%",
          height: height * 0.36,
          background:
            "linear-gradient(108deg, rgba(255,255,255,0) 0%, rgba(104, 198, 55, 0.06) 42%, rgba(219, 255, 171, 0.11) 50%, rgba(104, 198, 55, 0.05) 58%, rgba(255,255,255,0) 100%)",
          opacity: visibility * 0.9,
          transform: `translateX(${sweep}%) rotate(-8deg)`,
        }}
      />

      <div
        style={{
          ...containerStyle,
          position: "relative",
          width: logoWidth,
          height: logoWidth / 3,
        }}
      >
        <Img
          src={logoSrc}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: 0.46,
            filter: "blur(28px) brightness(1.45) saturate(1.35)",
          }}
        />
        <Img
          src={logoSrc}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter:
              "brightness(1.28) saturate(1.18) drop-shadow(0 0 18px rgba(56, 140, 24, 0.32)) drop-shadow(0 18px 52px rgba(0, 0, 0, 0.75))",
          }}
        />
        <Img
          src={logoSrc}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: shineOpacity,
            filter: "brightness(2.15) saturate(1.35)",
            clipPath: `polygon(${shineCenter - 7}% 0%, ${shineCenter + 3}% 0%, ${shineCenter - 4}% 100%, ${shineCenter - 14}% 100%)`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: height / 2 + logoWidth / 6 + 74,
          width: Math.min(width * 0.58, 620),
          height: 2,
          background:
            "linear-gradient(90deg, rgba(25, 78, 0, 0), rgba(78, 166, 35, 0.9), rgba(25, 78, 0, 0))",
          opacity: visibility * 0.75,
          transform: `scaleX(${lineReveal})`,
          transformOrigin: "center",
        }}
      />
    </AbsoluteFill>
  );
};

export const NutrivoWaterOutro = () => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();

  const enter = interpolate(frame, [0.08 * fps, 0.95 * fps], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const exit = interpolate(frame, [2.55 * fps, 2.95 * fps], [1, 0], {
    ...clamp,
    easing: easeIn,
  });
  const visibility = enter * exit;
  const waterShift = interpolate(frame, [0, 3 * fps], [-22, 32], clamp);
  const secondShift = interpolate(frame, [0, 3 * fps], [26, -28], clamp);
  const ripple = interpolate(frame, [0.35 * fps, 1.65 * fps], [0, 1], {
    ...clamp,
    easing: easeInOut,
  });

  const iconSize = Math.min(width * 0.45, 495);
  const wordWidth = Math.min(width * 0.72, 790);
  const groupY = interpolate(enter, [0, 1], [46, 0]);
  const groupScale = interpolate(enter, [0, 1], [0.94, 1]);
  const iconFloat = 0;
  const logoTop = height / 2 - iconSize / 2 + groupY;
  const wordTop = logoTop + iconSize + 58;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 50% 45%, rgba(19, 96, 62, 0.42) 0%, rgba(5, 40, 30, 0.6) 32%, rgba(1, 13, 10, 1) 68%), linear-gradient(180deg, #02120e 0%, #05281f 50%, #010806 100%)",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-8%",
          background:
            "repeating-radial-gradient(ellipse at 50% 48%, rgba(126, 225, 170, 0.08) 0px, rgba(126, 225, 170, 0.02) 18px, rgba(126, 225, 170, 0) 42px)",
          opacity: visibility * 0.62,
          transform: `translateY(${waterShift}px) scale(1.04)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-28%",
          top: height * 0.17,
          width: "156%",
          height: height * 0.78,
          background:
            "linear-gradient(104deg, rgba(255,255,255,0) 0%, rgba(115, 210, 166, 0.06) 28%, rgba(188, 255, 218, 0.13) 50%, rgba(79, 173, 126, 0.05) 67%, rgba(255,255,255,0) 100%)",
          filter: "blur(18px)",
          opacity: visibility * 0.72,
          transform: `translateX(${waterShift}%) rotate(-18deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-34%",
          top: height * 0.46,
          width: "168%",
          height: height * 0.26,
          background:
            "linear-gradient(96deg, rgba(255,255,255,0) 0%, rgba(96, 186, 146, 0.08) 40%, rgba(211, 255, 229, 0.1) 52%, rgba(255,255,255,0) 100%)",
          filter: "blur(20px)",
          opacity: visibility * 0.52,
          transform: `translateX(${secondShift}%) rotate(10deg)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2 - 260 - ripple * 160,
          top: logoTop + iconSize / 2 - 260 - ripple * 160,
          width: 520 + ripple * 320,
          height: 520 + ripple * 320,
          border: "2px solid rgba(142, 222, 170, 0.2)",
          borderRadius: "50%",
          filter: "blur(3px)",
          opacity: visibility * (1 - ripple) * 0.75,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: logoTop,
          width,
          opacity: visibility,
          transform: `scale(${groupScale})`,
          transformOrigin: "50% 50%",
        }}
      >
        <Img
          src={iconSrc}
          style={{
            position: "absolute",
            left: width / 2 - iconSize / 2,
            top: iconFloat,
            width: iconSize,
            height: iconSize,
            objectFit: "contain",
            filter: "drop-shadow(0 22px 58px rgba(0, 0, 0, 0.48))",
          }}
        />
        <Img
          src={wordmarkSrc}
          style={{
            position: "absolute",
            left: width / 2 - wordWidth / 2,
            top: wordTop - logoTop,
            width: wordWidth,
            height: wordWidth / 3.98,
            objectFit: "contain",
            filter: "drop-shadow(0 20px 52px rgba(0, 0, 0, 0.45))",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: wordTop + wordWidth / 3.98 + 86,
          width: Math.min(width * 0.5, 540),
          height: 2,
          background:
            "linear-gradient(90deg, rgba(99, 188, 133, 0), rgba(99, 188, 133, 0.66), rgba(99, 188, 133, 0))",
          opacity: visibility * enter * 0.7,
          transform: `scaleX(${interpolate(frame, [0.55 * fps, 1.35 * fps], [0, 1], {
            ...clamp,
            easing: easeOut,
          })})`,
        }}
      />
    </AbsoluteFill>
  );
};
