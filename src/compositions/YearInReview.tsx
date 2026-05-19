import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const STATS = [
  { label: "Commits", value: 1247, color: "#22c55e" },
  { label: "PRs Merged", value: 89, color: "#3b82f6" },
  { label: "Issues Closed", value: 214, color: "#a855f7" },
  { label: "Projects", value: 12, color: "#f59e0b" },
];

export const YearInReview = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 30], [-24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        gap: 64,
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Annual Summary
        </div>
        <div
          style={{
            color: "white",
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: -1,
          }}
        >
          2025 Year in Review
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "flex", gap: 32 }}>
        {STATS.map((stat, i) => {
          const start = 35 + i * 18;
          const countEnd = start + 70;
          const count = Math.round(
            interpolate(frame, [start, countEnd], [0, stat.value], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          );
          const opacity = interpolate(frame, [start, start + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(frame, [start, start + 20], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${stat.color}30`,
                borderRadius: 24,
                padding: "40px 44px",
                textAlign: "center",
                opacity,
                transform: `scale(${scale})`,
                minWidth: 220,
              }}
            >
              {/* Colored top accent */}
              <div
                style={{
                  width: 40,
                  height: 4,
                  background: stat.color,
                  borderRadius: 2,
                  margin: "0 auto 20px",
                }}
              />
              <div
                style={{
                  fontSize: 68,
                  fontWeight: 900,
                  color: stat.color,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {count.toLocaleString()}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 17,
                  marginTop: 12,
                  letterSpacing: 0.3,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
