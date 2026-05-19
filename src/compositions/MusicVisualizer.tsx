import { useCurrentFrame, useVideoConfig } from "remotion";

const BAR_COUNT = 60;

function getAmplitude(barIndex: number, frame: number): number {
  const t = frame * 0.05;
  const normalized = barIndex / BAR_COUNT;
  const bass = Math.sin(t * 1.6 + normalized * 2) * 0.5 + 0.5;
  const mid = Math.sin(t * 2.4 + normalized * 5 + 1) * 0.5 + 0.5;
  const hi = Math.sin(t * 3.8 + normalized * 10 + 2) * 0.5 + 0.5;
  // Envelope: taper off at extremes
  const envelope = Math.pow(Math.sin(normalized * Math.PI), 0.7);
  return (bass * 0.5 + mid * 0.3 + hi * 0.2) * envelope;
}

export const MusicVisualizer = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const hueBase = (frame * 1.2) % 360;
  const PADDING = 80;
  const totalBarW = width - PADDING * 2;
  const barW = totalBarW / BAR_COUNT - 2;
  const MAX_H = height * 0.38;
  const centerY = height / 2;

  return (
    <div
      style={{
        width,
        height,
        background: "#000",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 40% at 50% 50%, hsla(${hueBase},70%,30%,0.18) 0%, transparent 70%)`,
        }}
      />

      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Center line */}
        <line
          x1={PADDING}
          y1={centerY}
          x2={width - PADDING}
          y2={centerY}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />

        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const amp = getAmplitude(i, frame);
          const barH = amp * MAX_H;
          const hue = (hueBase + (i / BAR_COUNT) * 80) % 360;
          const x = PADDING + i * (barW + 2);

          return (
            <g key={i}>
              {/* Top bar */}
              <rect
                x={x}
                y={centerY - barH}
                width={barW}
                height={barH}
                rx={barW / 2}
                fill={`hsl(${hue},90%,62%)`}
                opacity={0.92}
              />
              {/* Mirrored bottom bar (dimmer) */}
              <rect
                x={x}
                y={centerY}
                width={barW}
                height={barH * 0.55}
                rx={barW / 2}
                fill={`hsl(${hue},90%,62%)`}
                opacity={0.25}
              />
            </g>
          );
        })}
      </svg>

      {/* Track info */}
      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Generative Waves
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: 13,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Now Playing
        </div>
      </div>
    </div>
  );
};
