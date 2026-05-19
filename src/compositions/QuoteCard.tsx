import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const QUOTE = "The only way to do great work is to love what you do.";
const AUTHOR = "Steve Jobs";
const WORDS = QUOTE.split(" ");

export const QuoteCard = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const authorOpacity = interpolate(
    frame,
    [WORDS.length * 4 + 20, WORDS.length * 4 + 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const lineScale = interpolate(
    frame,
    [WORDS.length * 4 + 10, WORDS.length * 4 + 35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, serif",
        padding: 100,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 960, textAlign: "center" }}>
        {/* Opening quote mark */}
        <div
          style={{
            fontSize: 120,
            color: "rgba(255,255,255,0.08)",
            lineHeight: 0.6,
            marginBottom: 24,
            fontFamily: "Georgia, serif",
          }}
        >
          &ldquo;
        </div>

        {/* Animated words */}
        <div style={{ fontSize: 38, lineHeight: 1.65, color: "white" }}>
          {WORDS.map((word, i) => {
            const start = i * 4;
            const opacity = interpolate(frame, [start, start + 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const y = interpolate(frame, [start, start + 14], [16, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity,
                  transform: `translateY(${y}px)`,
                  marginRight: "0.28em",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 60,
            height: 2,
            background: "rgba(255,255,255,0.4)",
            margin: "36px auto 24px",
            transform: `scaleX(${lineScale})`,
            transformOrigin: "center",
          }}
        />

        {/* Author */}
        <div
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 22,
            fontStyle: "italic",
            letterSpacing: 1,
            opacity: authorOpacity,
          }}
        >
          — {AUTHOR}
        </div>
      </div>
    </div>
  );
};
