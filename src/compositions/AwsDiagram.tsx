import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import {
  type Service,
  type Conn,
  type LegendItem,
  AwsDiagramLayout,
  AwsServiceClipDefs,
  AwsConnectionLayer,
  AwsServiceBox,
} from "../components/AwsDiagramShared";

// ── Layout constants ─────────────────────────────────────────────────────────
const BOX_W = 148;
const BOX_H = 56;

// ── Data ─────────────────────────────────────────────────────────────────────
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

// ── Main Component ────────────────────────────────────────────────────────────
const CLIP_PREFIX = "aws-static";

const LEGEND: LegendItem[] = [
  { color: "#6366f1", label: "Users" },
  { color: "#a78bfa", label: "Networking" },
  { color: "#fb923c", label: "CDN" },
  { color: "#f87171", label: "Security" },
  { color: "#4ade80", label: "Storage" },
  { color: "#60a5fa", label: "Access Control" },
];

export const AwsDiagram = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const FLOW_PERIOD = 55;
  const FLOW_START = 266;

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const boundaryOpacity = interpolate(frame, [8, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const legendOpacity = interpolate(frame, [256, 276], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AwsDiagramLayout
      width={width}
      height={height}
      title="Static Website Hosting"
      subtitle="S3 + CloudFront + Route 53"
      legendItems={LEGEND}
      titleOpacity={titleOpacity}
      legendOpacity={legendOpacity}
    >
      <defs>
        <AwsServiceClipDefs
          services={SERVICES}
          boxW={BOX_W}
          boxH={BOX_H}
          clipPrefix={CLIP_PREFIX}
        />
      </defs>

      {/* AWS Cloud boundary */}
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
        opacity={boundaryOpacity}
      />
      <text
        x={238}
        y={112}
        fill="rgba(148,163,184,0.38)"
        fontSize={11}
        fontWeight="600"
        opacity={boundaryOpacity}
      >
        AWS Cloud
      </text>

      <AwsConnectionLayer
        connections={CONNECTIONS}
        services={SERVICES}
        frame={frame}
        flowStart={FLOW_START}
        flowPeriod={FLOW_PERIOD}
        boxW={BOX_W}
        boxH={BOX_H}
      />

      {SERVICES.map((svc) => (
        <AwsServiceBox
          key={svc.id}
          svc={svc}
          frame={frame}
          fps={fps}
          boxW={BOX_W}
          boxH={BOX_H}
          clipPrefix={CLIP_PREFIX}
        />
      ))}
    </AwsDiagramLayout>
  );
};
