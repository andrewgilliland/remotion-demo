import { edgePoint } from "./edgePoint";

interface ArrowheadProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  boxW: number;
  boxH: number;
}

export function AwsArrowhead({
  x1,
  y1,
  x2,
  y2,
  color,
  boxW,
  boxH,
}: ArrowheadProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / d;
  const uy = dy / d;
  const tip = edgePoint(x2, y2, x1, y1, boxW, boxH);
  const len = 9;
  const wing = 5;
  return (
    <polygon
      points={`${tip.x},${tip.y} ${tip.x - len * ux + wing * -uy},${tip.y - len * uy + wing * ux} ${tip.x - len * ux - wing * -uy},${tip.y - len * uy - wing * ux}`}
      fill={color}
      fillOpacity={0.58}
    />
  );
}
