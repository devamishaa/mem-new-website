// Helper: format numbers consistently (2 decimals) when finite
export function toStr(n) {
  return Number.isFinite(n) ? Number(n.toFixed(2)) : n;
}

// Helper: does the given object have finite x/y?
export function hasFiniteXY(obj) {
  return obj && Number.isFinite(obj.x) && Number.isFinite(obj.y);
}

// Build a path string from points with optional quadratic controls
export function buildSvgPath(points) {
  if (!points || points.length === 0) return "";
  let d = `M${toStr(points[0].x)},${toStr(points[0].y)}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const ctrl = p?.control;
    const isCurve = hasFiniteXY(ctrl);
    if (isCurve) {
      d += ` Q${toStr(ctrl.x)},${toStr(ctrl.y)} ${toStr(p.x)},${toStr(p.y)}`;
    } else {
      d += ` L${toStr(p.x)},${toStr(p.y)}`;
    }
  }
  return d;
}

function initBounds() {
  return { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
}

function includeXY(bounds, x, y) {
  bounds.minX = Math.min(bounds.minX, x);
  bounds.minY = Math.min(bounds.minY, y);
  bounds.maxX = Math.max(bounds.maxX, x);
  bounds.maxY = Math.max(bounds.maxY, y);
}

function normalizeBounds(bounds) {
  const invalid = [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY].some((v) => !Number.isFinite(v));
  if (invalid) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  if (bounds.maxX === bounds.minX) bounds.maxX = bounds.minX + 1;
  if (bounds.maxY === bounds.minY) bounds.maxY = bounds.minY + 1;
  return bounds;
}

export function getPointsBounds(points) {
  if (!points || points.length === 0) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  const b = initBounds();
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (hasFiniteXY(p)) includeXY(b, p.x, p.y);
    if (p && hasFiniteXY(p.control)) includeXY(b, p.control.x, p.control.y);
  }
  return normalizeBounds(b);
}

// Parse a subset of SVG path commands (M/m, L/l, Q/q) into the point structure
// used by the pen tool: [{x, y}, {x, y, control?: {x, y}}, ...]
export function parseSvgPathToPoints(d) {
  if (!d || typeof d !== "string") return [];
  try {
    const segRe = /([MLQmlq])([^MLQmlq]*)/g; // split into command + params
    const points = [];
    let cx = 0;
    let cy = 0;
    for (const m of d.matchAll(segRe)) {
      const cmd = m[1];
      const nums = (m[2] || "")
        .trim()
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((v) => Number(v));
      if (!nums.length) continue;
      let i = 0;
      const abs = cmd === cmd.toUpperCase();
      if (cmd.toUpperCase() === "M") {
        while (i + 1 < nums.length) {
          let x = nums[i++];
          let y = nums[i++];
          if (!abs) {
            x = cx + x;
            y = cy + y;
          }
          cx = x;
          cy = y;
          points.push({ x, y });
        }
      } else if (cmd.toUpperCase() === "L") {
        while (i + 1 < nums.length) {
          let x = nums[i++];
          let y = nums[i++];
          if (!abs) {
            x = cx + x;
            y = cy + y;
          }
          cx = x;
          cy = y;
          points.push({ x, y });
        }
      } else if (cmd.toUpperCase() === "Q") {
        while (i + 3 < nums.length) {
          let cpx = nums[i++];
          let cpy = nums[i++];
          let x = nums[i++];
          let y = nums[i++];
          if (!abs) {
            cpx = cx + cpx;
            cpy = cy + cpy;
            x = cx + x;
            y = cy + y;
          }
          cx = x;
          cy = y;
          points.push({ x, y, control: { x: cpx, y: cpy } });
        }
      }
    }
    // Filter out any NaN values just in case
    return points.filter((p) => hasFiniteXY(p) && (!p.control || hasFiniteXY(p.control)));
  } catch (_) {
    return [];
  }
}
