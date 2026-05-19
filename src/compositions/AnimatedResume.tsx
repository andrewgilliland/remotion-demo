import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const SKILLS = [
  { name: "TypeScript", level: 90, color: "#3b82f6" },
  { name: "React", level: 85, color: "#61dafb" },
  { name: "Node.js", level: 78, color: "#22c55e" },
  { name: "CSS / Tailwind", level: 80, color: "#a78bfa" },
  { name: "Python", level: 62, color: "#facc15" },
];

const JOBS = [
  {
    company: "Tech Corp",
    title: "Senior Engineer",
    years: "2022 – Present",
    desc: "Led architecture of core platform services.",
  },
  {
    company: "Startup Inc",
    title: "Full Stack Developer",
    years: "2019 – 2022",
    desc: "Built end-to-end product features in React + Node.",
  },
  {
    company: "Agency Co",
    title: "Frontend Developer",
    years: "2017 – 2019",
    desc: "Delivered responsive web apps for 20+ clients.",
  },
];

export const AnimatedResume = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sidebarX = interpolate(frame, [0, 22], [-340, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mainX = interpolate(frame, [8, 30], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mainOpacity = interpolate(frame, [8, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        background: "#f1f5f9",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 320,
          background: "#1e293b",
          padding: "48px 32px",
          color: "white",
          flexShrink: 0,
          transform: `translateX(${sidebarX}px)`,
          boxSizing: "border-box",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            marginBottom: 18,
            opacity: interpolate(frame, [18, 38], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
          }}
        >
          👤
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>
          Andrew Gilliland
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 36 }}>
          Software Engineer
        </div>

        <div
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: 2.5,
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          Skills
        </div>

        {SKILLS.map((skill, i) => {
          const start = 42 + i * 12;
          const barW = interpolate(frame, [start, start + 30], [0, skill.level], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(frame, [start, start + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={skill.name} style={{ marginBottom: 16, opacity }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                <span>{skill.name}</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>
                  {Math.round(barW)}%
                </span>
              </div>
              <div
                style={{
                  height: 4,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${barW}%`,
                    background: skill.color,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          padding: "48px 52px",
          transform: `translateX(${mainX}px)`,
          opacity: mainOpacity,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}
        >
          Experience
        </div>
        <div
          style={{
            width: 44,
            height: 4,
            background: "#7c3aed",
            borderRadius: 2,
            marginBottom: 36,
            transform: `scaleX(${interpolate(frame, [25, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            transformOrigin: "left",
          }}
        />

        {JOBS.map((job, i) => {
          const start = 50 + i * 28;
          const opacity = interpolate(frame, [start, start + 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(frame, [start, start + 22], [18, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={job.company}
              style={{
                marginBottom: 34,
                opacity,
                transform: `translateY(${y}px)`,
                paddingLeft: 16,
                borderLeft: "2px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 2,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>
                  {job.title}
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>{job.years}</div>
              </div>
              <div style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, marginBottom: 6 }}>
                {job.company}
              </div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
                {job.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
