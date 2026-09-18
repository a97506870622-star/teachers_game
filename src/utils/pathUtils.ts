import { Point } from '../types';

export interface PathSegment {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  length: number;
  accumLength: number; // accumulated distance up to the end of this segment
}

/**
 * Converts grid points to pixel coordinates and computes segments
 */
export function getPathSegments(path: Point[], cellSize: number): PathSegment[] {
  const segments: PathSegment[] = [];
  let accum = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const startX = path[i].x * cellSize + cellSize / 2;
    const startY = path[i].y * cellSize + cellSize / 2;
    const endX = path[i + 1].x * cellSize + cellSize / 2;
    const endY = path[i + 1].y * cellSize + cellSize / 2;
    const length = Math.hypot(endX - startX, endY - startY);
    accum += length;

    segments.push({
      startX,
      startY,
      endX,
      endY,
      length,
      accumLength: accum
    });
  }

  return segments;
}

/**
 * Returns total path length in pixels
 */
export function getTotalPathLength(path: Point[], cellSize: number): number {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const dx = (path[i + 1].x - path[i].x) * cellSize;
    const dy = (path[i + 1].y - path[i].y) * cellSize;
    total += Math.hypot(dx, dy);
  }
  return Math.max(total, 1);
}

/**
 * Returns the exact position {x, y, angle} at a given distance from path start
 */
export function getPositionAlongPath(
  path: Point[],
  cellSize: number,
  distance: number
): { x: number; y: number; angle: number } {
  if (path.length === 0) return { x: 0, y: 0, angle: 0 };
  if (path.length === 1) {
    return {
      x: path[0].x * cellSize + cellSize / 2,
      y: path[0].y * cellSize + cellSize / 2,
      angle: 0
    };
  }

  const segments = getPathSegments(path, cellSize);
  const totalLength = segments[segments.length - 1]?.accumLength || 1;
  const clampedDist = Math.max(0, Math.min(totalLength, distance));

  let prevAccum = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (clampedDist <= seg.accumLength || i === segments.length - 1) {
      const segDist = clampedDist - prevAccum;
      const ratio = seg.length > 0 ? segDist / seg.length : 0;
      const x = seg.startX + (seg.endX - seg.startX) * ratio;
      const y = seg.startY + (seg.endY - seg.startY) * ratio;
      const angle = Math.atan2(seg.endY - seg.startY, seg.endX - seg.startX);
      return { x, y, angle };
    }
    prevAccum = seg.accumLength;
  }

  const last = segments[segments.length - 1];
  return {
    x: last.endX,
    y: last.endY,
    angle: Math.atan2(last.endY - last.startY, last.endX - last.startX)
  };
}
