import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// ── Layout constants ─────────────────────────────────────────────────────────
const BOX_W = 148;
const BOX_H = 56;

// ── Data ─────────────────────────────────────────────────────────────────────
interface Service {
  id: string;
  label: string;
  sub: string;
  abbr: string;
  x: number;
  y: number;
  color: string;
  enterFrame: number;
}

interface Conn {
  from: string;
  to: string;
  drawFrame: number;
  flowOffset: number;
  label?: string;
}

//
// Static website on S3 — left-to-right main path with supporting services
//
//                  ACM          OAC
//                   ↓            ↓
//  Users → Route 53 → CloudFront → S3
//                         ↑
//                        WAF
//

const CY = 360;

const SERVICES: Service[] = [
  {
    id: "users",
    label: "Users",
    sub: "Browser / Device",
    abbr: "USR",
    x: 90,
    y: CY,
    color: "#6366f1",
    enterFrame: 10,
  },
  {
    id: "route53",
    label: "Route 53",
    sub: "DNS Lookup",
    abbr: "R53",
    x: 310,
    y: CY,
    color: "#a78bfa",
    enterFrame: 28,
  },
  {
    id: "cloudfront",
    label: "CloudFront",
    sub: "CDN Distribution",
    abbr: "CF",
    x: 570,
    y: CY,
    color: "#fb923c",
    enterFrame: 46,
  },
  {
    id: "s3",
    label: "S3 Bucket",
    sub: "Static Files",
    abbr: "S3",
    x: 850,
    y: CY,
    color: "#4ade80",
    enterFrame: 64,
  },
  {
    id: "acm",
    label: "ACM",
    sub: "TLS Certificate",
    abbr: "ACM",
    x: 570,
    y: CY - 190,
    color: "#f87171",
    enterFrame: 90,
  },
  {
    id: "waf",
    label: "WAF",
    sub: "Web Firewall",
    abbr: "WAF",
    x: 570,
    y: CY + 190,
    color: "#f87171",
    enterFrame: 108,
  },
  {
    id: "oac",
    label: "Origin AC",
    sub: "Access Control",
    abbr: "OAC",
    x: 850,
    y: CY - 190,
    color: "#60a5fa",
    enterFrame: 126,
  },
];

