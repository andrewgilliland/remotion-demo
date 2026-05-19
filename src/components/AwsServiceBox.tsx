import { spring } from "remotion";
import type { Service } from "../types/aws-diagram";

interface ServiceBoxProps {
  svc: Service;
  frame: number;
  fps: number;
  boxW: number;
  boxH: number;
  clipPrefix: string;
}

export function AwsServiceBox({
  svc,
  frame,
  fps,
  boxW,
  boxH,
  clipPrefix,
}: ServiceBoxProps) {
  const s = spring({
    fps,
    frame: Math.max(0, frame - svc.enterFrame),
    config: { damping: 15, stiffness: 155, mass: 0.6 },
  });
  const opacity = Math.min(1, s * 2);
  const bx = svc.x - boxW / 2;
  const by = svc.y - boxH / 2;

  return (
    <g
      opacity={opacity}
      transform={`translate(${svc.x},${svc.y}) scale(${s}) translate(${-svc.x},${-svc.y})`}
    >
      {/* shadow */}
      <rect
        x={bx + 3}
        y={by + 4}
        width={boxW}
        height={boxH}
        rx={10}
        fill="rgba(0,0,0,0.45)"
      />
      {/* body */}
      <rect
        x={bx}
        y={by}
        width={boxW}
        height={boxH}
        rx={10}
        fill="#161b22"
        stroke={svc.color}
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />
      {/* color strip */}
      <rect
        x={bx}
        y={by}
        width={8}
        height={boxH}
        fill={svc.color}
        fillOpacity={0.85}
        clipPath={`url(#${clipPrefix}-${svc.id})`}
      />
      {/* abbr badge */}
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
      {/* label */}
      <text
        x={bx + 48}
        y={svc.y - 3}
        fill="rgba(255,255,255,0.88)"
        fontSize={13}
        fontWeight="600"
      >
        {svc.label}
      </text>
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
}
