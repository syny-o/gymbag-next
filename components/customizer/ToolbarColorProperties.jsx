"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Props:
 *  - frontCanvas: Fabric.Canvas
 *  - sideCanvas:  Fabric.Canvas
 *  - view: "front" | "side"
 *  - basePath?: string
 *  - ext?: string
 *  - colors: { strap: string, fabric: string }   // 👈 controlled
 *  - onChangeColors: (partial: {strap?: string, fabric?: string}) => void
 *  - tick?: number                                // re-run efektů po onReady
 */
export default function ToolbarColorProperties({
  frontCanvas,
  sideCanvas,
  view,
  basePath = "/bag",
  ext = "png",
  colors,
  onChangeColors,
  tick = 0,
}) {
  const { strap, fabric } = colors ?? { strap: "black", fabric: "green" };

  const [fabricRef, setFabricRef] = useState(null);
  const loadTokenRef = useRef({ front: 0, side: 0 });

  const strapOptions = ["black", "white"];
  const fabricOptions = ["black", "blue", "green", "grey", "ping", "red", "white"];

  const colorBg = {
    black: "bg-black",
    blue: "bg-blue-600",
    green: "bg-green-600",
    grey: "bg-neutral-500",
    ping: "bg-pink-500",
    red: "bg-red-600",
    white: "bg-white",
  };

  // načti fabric jednou
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import("fabric");
      if (!cancelled) setFabricRef(mod.fabric ?? mod);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filenameFor = (v, s, f) => `${basePath}_${v}_${s}_${f}.${ext}`;
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

  const ensureCanvasSized = async (canvas, timeoutMs = 800) => {
    if (!canvas) return false;
    const start = performance.now();
    while (true) {
      if (canvas.getWidth() > 0 && canvas.getHeight() > 0) return true;
      if (performance.now() - start > timeoutMs) return false;
      await nextFrame();
    }
  };

  const applyBackground = async (canvas, viewName, s, f, key /* 'front'|'side' */) => {
    if (!canvas || !fabricRef) return;

    const ready = await ensureCanvasSized(canvas);
    if (!ready) return;

    const myToken = ++loadTokenRef.current[key];

    // logické rozměry (nezávislé na CSS scale)
    const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
    const scale = vpt[0] || 1;
    const logicalW = canvas.getWidth() / scale;
    const logicalH = canvas.getHeight() / scale;

    const src = filenameFor(viewName, s, f);

    try {
      const img = await fabricRef.Image.fromURL(src);
      if (myToken !== loadTokenRef.current[key]) return; // závod – přišla novější změna

      const cover = Math.max(logicalW / img.width, logicalH / img.height);
      img.set({
        originX: "center",
        originY: "center",
        left: logicalW / 2,
        top: logicalH / 2,
        scaleX: cover,
        scaleY: cover,
        selectable: false,
        evented: false,
      });

      canvas.backgroundImage = img;
      canvas.renderAll();
      await nextFrame();
      canvas.renderAll();
    } catch (e) {
      console.warn("Background load failed:", src, e);
    }
  };

  // ► Aplikuj na OBOJE plátna při změně barev, view, ticku nebo referencí
  useEffect(() => {
    if (!fabricRef) return;
    applyBackground(frontCanvas, "front", strap, fabric, "front");
    applyBackground(sideCanvas, "side", strap, fabric, "side");
  }, [fabricRef, frontCanvas, sideCanvas, strap, fabric, view, tick]);

  if (!frontCanvas && !sideCanvas) return null;

  return (
    <div className="md:absolute z-5 right-0 top-34 p-5 shadow-lg flex flex-col md:flex-row gap-3 border-2 rounded-lg border-gray-200 bg-gray-100">
      {/* Popruh */}
      <div className="flex md:flex-col items-center gap-2 flex-wrap">
        <span className="text-sm mr-2">Popruh</span>
        {strapOptions.map((s) => (
          <button
            key={s}
            onClick={() => onChangeColors?.({ strap: s })}
            className={[
              "h-10 w-10 md:h-15 md:w-15 rounded-md border-2 transition-colors cursor-pointer",
              colorBg[s],
              strap === s ? "border-black" : "border-transparent hover:border-neutral-300",
            ].join(" ")}
            aria-label={s}
          />
        ))}
      </div>

      {/* Látka */}
      <div className="flex md:flex-col items-center gap-2 flex-wrap">
        <span className="text-sm mr-1">Taška</span>
        {fabricOptions.map((f) => (
          <button
            key={f}
            onClick={() => onChangeColors?.({ fabric: f })}
            className={[
              "h-10 w-10 md:h-15 md:w-15 rounded-md border-2 transition-colors cursor-pointer",
              colorBg[f],
              fabric === f ? "border-black" : "border-transparent hover:border-neutral-300",
            ].join(" ")}
            aria-label={f}
          />
        ))}
      </div>
    </div>
  );
}
