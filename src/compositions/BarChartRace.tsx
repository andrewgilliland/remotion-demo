import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const STAGES = [
  {
    year: "2021",
    data: [
      { name: "React", value: 40 },
      { name: "Vue", value: 30 },
      { name: "Angular", value: 50 },
      { name: "Svelte", value: 10 },
      { name: "Next.js", value: 22 },
    ],
  },
  {
    year: "2022",
    data: [
      { name: "React", value: 58 },
      { name: "Vue", value: 36 },
      { name: "Angular", value: 44 },
      { name: "Svelte", value: 28 },
      { name: "Next.js", value: 45 },
    ],
  },
  {
    year: "2023",
    data: [
      { name: "React", value: 68 },
      { name: "Vue", value: 39 },
      { name: "Angular", value: 37 },
      { name: "Svelte", value: 44 },
      { name: "Next.js", value: 62 },
    ],
  },
  {
    year: "2024",
    data: [
      { name: "React", value: 75 },
      { name: "Vue", value: 41 },
      { name: "Angular", value: 32 },
      { name: "Svelte", value: 55 },
      { name: "Next.js", value: 78 },
    ],
  },
];

const COLORS: Record<string, string> = {
  React: "#61dafb",
  Vue: "#42b883",
  Angular: "#dd0031",
  Svelte: "#ff3e00",
  "Next.js": "#e2e8f0",
};

const FRAMES_PER_STAGE = 70;
const INTRO_FRAMES = 20;

export const BarChartRace = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const animFrame = Math.max(0, frame - INTRO_FRAMES);
  const stageIndex = Math.min(
    Math.floor(animFrame / FRAMES_PER_STAGE),
    STAGES.length - 2,
  );
  const stageProgress = Math.min(
    (animFrame - stageIndex * FRAMES_PER_STAGE) / FRAMES_PER_STAGE,
    1,
  );

  const fromStage = STAGES[stageIndex];
  const toStage = STAGES[stageIndex + 1];

  const currentData = fromStage.data.map((item, i) => ({
    name: item.name,
    value: interpolate(
      stageProgress,
      [0, 1],
      [item.value, toStage.data[i].value],
    ),
  }));

  const sorted = [...currentData].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sorted.map((d) => d.value));

  const currentYear = interpolate(
    animFrame,
    [0, FRAMES_PER_STAGE * (STAGES.length - 1)],
    [parseInt(STAGES[0].year), parseInt(STAGES[STAGES.length - 1].year)],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const titleOpacity = interpolate(frame, [0, INTRO_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const BAR_HEIGHT = 62;
  const BAR_GAP = 18;
  const LABEL_W = 110;
  const VALUE_W = 60;
  const MAX_BAR_W = width - 120 - LABEL_W - VALUE_W;

  return (
    <div
      style={{
        width,
        height,
        background: "#0a0a14",
        fontFamily: "system-ui, sans-serif",
        padding: "56px 60px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 44,
          opacity: titleOpacity,
        }}
      >
        JS Framework Popularity
      </div>

      <div>
        {sorted.map((item) => {
          const barW = (item.value / maxValue) * MAX_BAR_W;
          const color = COLORS[item.name];
          return (
            <div
              key={item.name}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: BAR_GAP,
              }}
            >
              <div
                style={{
                  width: LABEL_W,
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 15,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {item.name}
              </div>
              <div
                style={{
                  height: BAR_HEIGHT,
                  width: barW,
                  background: `linear-gradient(90deg, ${color}cc, ${color})`,
                  borderRadius: "0 10px 10px 0",
                  boxShadow: `0 0 20px ${color}44`,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 15,
                  marginLeft: 14,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round(item.value)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Year watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          color: "rgba(255,255,255,0.06)",
          fontSize: 120,
          fontWeight: 900,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(currentYear)}
      </div>
    </div>
  );
};
