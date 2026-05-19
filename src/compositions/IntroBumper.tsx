import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const IntroBumper = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const logoScale = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 120, mass: 1 },
    from: 0,
    to: 1,
  });

  const textOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineOpacity = interpolate(frame, [45, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineScale = interpolate(frame, [50, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringAngle = (frame / fps) * 180; // 0.5 rotations per second

  return (
    <div
      style={{
        width,
        height,
        background: "#050510",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Rotating rings */}
      <svg
        style={{ position: "absolute", inset: 0 }}
        width={width}
        height={height}
      >
        {[220, 310, 400].map((r, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          return (
            <circle
              key={i}
              cx={width / 2}
              cy={height / 2}
              r={r}
              fill="none"
              stroke={`rgba(124,58,237,${0.12 - i * 0.03})`}
              strokeWidth={1.5}
              strokeDasharray={`${r * 0.25} ${r * 0.75}`}
              transform={`rotate(${ringAngle * dir} ${width / 2} ${height / 2})`}
            />
          );
        })}

        {/* Particle dots on orbit */}
        {[220, 310].map((r, ri) =>
          [0, 120, 240].map((deg, di) => {
            const angle =
              ((deg + ringAngle * (ri === 0 ? 1 : -1)) * Math.PI) / 180;
            const cx = width / 2 + Math.cos(angle) * r;
            const cy = height / 2 + Math.sin(angle) * r;
            return (
              <circle
                key={`${ri}-${di}`}
                cx={cx}
                cy={cy}
                r={3}
                fill={`rgba(167,139,250,${0.7 - ri * 0.2})`}
              />
            );
          }),
        )}
      </svg>

      {/* Logo mark */}
      <div
        style={{
          width: 90,
          height: 90,
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          borderRadius: 22,
          marginBottom: 30,
          transform: `scale(${logoScale})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          boxShadow:
            "0 0 50px rgba(124,58,237,0.5), 0 0 120px rgba(124,58,237,0.2)",
        }}
      >
        ⚡
      </div>

      {/* Channel name */}
      <div
        style={{
          color: "white",
          fontSize: 62,
          fontWeight: 900,
          letterSpacing: -2,
          opacity: textOpacity,
          transform: `scale(${textOpacity})`,
        }}
      >
        Your Channel
      </div>

      {/* Divider */}
      <div
        style={{
          width: 220,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #7c3aed, transparent)",
          margin: "18px 0",
          transform: `scaleX(${lineScale})`,
          transformOrigin: "center",
        }}
      />

      {/* Tagline */}
      <div
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 18,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: taglineOpacity,
        }}
      >
        Code · Create · Ship
      </div>
    </div>
  );
};
