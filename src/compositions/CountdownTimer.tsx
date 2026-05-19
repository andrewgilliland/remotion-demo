import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const COUNTDOWN_FROM = 10; // seconds

export const CountdownTimer = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const totalSeconds = durationInFrames / fps;
  const elapsed = frame / fps;
  const remaining = Math.ceil(totalSeconds - elapsed);
  const display = remaining <= 0 ? 0 : remaining;

  const secondProgress = (frame % fps) / fps;

  const circumference = 2 * Math.PI * 140;
  const dashOffset = circumference * secondProgress;

  const secondFrame = frame % fps;
  const scale = spring({
    fps,
    frame: secondFrame,
    config: { damping: 10, stiffness: 200, mass: 0.5 },
  });

  const hue = interpolate(display, [0, COUNTDOWN_FROM], [0, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <svg width={360} height={360} viewBox="0 0 360 360">
        {/* Track ring */}
        <circle
          cx={180}
          cy={180}
          r={140}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={12}
        />
        {/* Draining arc */}
        <circle
          cx={180}
          cy={180}
          r={140}
          fill="none"
          stroke={`hsl(${hue},90%,60%)`}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 180 180)"
          style={{ filter: `drop-shadow(0 0 8px hsl(${hue},90%,60%))` }}
        />
        {/* Number */}
        <text
          x={180}
          y={180}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={120}
          fontWeight="700"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "180px 180px",
          }}
        >
          {display}
        </text>
      </svg>
    </div>
  );
};
