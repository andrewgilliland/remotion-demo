import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const BOX_W = 136;
const BOX_H = 52;

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
}

const SERVICES: Service[] = [
  { id: "internet",   label: "Internet",     sub: "Users",        abbr: "NET", x: 80,   y: 300, color: "#6366f1", enterFrame: 10  },
  { id: "route53",    label: "Route 53",     sub: "DNS",          abbr: "R53", x: 285,  y: 195, color: "#a78bfa", enterFrame: 22  },
  { id: "cloudfront", label: "CloudFront",   sub: "CDN",          abbr: "CF",  x: 285,  y: 405, color: "#a78bfa", enterFrame: 32  },
  { id: "waf",        label: "WAF",          sub: "Shield",       abbr: "WAF", x: 490,  y: 195, color: "#f87171", enterFrame: 44  },
  { id: "alb",        label: "Load Balancer",sub: "ALB",          abbr: "ALB", x: 490,  y: 405, color: "#fb923c", enterFrame: 56  },
  { id: "ec2a",       label: "EC2",          sub: "App Server",   abbr: "EC2", x: 700,  y: 155, color: "#fb923c", enterFrame: 68  },
  { id: "ec2b",       label: "EC2",          sub: "App Server",   abbr: "EC2", x: 700,  y: 315, color: "#fb923c", enterFrame: 76  },
  { id: "ecs",        label: "ECS Fargate",  sub: "Containers",   abbr: "ECS", x: 700,  y: 475, color: "#fb923c", enterFrame: 84  },
  { id: "rds",        label: "RDS",          sub: "PostgreSQL",   abbr: "RDS", x: 910,  y: 195, color: "#60a5fa", enterFrame: 96  },
  { id: "cache",      label: "ElastiCache",  sub: "Redis",        abbr: "E$",  x: 910,  y: 375, color: "#f87171", enterFrame: 106 },
  { id: "s3",         label: "S3",           sub: "Object Store", abbr: "S3",  x: 910,  y: 545, color: "#4ade80", enterFrame: 116 },
  { id: "lambda",     label: "Lambda",       sub: "Serverless",   abbr: "λ",   x: 1130, y: 285, color: "#fb923c", enterFrame: 128 },
  { id: "sqs",        label: "SQS",          sub: "Queue",        abbr: "SQS", x: 1130, y: 455, color: "#f472b6", enterFrame: 138 },
];

const CONNECTIONS: Conn[] = [
  { from: "internet",   to: "route53",    drawFrame: 158, flowOffset: 0.0  },
  { from: "internet",   to: "cloudfront", drawFrame: 165, flowOffset: 0.33 },
  { from: "route53",    to: "waf",        drawFrame: 172, flowOffset: 0.0  },
  { from: "cloudfront", to: "alb",        drawFrame: 179, flowOffset: 0.0  },
  { from: "waf",        to: "alb",        drawFrame: 186, flowOffset: 0.5  },
  { from: "alb",        to: "ec2a",       drawFrame: 193, flowOffset: 0.0  },
  { from: "alb",        to: "ec2b",       drawFrame: 200, flowOffset: 0.33 },
  { from: "alb",        to: "ecs",        drawFrame: 207, flowOffset: 0.66 },
  { from: "ec2a",       to: "rds",        drawFrame: 214, flowOffset: 0.0  },
  { from: "ec2b",       to: "cache",      drawFrame: 221, flowOffset: 0.0  },
  { from: "ecs",        to: "s3",         drawFrame: 228, flowOffset: 0.0  },
  { from: "s3",         to: "lambda",     drawFrame: 235, flowOffset: 0.0  },
  { from: "lambda",     to: "sqs",        drawFrame: 242, flowOffset: 0.0  },
  { from: "ec2a",       to: "cache",      drawFrame: 249, flowOffset: 0.5  },
];

