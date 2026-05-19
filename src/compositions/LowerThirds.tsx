import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const LowerThirds = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const HOLD_UNTIL = 160;

  // Slide in
  const slideIn = spring({
    fps,
    frame,
    config: { damping: 22, stiffness: 120, mass: 0.8 },
    from: -400,
    to: 0,
  });

  // Slide out
  const slideOut = interpolate(frame, [HOLD_UNTIL, HOLD_UNTIL + 20], [0, -400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x = frame < HOLD_UNTIL ? slideIn : slideOut;

  const nameOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barScale = interpolate(frame, [15, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(160deg, #111827, #1f2937)",
        position: "relative",
        fontFamily: "system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Subtle background texture */}
      <svg style={{ position: "absolute", inset: 0, opacity: 0.03 }} width={width} height={height}>
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            y1={i * 40}
            x2={width}
            y2={i * 40}
            stroke="white"
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* Simulated scene hint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.04)",
          fontSize: 60,
          fontWeight: 900,
          letterSpacing: 8,
        }}
      >
        INTERVIEW
      </div>

      {/* Lower third panel */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 70,
          transform: `translateX(${x}px)`,
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            left: -18,
            top: 0,
            width: 5,
            height: 74,
            background: "linear-gradient(180deg, #7c3aed, #2563eb)",
            borderRadius: 3,
            transformOrigin: "top",
            transform: `scaleY(${barScale})`,
          }}
        />

        {/* Name */}
        <div
          style={{
            color: "white",
            fontSize: 40,
            fontWeight: 800,
            opacity: nameOpacity,
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            letterSpacing: -0.5,
          }}
        >
          Andrew Gilliland
        </div>

        {/* Title */}
        <div
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: 22,
            marginTop: 6,
            opacity: titleOpacity,
            letterSpacing: 0.3,
          }}
        >
          Senior Software Engineer
        </div>
      </div>
    </div>
  );
};
