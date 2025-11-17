"use client";
import { useEffect } from "react";

/**
 * BoundaryGuard
 * - hlídá, aby objekty na canvasu nezajely mimo zadané hranice (v LOGICKÝCH souřadnicích)
 * - bounds můžeš nastavit částečně (např. jen xMin), ostatní zůstanou neomezené
 *
 * props:
 *  - canvas: Fabric.Canvas instance (aktivní)
 *  - bounds: { xMin?: number, yMin?: number, xMax?: number, yMax?: number }
 */
export default function BoundaryGuard({ canvas, bounds }) {
  useEffect(() => {
    if (!canvas) return;

    // Pomocné: vrátí scale (zoom) a logické rozměry
    const getLogicalSize = () => {
      const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
      const scale = vpt[0] || 1;
      return {
        scale,
        logicalW: canvas.getWidth() / scale,
        logicalH: canvas.getHeight() / scale,
      };
    };

    // Přepočet z originu na levý-horní roh + scaled w/h
    const getTopLeftFromOrigin = (obj) => {
      const w = obj.getScaledWidth();
      const h = obj.getScaledHeight();

      let ox = 0; // 0=left, 0.5=center, 1=right
      if (obj.originX === "center") ox = 0.5;
      else if (obj.originX === "right") ox = 1;

      let oy = 0; // 0=top, 0.5=center, 1=bottom
      if (obj.originY === "center") oy = 0.5;
      else if (obj.originY === "bottom") oy = 1;

      return {
        leftTopX: obj.left - w * ox,
        leftTopY: obj.top - h * oy,
        w,
        h,
        ox,
        oy,
      };
    };

    // Nastaví pozici objektu podle požadovaného levého-horního rohu
    const setFromTopLeft = (obj, leftTopX, leftTopY, ox, oy, w, h) => {
      const left = leftTopX + w * ox;
      const top  = leftTopY + h * oy;
      obj.set({ left, top });
      obj.setCoords();
    };

    const clampVal = (val, min, max) => {
      if (typeof min === "number" && val < min) return min;
      if (typeof max === "number" && val > max) return max;
      return val;
    };

    const clampObjectToBounds = (obj) => {
      const { logicalW, logicalH } = getLogicalSize();

      const bx = {
        xMin: bounds?.xMin ?? 0,
        yMin: bounds?.yMin ?? 0,
        xMax: bounds?.xMax ?? logicalW,
        yMax: bounds?.yMax ?? logicalH,
      };

      const { leftTopX, leftTopY, w, h, ox, oy } = getTopLeftFromOrigin(obj);

      // spočti nový (clampnutý) levý-horní roh
      const nx = clampVal(leftTopX, bx.xMin, typeof bx.xMax === "number" ? bx.xMax - w : undefined);
      const ny = clampVal(leftTopY, bx.yMin, typeof bx.yMax === "number" ? bx.yMax - h : undefined);

      // když se změnilo, vrať objekt zpět na hranu
      if (nx !== leftTopX || ny !== leftTopY) {
        setFromTopLeft(obj, nx, ny, ox, oy, w, h);
        canvas.requestRenderAll();
      }
    };

    // Při tahání – drž uvnitř
    const onMoving = (e) => {
      const target = e?.target;
      if (!target) return;

      // Podpora multi-selektu: Fabric reprezentuje výběr jako "activeSelection"
      if (target.type === "activeSelection") {
        clampObjectToBounds(target);
        return;
      }

      clampObjectToBounds(target);
    };

    // Po puštění myši ještě jednou dorovnej (pro jistotu)
    const onMouseUp = () => {
      const active = canvas.getActiveObject?.();
      if (active) clampObjectToBounds(active);
    };

    canvas.on("object:moving", onMoving);
    canvas.on("mouse:up", onMouseUp);

    return () => {
      canvas.off("object:moving", onMoving);
      canvas.off("mouse:up", onMouseUp);
    };
  }, [canvas, bounds]);

  return null; // tato komponenta nic nezobrazuje, jen hlídá hranice
}