function getSvc(id: string) {
  return SERVICES.find((s) => s.id === id)!;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function Arrowhead({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / d;
  const uy = dy / d;
  const tipX = x2 - ux * (BOX_W / 2 + 2);
  const tipY = y2 - uy * (BOX_H / 2 + 2);
  const len = 9;
  const wing = 5;
  return (
    <polygon
      points={`${tipX},${tipY} ${tipX - len * ux + wing * -uy},${tipY - len * uy + wing * ux} ${tipX - len * ux - wing * -uy},${tipY - len * uy - wing * ux}`}
      fill={color}
      fillOpacity={0.55}
    />
  );
}

export const AwsInfraDiagram = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const FLOW_PERIOD = 52;
  const FLOW_START = 176;

  const bgOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vpcOpacity = interpolate(frame, [8, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const legendOpacity = interpolate(frame, [255, 275], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ width, height, background: "#0d1117", fontFamily: "system-ui, sans-serif", overflow: "hidden", position: "relative" }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {SERVICES.map((svc) => (
            <clipPath key={`clip-${svc.id}`} id={`infra-clip-${svc.id}`}>
              <rect x={svc.x - BOX_W / 2} y={svc.y - BOX_H / 2} width={BOX_W} height={BOX_H} rx={10} />
            </clipPath>
          ))}
        </defs>

        {/* VPC boundary */}
        <rect x={618} y={90} width={620} height={530} rx={14}
          fill="rgba(37,99,235,0.04)" stroke="rgba(59,130,246,0.22)"
          strokeWidth={1.5} strokeDasharray="9 5" opacity={vpcOpacity} />
        <text x={634} y={111} fill="rgba(96,165,250,0.55)" fontSize={11} fontWeight="600" opacity={vpcOpacity}>
          VPC — us-east-1
        </text>
        {[252, 412].map((y) => (
          <line key={y} x1={628} y1={y} x2={1228} y2={y}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="5 7" opacity={vpcOpacity} />
        ))}
        {["AZ-1", "AZ-2", "AZ-3"].map((label, i) => (
          <text key={label} x={634} y={[145, 305, 465][i]}
            fill="rgba(255,255,255,0.08)" fontSize={10} opacity={vpcOpacity}>{label}</text>
        ))}

        {/* Connections */}
        {CONNECTIONS.map((conn) => {
          const a = getSvc(conn.from);
          const b = getSvc(conn.to);
          const length = dist(a.x, a.y, b.x, b.y);
          const drawProgress = interpolate(frame, [conn.drawFrame, conn.drawFrame + 16], [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const drawn = drawProgress >= 0.98;
          const flowActive = frame >= FLOW_START;
          const dots = flowActive
            ? Array.from({ length: 3 }).map((_, di) => {
                const t = ((((frame - FLOW_START) / FLOW_PERIOD + conn.flowOffset + di / 3) % 1) + 1) % 1;
                return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, opacity: 0.85 - t * 0.4 };
              })
            : [];
          return (
            <g key={`${conn.from}→${conn.to}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="rgba(255,255,255,0.14)" strokeWidth={1.5} strokeLinecap="round"
                strokeDasharray={length} strokeDashoffset={length * (1 - drawProgress)} />
              {drawn && <Arrowhead x1={a.x} y1={a.y} x2={b.x} y2={b.y} color="white" />}
              {dots.map((dot, di) => (
                <circle key={di} cx={dot.x} cy={dot.y} r={3} fill="white" opacity={dot.opacity} />
              ))}
            </g>
          );
        })}

        {/* Service boxes */}
        {SERVICES.map((svc) => {
          const s = spring({ fps, frame: Math.max(0, frame - svc.enterFrame), config: { damping: 16, stiffness: 160, mass: 0.6 } });
          const opacity = Math.min(1, s * 1.8);
          const bx = svc.x - BOX_W / 2;
          const by = svc.y - BOX_H / 2;
          return (
            <g key={svc.id} opacity={opacity} transform={`translate(${svc.x},${svc.y}) scale(${s}) translate(${-svc.x},${-svc.y})`}>
              <rect x={bx + 3} y={by + 4} width={BOX_W} height={BOX_H} rx={10} fill="rgba(0,0,0,0.45)" />
              <rect x={bx} y={by} width={BOX_W} height={BOX_H} rx={10} fill="#161b22" stroke={svc.color} strokeWidth={1.5} strokeOpacity={0.6} />
              <rect x={bx} y={by} width={7} height={BOX_H} fill={svc.color} fillOpacity={0.9} clipPath={`url(#infra-clip-${svc.id})`} />
              <rect x={bx + 14} y={svc.y - 12} width={24} height={24} rx={5} fill={svc.color} fillOpacity={0.18} />
              <text x={bx + 26} y={svc.y + 5} textAnchor="middle" fill={svc.color} fontSize={svc.abbr.length <= 2 ? 11 : 9} fontWeight="800">{svc.abbr}</text>
              <text x={bx + 46} y={svc.y - 3} fill="rgba(255,255,255,0.88)" fontSize={12} fontWeight="600">{svc.label}</text>
              <text x={bx + 46} y={svc.y + 13} fill="rgba(255,255,255,0.38)" fontSize={10}>{svc.sub}</text>
            </g>
          );
        })}
      </svg>

      {/* Title */}
      <div style={{ position: "absolute", top: 22, left: 36, opacity: bgOpacity }}>
        <div style={{ color: "white", fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>AWS Infrastructure</div>
        <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, marginTop: 3, letterSpacing: 0.3 }}>Production Architecture · us-east-1</div>
      </div>

      {/* Legend */}
      <div style={{ position: "absolute", bottom: 22, left: 36, display: "flex", gap: 18, opacity: legendOpacity, flexWrap: "wrap" }}>
        {[
          { color: "#a78bfa", label: "Networking" },
          { color: "#f87171", label: "Security / Cache" },
          { color: "#fb923c", label: "Compute" },
          { color: "#60a5fa", label: "Database" },
          { color: "#4ade80", label: "Storage" },
          { color: "#f472b6", label: "Messaging" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