const CONNECTIONS: Conn[] = [
  {
    from: "users",
    to: "route53",
    drawFrame: 150,
    flowOffset: 0.0,
    label: "DNS query",
  },
  {
    from: "route53",
    to: "cloudfront",
    drawFrame: 166,
    flowOffset: 0.25,
    label: "CNAME alias",
  },
  {
    from: "cloudfront",
    to: "s3",
    drawFrame: 182,
    flowOffset: 0.5,
    label: "Origin fetch",
  },
  {
    from: "acm",
    to: "cloudfront",
    drawFrame: 200,
    flowOffset: 0.0,
    label: "TLS cert",
  },
  {
    from: "waf",
    to: "cloudfront",
    drawFrame: 216,
    flowOffset: 0.0,
    label: "Rules",
  },
  {
    from: "oac",
    to: "cloudfront",
    drawFrame: 232,
    flowOffset: 0.0,
    label: "Auth",
  },
  {
    from: "oac",
    to: "s3",
    drawFrame: 248,
    flowOffset: 0.5,
    label: "Signed req",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getSvc(id: string) {
  return SERVICES.find((s) => s.id === id)!;
}

// Returns the point on the box edge closest toward (tx, ty)
function edgePoint(cx: number, cy: number, tx: number, ty: number) {
  const dx = tx - cx;
  const dy = ty - cy;
  const d = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / d;
  const uy = dy / d;
  const tX = Math.abs(ux) > 1e-6 ? BOX_W / 2 / Math.abs(ux) : Infinity;
  const tY = Math.abs(uy) > 1e-6 ? BOX_H / 2 / Math.abs(uy) : Infinity;
  const t = Math.min(tX, tY);
  return { x: cx + ux * t, y: cy + uy * t };
}

// Arrowhead pointing from (x1,y1) toward (x2,y2), tip clipped to dest box edge
function Arrowhead({
  x1,
  y1,
  x2,
  y2,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / d;
  const uy = dy / d;
  const tip = edgePoint(x2, y2, x1, y1);
  const len = 9;
  const wing = 5;
  return (
    <polygon
      points={`${tip.x},${tip.y} ${tip.x - len * ux + wing * -uy},${tip.y - len * uy + wing * ux} ${tip.x - len * ux - wing * -uy},${tip.y - len * uy - wing * ux}`}
      fill={color}
      fillOpacity={0.6}
    />
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export const AwsDiagram = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const FLOW_PERIOD = 55;
  const FLOW_START = 266; // after last connection is drawn

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cloudBoundaryOpacity = interpolate(frame, [8, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const legendOpacity = interpolate(frame, [256, 276], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        background: "#0d1117",
        fontFamily: "system-ui, sans-serif",
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
          {SERVICES.map((svc) => (
            <clipPath key={`clip-${svc.id}`} id={`clip-${svc.id}`}>
              <rect
                x={svc.x - BOX_W / 2}
                y={svc.y - BOX_H / 2}
                width={BOX_W}
                height={BOX_H}
                rx={10}
              />
            </clipPath>
          ))}
        </defs>

        {/* ── AWS Cloud boundary ────────────────────────────────────────── */}
        <rect
          x={220}
          y={90}
          width={720}
          height={540}
          rx={14}
          fill="rgba(37,99,235,0.03)"
          stroke="rgba(99,130,246,0.18)"
          strokeWidth={1.5}
          strokeDasharray="10 5"
          opacity={cloudBoundaryOpacity}
        />
        <text
          x={238}
          y={112}
          fill="rgba(148,163,184,0.38)"
          fontSize={11}
          fontWeight="600"
          opacity={cloudBoundaryOpacity}
        >
          AWS Cloud
        </text>

        {/* ── Connection lines ──────────────────────────────────────────── */}
        {CONNECTIONS.map((conn) => {
          const a = getSvc(conn.from);
          const b = getSvc(conn.to);
          const p1 = edgePoint(a.x, a.y, b.x, b.y);
          const p2 = edgePoint(b.x, b.y, a.x, a.y);
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const length = Math.sqrt(dx * dx + dy * dy);

          const drawProgress = interpolate(
            frame,
            [conn.drawFrame, conn.drawFrame + 16],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const drawn = drawProgress >= 0.98;
          const flowActive = frame >= FLOW_START;

          const isVertical = Math.abs(dy) > Math.abs(dx);
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          const dots = flowActive
            ? Array.from({ length: 3 }).map((_, di) => {
                const t =
                  ((((frame - FLOW_START) / FLOW_PERIOD +
                    conn.flowOffset +
                    di / 3) %
                    1) +
                    1) %
                  1;
                return {
                  x: p1.x + (p2.x - p1.x) * t,
                  y: p1.y + (p2.y - p1.y) * t,
                  opacity: 0.9 - t * 0.5,
                };
              })
            : [];

          return (
            <g key={`${conn.from}→${conn.to}`}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={length * (1 - drawProgress)}
              />
              {drawn && (
                <>
                  <Arrowhead
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    color="white"
                  />
                  {conn.label && (
                    <text
                      x={midX + (isVertical ? 26 : 0)}
                      y={midY + (isVertical ? 0 : -9)}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.28)"
                      fontSize={10}
                    >
                      {conn.label}
                    </text>
                  )}
                </>
              )}
              {dots.map((dot, di) => (
                <circle
                  key={di}
                  cx={dot.x}
                  cy={dot.y}
                  r={3}
                  fill="white"
                  opacity={dot.opacity}
                />
              ))}
            </g>
          );
        })}

        {/* ── Service boxes ─────────────────────────────────────────────── */}
        {SERVICES.map((svc) => {
          const s = spring({
            fps,
            frame: Math.max(0, frame - svc.enterFrame),
            config: { damping: 15, stiffness: 150, mass: 0.6 },
          });
          const opacity = Math.min(1, s * 2);
          const bx = svc.x - BOX_W / 2;
          const by = svc.y - BOX_H / 2;

          return (
            <g
              key={svc.id}
              opacity={opacity}
              transform={`translate(${svc.x},${svc.y}) scale(${s}) translate(${-svc.x},${-svc.y})`}
            >
              {/* Drop shadow */}
              <rect
                x={bx + 3}
                y={by + 4}
                width={BOX_W}
                height={BOX_H}
                rx={10}
                fill="rgba(0,0,0,0.45)"
              />
              {/* Box fill */}
              <rect
                x={bx}
                y={by}
                width={BOX_W}
                height={BOX_H}
                rx={10}
                fill="#161b22"
                stroke={svc.color}
                strokeWidth={1.5}
                strokeOpacity={0.6}
              />
              {/* Left color strip (clipped to box shape) */}
              <rect
                x={bx}
                y={by}
                width={8}
                height={BOX_H}
                fill={svc.color}
                fillOpacity={0.85}
                clipPath={`url(#clip-${svc.id})`}
              />
              {/* Abbr badge */}
              <rect
                x={bx + 14}
                y={svc.y - 13}
                width={26}
                height={26}
                rx={5}
                fill={svc.color}
                fillOpacity={0.15}
              />
              <text
                x={bx + 27}
                y={svc.y + 5.5}
                textAnchor="middle"
                fill={svc.color}
                fontSize={svc.abbr.length <= 2 ? 12 : 9}
                fontWeight="800"
              >
                {svc.abbr}
              </text>
              {/* Service name */}
              <text
                x={bx + 48}
                y={svc.y - 3}
                fill="rgba(255,255,255,0.88)"
                fontSize={13}
                fontWeight="600"
              >
                {svc.label}
              </text>
              {/* Sub label */}
              <text
                x={bx + 48}
                y={svc.y + 14}
                fill="rgba(255,255,255,0.36)"
                fontSize={10}
              >
                {svc.sub}
              </text>
            </g>
          );
        })}
      </svg>

      {/* ── Title ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 36,
          opacity: bgOpacity,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          Static Website Hosting
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: 12,
            marginTop: 3,
            letterSpacing: 0.3,
          }}
        >
          S3 + CloudFront + Route 53
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 36,
          display: "flex",
          gap: 18,
          opacity: legendOpacity,
          flexWrap: "wrap",
        }}
      >
        {[
          { color: "#6366f1", label: "Users" },
          { color: "#a78bfa", label: "Networking" },
          { color: "#fb923c", label: "CDN" },
          { color: "#f87171", label: "Security" },
          { color: "#4ade80", label: "Storage" },
          { color: "#60a5fa", label: "Access Control" },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: color,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
