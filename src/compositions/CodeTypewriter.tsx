import { useCurrentFrame, useVideoConfig } from "remotion";

const CODE_LINES = [
  { text: "const fibonacci = (n: number): number => {", type: "keyword" },
  { text: "  if (n <= 1) return n;", type: "code" },
  { text: "  return fibonacci(n - 1) + fibonacci(n - 2);", type: "code" },
  { text: "};", type: "code" },
  { text: "", type: "code" },
  { text: "// Generate the sequence", type: "comment" },
  { text: "const sequence = Array.from(", type: "code" },
  { text: "  { length: 10 },", type: "code" },
  { text: "  (_, i) => fibonacci(i)", type: "code" },
  { text: ");", type: "code" },
  { text: "", type: "code" },
  { text: "console.log(sequence);", type: "code" },
  { text: "// → [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]", type: "comment" },
];

const CHARS_PER_FRAME = 2;

const COLORS: Record<string, string> = {
  keyword: "#cba6f7",
  code: "#cdd6f4",
  comment: "#6c7086",
};

export const CodeTypewriter = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  let remaining = frame * CHARS_PER_FRAME;
  const lines = CODE_LINES.map((line) => {
    if (remaining <= 0) return { ...line, visible: "", isTyping: false };
    if (remaining >= line.text.length + 1) {
      remaining -= line.text.length + 1;
      return { ...line, visible: line.text, isTyping: false };
    }
    const visible = line.text.slice(0, remaining);
    remaining = 0;
    return { ...line, visible, isTyping: true };
  });

  const showCursor = Math.floor(frame / 25) % 2 === 0;
  const typingIdx = lines.findIndex((l) => l.isTyping);
  const cursorIdx =
    typingIdx >= 0
      ? typingIdx
      : lines.reduce((last, l, i) => (l.visible.length > 0 ? i : last), 0);

  return (
    <div
      style={{
        width,
        height,
        background: "#1e1e2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          background: "#11111b",
          borderRadius: 14,
          overflow: "hidden",
          width: 820,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            background: "#1e1e2e",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {["#f38ba8", "#fab387", "#a6e3a1"].map((c, i) => (
            <div
              key={i}
              style={{ width: 13, height: 13, borderRadius: "50%", background: c }}
            />
          ))}
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 13,
              marginLeft: 10,
            }}
          >
            fibonacci.ts
          </span>
        </div>

        {/* Code body */}
        <div style={{ padding: "28px 36px" }}>
          {lines.map((line, i) => {
            const isVisible = line.visible.length > 0 || i === 0;
            if (!isVisible && i > cursorIdx) return null;
            return (
              <div
                key={i}
                style={{ lineHeight: "1.75", fontSize: 17, minHeight: "1.75em" }}
              >
                <span style={{ color: COLORS[line.type] }}>{line.visible}</span>
                {i === cursorIdx && showCursor && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: "1.1em",
                      background: "#cba6f7",
                      verticalAlign: "text-bottom",
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
