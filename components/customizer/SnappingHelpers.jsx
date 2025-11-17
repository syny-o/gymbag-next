// components/customizer/SnappingHelpers.jsx
import { Line } from "fabric";

/**
 * Volitelné nastavení:
 *  opts = {
 *    snapDistance?: number,            // default 10 px (logické)
 *    guides?: {
 *      x?: { left?: number, center?: number, right?: number },   // pozice ve "logických" px
 *      y?: { top?: number, center?: number, bottom?: number },
 *    }
 *  }
 *
 * Pokud některou pozici nevyplníš, vezme se default (0 / střed / max).
 */

const getLogicalSize = (canvas) => {
  const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
  const scale = vpt[0] || 1;
  return { logicalW: canvas.getWidth() / scale, logicalH: canvas.getHeight() / scale };
};

// přepočet z origin pozice na levý/horní roh
const getTopLeftFromOrigin = (obj) => {
  const w = obj.getScaledWidth();
  const h = obj.getScaledHeight();

  let ox = 0; // left
  if (obj.originX === "center") ox = 0.5;
  else if (obj.originX === "right") ox = 1;

  let oy = 0; // top
  if (obj.originY === "center") oy = 0.5;
  else if (obj.originY === "bottom") oy = 1;

  const leftTopX = obj.left - w * ox;
  const leftTopY = obj.top - h * oy;

  return { leftTopX, leftTopY, w, h, ox, oy };
};

// pomocný clamp a výběr nejbližší vodicí hodnoty
const nearestGuide = (value, guides, snapDist) => {
  let best = null;
  let bestDelta = Infinity;
  guides.forEach((g) => {
    const d = Math.abs(value - g.val);
    if (d < bestDelta && d <= snapDist) {
      best = g;
      bestDelta = d;
    }
  });
  return best; // {key, val} nebo null
};

export const handleObjectMoving = (canvas, object, guidelinesRef, opts = {}) => {
  if (!canvas || !object) return;

  const snapDist = typeof opts.snapDistance === "number" ? opts.snapDistance : 10;

  const { logicalW, logicalH } = getLogicalSize(canvas);
  const guidesX = {
    left:   opts.guides?.x?.left   ?? 0,
    center: opts.guides?.x?.center ?? logicalW / 2,
    right:  opts.guides?.x?.right  ?? logicalW,
  };
  const guidesY = {
    top:    opts.guides?.y?.top    ?? 0,
    center: opts.guides?.y?.center ?? logicalH / 2,
    bottom: opts.guides?.y?.bottom ?? logicalH,
  };

  // pozice objektu jako kdyby origin byl left/top
  const { leftTopX, leftTopY, w, h } = getTopLeftFromOrigin(object);

  const left   = leftTopX;
  const top    = leftTopY;
  const right  = left + w;
  const bottom = top + h;
  const centerX = left + w / 2;
  const centerY = top + h / 2;

  clearGuidelines(canvas, guidelinesRef);
  let snapped = false;

  // --- X SNAP ---
  // zkoušíme snapovat na left/center/right – každému předáme relevantní hodnotu
  const xCandidates = [
    { key: "left",   val: guidesX.left,   type: "left",   current: left },
    { key: "center", val: guidesX.center, type: "centerX", current: centerX },
    { key: "right",  val: guidesX.right,  type: "right",  current: right },
  ];
  const nearX = nearestGuide(
    xCandidates.reduce((bestVal, c) => (Math.abs(c.current - c.val) < Math.abs(bestVal - c.val) ? c.current : bestVal), left),
    xCandidates,
    snapDist
  );
  // lepší a čitelnější: projdi všechny a najdi nejbližší ručně
  let bestX = null;
  let bestXDelta = Infinity;
  xCandidates.forEach((c) => {
    const d = Math.abs(c.current - c.val);
    if (d < bestXDelta && d <= snapDist) {
      bestX = c;
      bestXDelta = d;
    }
  });

  if (bestX) {
    const ox = object.originX === "center" ? 0.5 : object.originX === "right" ? 1 : 0;
    if (bestX.type === "left") {
      object.set({ left: guidesX.left + w * ox });
      guidelinesRef.current.push(createVerticalGuideline(canvas, guidesX.left));
    } else if (bestX.type === "centerX") {
      object.set({ left: guidesX.center + w * (ox - 0.5) });
      guidelinesRef.current.push(createVerticalGuideline(canvas, guidesX.center));
    } else if (bestX.type === "right") {
      object.set({ left: guidesX.right - w * (1 - ox) });
      guidelinesRef.current.push(createVerticalGuideline(canvas, guidesX.right));
    }
    snapped = true;
  }

  // --- Y SNAP ---
  const yCandidates = [
    { key: "top",    val: guidesY.top,    type: "top",     current: top },
    { key: "center", val: guidesY.center, type: "centerY", current: centerY },
    { key: "bottom", val: guidesY.bottom, type: "bottom",  current: bottom },
  ];
  let bestY = null;
  let bestYDelta = Infinity;
  yCandidates.forEach((c) => {
    const d = Math.abs(c.current - c.val);
    if (d < bestYDelta && d <= snapDist) {
      bestY = c;
      bestYDelta = d;
    }
  });

  if (bestY) {
    const oy = object.originY === "center" ? 0.5 : object.originY === "bottom" ? 1 : 0;
    if (bestY.type === "top") {
      object.set({ top: guidesY.top + h * oy });
      guidelinesRef.current.push(createHorizontalGuideline(canvas, guidesY.top));
    } else if (bestY.type === "centerY") {
      object.set({ top: guidesY.center + h * (oy - 0.5) });
      guidelinesRef.current.push(createHorizontalGuideline(canvas, guidesY.center));
    } else if (bestY.type === "bottom") {
      object.set({ top: guidesY.bottom - h * (1 - oy) });
      guidelinesRef.current.push(createHorizontalGuideline(canvas, guidesY.bottom));
    }
    snapped = true;
  }

  if (snapped) {
    object.setCoords();
    guidelinesRef.current.forEach((l) => canvas.add(l));
  }

  canvas.requestRenderAll();
};

export const createVerticalGuideline = (canvas, x) => {
  const { logicalH } = getLogicalSize(canvas);
  return new Line([x, 0, x, logicalH], {
    stroke: "blue",
    strokeWidth: 2,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.9,
  });
};

export const createHorizontalGuideline = (canvas, y) => {
  const { logicalW } = getLogicalSize(canvas);
  return new Line([0, y, logicalW, y], {
    stroke: "blue",
    strokeWidth: 2,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.9,
  });
};

export const clearGuidelines = (canvas, guidelinesRef) => {
  if (!canvas || !guidelinesRef?.current) return;
  guidelinesRef.current.forEach((line) => canvas.remove(line));
  guidelinesRef.current = [];
};
