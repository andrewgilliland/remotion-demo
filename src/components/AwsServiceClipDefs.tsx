import type { Service } from "../types/aws-diagram";

interface ClipDefsProps {
  services: Service[];
  boxW: number;
  boxH: number;
  clipPrefix: string;
}

/** Render inside a SVG <defs> element. */
export function AwsServiceClipDefs({
  services,
  boxW,
  boxH,
  clipPrefix,
}: ClipDefsProps) {
  return (
    <>
      {services.map((svc) => (
        <clipPath key={svc.id} id={`${clipPrefix}-${svc.id}`}>
          <rect
            x={svc.x - boxW / 2}
            y={svc.y - boxH / 2}
            width={boxW}
            height={boxH}
            rx={10}
          />
        </clipPath>
      ))}
    </>
  );
}
