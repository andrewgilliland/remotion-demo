import React from "react";
import type { LegendItem } from "../types/aws-diagram";

interface DiagramLayoutProps {
  width: number;
  height: number;
  title: string;
  subtitle: string;
  legendItems: LegendItem[];
  titleOpacity: number;
  legendOpacity: number;
  /** Rendered inside the full-bleed <svg>. */
  children: React.ReactNode;
}

export function AwsDiagramLayout({
  width,
  height,
  title,
  subtitle,
  legendItems,
  titleOpacity,
  legendOpacity,
  children,
}: DiagramLayoutProps) {
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
        {children}
      </svg>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 36,
          opacity: titleOpacity,
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
          {title}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: 12,
            marginTop: 3,
            letterSpacing: 0.3,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Legend */}
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
        {legendItems.map(({ color, label }) => (
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
}
