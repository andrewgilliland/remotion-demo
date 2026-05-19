import { interpolate } from "remotion";
import type { Service, Conn } from "../types/aws-diagram";
import { edgePoint } from "./edgePoint";
import { AwsArrowhead } from "./AwsArrowhead";

interface ConnectionLayerProps {
  connections: Conn[];
  services: Service[];
  frame: number;
  flowStart: number;
  flowPeriod: number;
  boxW: number;
  boxH: number;
}

export function AwsConnectionLayer({
  connections,
  services,
  frame,
  flowStart,
  flowPeriod,
  boxW,
  boxH,
}: ConnectionLayerProps) {
  const getSvc = (id: string) => services.find((s) => s.id === id)!;

  return (
    <>
      {connections.map((conn) => {
        const a = getSvc(conn.from);
        const b = getSvc(conn.to);
        const p1 = edgePoint(a.x, a.y, b.x, b.y, boxW, boxH);
        const p2 = edgePoint(b.x, b.y, a.x, a.y, boxW, boxH);
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

        const isVertical = Math.abs(dy) > Math.abs(dx);
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        const dots =
          frame >= flowStart
            ? Array.from({ length: 3 }).map((_, di) => {
                const t =
                  ((((frame - flowStart) / flowPeriod +
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
                <AwsArrowhead
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  color="white"
                  boxW={boxW}
                  boxH={boxH}
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
    </>
  );
}
