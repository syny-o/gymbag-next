"use client";
import { useEffect, useRef } from "react";
import { handleObjectMoving, clearGuidelines } from "./SnappingHelpers";

/**
 * Jedno plátno s:
 * - Fabric.js 6
 * - responsivním zoomem (celé plátno se mění jako celek)
 * - background "cover"
 * - načtením uloženého JSONu
 * - snappingem k okrajům a středům
 */
export default function ResponsiveBagCanvas({
  imgSrc,
  baseW = 800,
  baseH = 640,
  initialJSON,
  onReady,
  visible = true,
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasInst = useRef(null);
  const resizeHandler = useRef(null);
  // Vytvoříme ref pro aktuální guidelines:
  const guidelinesRef = useRef([]);

  // aplikuj responsivní zoom na základě wrapperu
  const applyResponsiveZoom = () => {
    if (!wrapRef.current || !canvasInst.current) return;
    const w = wrapRef.current.clientWidth || baseW;
    const scale = w / baseW;
    const h = Math.round(baseH * scale);
    canvasInst.current.setDimensions({ width: w, height: h });
    canvasInst.current.setViewportTransform([scale, 0, 0, scale, 0, 0]);
    canvasInst.current.requestRenderAll();
  };

  // nastav background "cover" v logickém prostoru (baseW × baseH)
  const setBackgroundCoverAtBase = async (fabric, canvas) => {
    const img = await fabric.Image.fromURL(imgSrc);
    const scale = Math.max(baseW / img.width, baseH / img.height);
    img.set({
      originX: "center",
      originY: "center",
      left: baseW / 2,
      top: baseH / 2,
      scaleX: scale,
      scaleY: scale,
      selectable: false,
      evented: false,
    });
    canvas.backgroundImage = img;
    canvas.requestRenderAll();
  };

  useEffect(() => {
    let mounted = true;

    const cleanup = () => {
      if (resizeHandler.current) {
        window.removeEventListener("resize", resizeHandler.current);
        resizeHandler.current = null;
      }
      if (canvasInst.current) {
        canvasInst.current.dispose();
        canvasInst.current = null;
      }
    };

    import("fabric").then(async (mod) => {
      if (!mounted) return;
      const fabric = mod.fabric ?? mod;

      cleanup();

      // --- vytvoř plátno ---
      const inst = new fabric.Canvas(canvasRef.current, {
        width: baseW,
        height: baseH,
        selection: true,
      });
      canvasInst.current = inst;

      // --- background ---
      await setBackgroundCoverAtBase(fabric, inst);

      // --- případné obnovení JSONu ---
      if (initialJSON) {
        await inst.loadFromJSON(initialJSON);
        inst.requestRenderAll();
      }

      // --- aplikuj zoom ---
      applyResponsiveZoom();

      // --- SNAP logika ---
      inst.on("object:moving", (e) => {
        handleObjectMoving(inst, e.target, guidelinesRef, {
          snapDistance: 12, // volitelné, default 10
          guides: {
            // příklad pro "SIDE" – taška je výš a mírně vpravo
            x: { left: 40, center: 400, right: 800 },
            y: { top: 30, center: 450, bottom: 620 },
          },
        });
      });

      // po skončení pohybu vyčisti čáry
      inst.on("mouse:up", () => clearGuidelines(inst, guidelinesRef));

      // --- resize listener ---
      resizeHandler.current = () => applyResponsiveZoom();
      window.addEventListener("resize", resizeHandler.current);

      // předání rodiči
      onReady?.(inst, fabric);
    });

    return () => {
      mounted = false;
      cleanup();
    };
  }, [imgSrc, initialJSON, baseW, baseH]);

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={`
    absolute inset-0 transform transition-all duration-200 opacity-100 ease-in-out
    ${
      visible
        ? "scale-100 pointer-events-auto z-1 left-0"
        : "scale-20  pointer-events-none z-2 left-100"
    }
  `}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
