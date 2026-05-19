export interface Service {
  id: string;
  label: string;
  sub: string;
  abbr: string;
  x: number;
  y: number;
  color: string;
  enterFrame: number;
}

export interface Conn {
  from: string;
  to: string;
  drawFrame: number;
  flowOffset: number;
  label?: string;
}

export interface LegendItem {
  color: string;
  label: string;
}
