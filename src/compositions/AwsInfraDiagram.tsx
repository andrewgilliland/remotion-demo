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

// ── Layout constants ──────────────────────────────────────────────────────────
const BOX_W = 136;
const BOX_H = 52;
const CLIP_PREFIX = "aws-infra";

// ── Data ──────────────────────────────────────────────────────────────────────
const SERVICES: Service[] = [
  {
    id: "internet",
    label: "Internet",
    sub: "Users",
    abbr: "NET",
    x: 80,
    y: 300,
    color: "#6366f1",
    enterFrame: 10,
  },
  {
    id: "route53",
    label: "Route 53",
    sub: "DNS",
    abbr: "R53",
    x: 285,
    y: 195,
    color: "#a78bfa",
    enterFrame: 22,
  },
  {
    id: "cloudfront",
    label: "CloudFront",
    sub: "CDN",
    abbr: "CF",
    x: 285,
    y: 405,
    color: "#a78bfa",
    enterFrame: 32,
  },
  {
    id: "waf",
    label: "WAF",
    sub: "Shield",
    abbr: "WAF",
    x: 490,
    y: 195,
    color: "#f87171",
    enterFrame: 44,
  },
  {
    id: "alb",
    label: "Load Balancer",
    sub: "ALB",
    abbr: "ALB",
    x: 490,
    y: 405,
    color: "#fb923c",
    enterFrame: 56,
  },
  {
    id: "ec2a",
    label: "EC2",
    sub: "App Server",
    abbr: "EC2",
    x: 700,
    y: 155,
    color: "#fb923c",
    enterFrame: 68,
  },
  {
    id: "ec2b",
    label: "EC2",
    sub: "App Server",
    abbr: "EC2",
    x: 700,
    y: 315,
    color: "#fb923c",
    enterFrame: 76,
  },
  {
    id: "ecs",
    label: "ECS Fargate",
    sub: "Containers",
    abbr: "ECS",
    x: 700,
    y: 475,
    color: "#fb923c",
    enterFrame: 84,
  },
  {
    id: "rds",
    label: "RDS",
    sub: "PostgreSQL",
    abbr: "RDS",
    x: 910,
    y: 195,
    color: "#60a5fa",
    enterFrame: 96,
  },
  {
    id: "cache",
    label: "ElastiCache",
    sub: "Redis",
    abbr: "E$",
    x: 910,
    y: 375,
    color: "#f87171",
    enterFrame: 106,
  },
  {
    id: "s3",
    label: "S3",
    sub: "Object Store",
    abbr: "S3",
    x: 910,
    y: 545,
    color: "#4ade80",
    enterFrame: 116,
  },
  {
    id: "lambda",
    label: "Lambda",
    sub: "Serverless",
    abbr: "λ",
    x: 1130,
    y: 285,
    color: "#fb923c",
    enterFrame: 128,
  },
  {
    id: "sqs",
    label: "SQS",
    sub: "Queue",
    abbr: "SQS",
    x: 1130,
    y: 455,
    color: "#f472b6",
    enterFrame: 138,
  },
];

const CONNECTIONS: Conn[] = [
  { from: "internet", to: "route53", drawFrame: 158, flowOffset: 0.0 },
  { from: "internet", to: "cloudfront", drawFrame: 165, flowOffset: 0.33 },
  { from: "route53", to: "waf", drawFrame: 172, flowOffset: 0.0 },
  { from: "cloudfront", to: "alb", drawFrame: 179, flowOffset: 0.0 },
  { from: "waf", to: "alb", drawFrame: 186, flowOffset: 0.5 },
  { from: "alb", to: "ec2a", drawFrame: 193, flowOffset: 0.0 },
  { from: "alb", to: "ec2b", drawFrame: 200, flowOffset: 0.33 },
  { from: "alb", to: "ecs", drawFrame: 207, flowOffset: 0.66 },
  { from: "ec2a", to: "rds", drawFrame: 214, flowOffset: 0.0 },
  { from: "ec2b", to: "cache", drawFrame: 221, flowOffset: 0.0 },
  { from: "ecs", to: "s3", drawFrame: 228, flowOffset: 0.0 },
  { from: "s3", to: "lambda", drawFrame: 235, flowOffset: 0.0 },
  { from: "lambda", to: "sqs", drawFrame: 242, flowOffset: 0.0 },
  { from: "ec2a", to: "cache", drawFrame: 249, flowOffset: 0.5 },
];

const LEGEND: LegendItem[] = [
  { color: "#a78bfa", label: "Networking" },
  { color: "#f87171", label: "Security / Cache" },
  { color: "#fb923c", label: "Compute" },
  { color: "#60a5fa", label: "Database" },
  { color: "#4ade80", label: "Storage" },
  { color: "#f472b6", label: "Messaging" },
];

// ── Main Component ────────────────────────────────────────────────────────────
export const AwsInfraDiagram = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const FLOW_PERIOD = 52;
  const FLOW_START = 176;

  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vpcOpacity = interpolate(frame, [8, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const legendOpacity = interpolate(frame, [255, 275], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AwsDiagramLayout
      width={width}
      height={height}
      title="AWS Infrastructure"
      subtitle="Production Architecture · us-east-1"
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

      {/* VPC boundary */}
      <rect
        x={618}
        y={90}
        width={620}
        height={530}
        rx={14}
        fill="rgba(37,99,235,0.04)"
        stroke="rgba(59,130,246,0.22)"
        strokeWidth={1.5}
        strokeDasharray="9 5"
        opacity={vpcOpacity}
      />
      <text
        x={634}
        y={111}
        fill="rgba(96,165,250,0.55)"
        fontSize={11}
        fontWeight="600"
        opacity={vpcOpacity}
      >
        VPC — us-east-1
      </text>

      {/* AZ divider lines */}
      {[252, 412].map((y) => (
        <line
          key={y}
          x1={628}
          y1={y}
          x2={1228}
          y2={y}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={1}
          strokeDasharray="5 7"
          opacity={vpcOpacity}
        />
      ))}
      {["AZ-1", "AZ-2", "AZ-3"].map((label, i) => (
        <text
          key={label}
          x={634}
          y={([145, 305, 465] as number[])[i]}
          fill="rgba(255,255,255,0.08)"
          fontSize={10}
          opacity={vpcOpacity}
        >
          {label}
        </text>
      ))}

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
