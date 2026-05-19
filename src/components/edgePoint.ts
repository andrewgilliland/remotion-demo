/** Returns the point on a box edge (centred at cx,cy) toward (tx,ty). */
export function edgePoint(
  cx: number,
  cy: number,
  tx: number,
  ty: number,
  boxW: number,
  boxH: number,
) {
  const dx = tx - cx;
  const dy = ty - cy;
  const d = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / d;
  const uy = dy / d;
  const tX = Math.abs(ux) > 1e-6 ? boxW / 2 / Math.abs(ux) : Infinity;
  const tY = Math.abs(uy) > 1e-6 ? boxH / 2 / Math.abs(uy) : Infinity;
  const t = Math.min(tX, tY);
  return { x: cx + ux * t, y: cy + uy * t };
}
