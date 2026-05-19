import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const TWO_PI = Math.PI * 2;

const RINGS = [
  { count: 6, radius: 80, size: 14, speed: 1, hueOffset: 0 },
  { count: 10, radius: 150, size: 10, speed: -0.6, hueOffset: 30 },
  { count: 16, radius: 230, size: 8, speed: 0.4, hueOffset: 60 },
  { count: 24, radius: 310, size: 6, speed: -0.25, hueOffset: 90 },
  { count: 34, radius: 400, size: 5, speed: 0.15, hueOffset: 120 },
];

export const GenerativeArt = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;

  const bgHue = interpolate(frame, [0, durationInFrames], [220, 280]);

  return (
    <div
      style={{
        width,
        height,
        background: `radial-gradient(ellipse at center, hsl(${bgHue},30%,10%) 0%, hsl(${bgHue + 20},20%,4%) 100%)`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={`hsl(${bgHue + 40},80%,60%)`}
              stopOpacity="0.25"
            />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={cx} cy={cy} rx={420} ry={420} fill="url(#glow)" />

        {RINGS.map((ring, ri) =>
          Array.from({ length: ring.count }).map((_, i) => {
            const baseAngle = (TWO_PI / ring.count) * i;
            const angle = baseAngle + (frame / 60) * ring.speed * TWO_PI;

            const x = cx + Math.cos(angle) * ring.radius;
            const y = cy + Math.sin(angle) * ring.radius;

            const pulse = 1 + 0.3 * Math.sin(frame * 0.1 + i * 0.8 + ri);
            const r = (ring.size / 2) * pulse;

            const hue =
              (frame * 1.2 + ring.hueOffset + (360 / ring.count) * i) % 360;
            const lightness = 55 + 20 * Math.sin(frame * 0.05 + i);
            const opacity = 0.7 + 0.3 * Math.sin(frame * 0.08 + i * 1.3);

            return (
              <circle
                key={`${ri}-${i}`}
                cx={x}
                cy={y}
                r={r}
                fill={`hsla(${hue},90%,${lightness}%,${opacity})`}
              />
            );
          }),
        )}

        {[40, 28, 16].map((baseR, i) => {
          const hue = (frame * 2 + i * 40) % 360;
          const r = baseR * (1 + 0.15 * Math.sin(frame * 0.15 + i));
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={`hsla(${hue},100%,70%,${0.9 - i * 0.25})`}
            />
          );
        })}
      </svg>
    </div>
  );
};
