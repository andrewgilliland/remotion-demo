import { useCurrentFrame, interpolate } from "remotion";

const WEEKS = 26;
const DAYS = 7;
const CELL = 22;
const GAP = 4;
const TOTAL = WEEKS * DAYS;

const LEVELS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export const GitHubGraph = () => {
  const frame = useCurrentFrame();

  const gridW = WEEKS * (CELL + GAP) - GAP;
  const gridH = DAYS * (CELL + GAP) - GAP;

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        gap: 32,
      }}
    >
      <div
        style={{
          color: "#c9d1d9",
          fontSize: 28,
          fontWeight: 700,
          opacity: titleOpacity,
          letterSpacing: -0.5,
        }}
      >
        GitHub Contributions — 2025
      </div>

      <svg width={gridW} height={gridH}>
        {Array.from({ length: WEEKS }).map((_, week) =>
          Array.from({ length: DAYS }).map((_, day) => {
            const index = week * DAYS + day;
            const rand = seededRandom(index);
            const activity =
              rand < 0.3
                ? 0
                : rand < 0.5
                  ? 1
                  : rand < 0.7
                    ? 2
                    : rand < 0.9
                      ? 3
                      : 4;

            const revealFrame = (index / TOTAL) * 80;
            const opacity = interpolate(
              frame,
              [revealFrame, revealFrame + 10],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );
            const scale = interpolate(
              frame,
              [revealFrame, revealFrame + 10],
              [0.2, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            const cx = week * (CELL + GAP) + CELL / 2;
            const cy = day * (CELL + GAP) + CELL / 2;
            const half = (CELL / 2) * scale;

            return (
              <rect
                key={index}
                x={cx - half}
                y={cy - half}
                width={CELL * scale}
                height={CELL * scale}
                rx={4 * scale}
                fill={LEVELS[activity]}
                opacity={opacity}
              />
            );
          }),
        )}
      </svg>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          opacity: interpolate(frame, [90, 110], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: "#8b949e", fontSize: 13 }}>Less</span>
        {LEVELS.map((color, i) => (
          <div
            key={i}
            style={{
              width: CELL,
              height: CELL,
              borderRadius: 4,
              background: color,
            }}
          />
        ))}
        <span style={{ color: "#8b949e", fontSize: 13 }}>More</span>
      </div>
    </div>
  );
};
