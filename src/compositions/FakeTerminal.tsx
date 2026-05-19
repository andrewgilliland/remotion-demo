import { useCurrentFrame, useVideoConfig } from "remotion";

const LINES = [
  { prompt: true, text: "npm install remotion" },
  { prompt: false, text: "added 142 packages in 3.2s" },
  { prompt: false, text: "" },
  { prompt: true, text: "npx remotion studio" },
  { prompt: false, text: "✓ Starting Remotion Studio..." },
  { prompt: false, text: "✓ Bundling compositions..." },
  { prompt: false, text: "✓ Ready at http://localhost:3000" },
  { prompt: false, text: "" },
  { prompt: true, text: "npx remotion render GenerativeArt out/video.mp4" },
  { prompt: false, text: "✓ Composition: GenerativeArt (1280×720 @ 60fps)" },
  { prompt: false, text: "  Rendering frame   0 / 180..." },
  { prompt: false, text: "  Rendering frame  60 / 180..." },
  { prompt: false, text: "  Rendering frame 120 / 180..." },
  { prompt: false, text: "  Rendering frame 180 / 180..." },
  { prompt: false, text: "✓ Encoded in 4.3s → out/video.mp4" },
  { prompt: true, text: "" },
];

const CHARS_PER_FRAME = 3;

function lineColor(line: { prompt: boolean; visible: string }): string {
  if (line.prompt) return "#c084fc";
  if (line.visible.startsWith("✓")) return "#4ade80";
  if (line.visible.startsWith("  Rendering")) return "#94a3b8";
  return "rgba(255,255,255,0.72)";
}

export const FakeTerminal = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  let remaining = frame * CHARS_PER_FRAME;
  const lines = LINES.map((line) => {
    const full = line.prompt ? `❯ ${line.text}` : line.text;
    if (remaining <= 0) return { ...line, full, visible: "", isTyping: false };
    if (remaining >= full.length + 1) {
      remaining -= full.length + 1;
      return { ...line, full, visible: full, isTyping: false };
    }
    const visible = full.slice(0, remaining);
    remaining = 0;
    return { ...line, full, visible, isTyping: true };
  });

  const showCursor = Math.floor(frame / 18) % 2 === 0;
  const lastActive = lines.reduce(
    (last, l, i) => (l.visible.length > 0 ? i : last),
    0,
  );

  return (
    <div
      style={{
        width,
        height,
        background: "#09090f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier New', 'Menlo', monospace",
      }}
    >
      <div
        style={{
          width: 880,
          background: "#141420",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow:
            "0 30px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "#1e1e2e",
            padding: "11px 18px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {["#f38ba8", "#fab387", "#a6e3a1"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 13,
              marginLeft: 10,
            }}
          >
            zsh — remotion-demo
          </span>
        </div>

        {/* Terminal body */}
        <div style={{ padding: "26px 30px 30px", minHeight: 380 }}>
          {lines.map((line, i) => {
            if (line.visible.length === 0 && i > lastActive) return null;
            const isLastActive = i === lastActive;
            return (
              <div
                key={i}
                style={{
                  lineHeight: "1.85",
                  fontSize: 15,
                  minHeight: "1.85em",
                }}
              >
                <span style={{ color: lineColor(line) }}>{line.visible}</span>
                {isLastActive && showCursor && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 9,
                      height: 17,
                      background: "#c084fc",
                      marginLeft: 2,
                      verticalAlign: "middle",
                      borderRadius: 2,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
