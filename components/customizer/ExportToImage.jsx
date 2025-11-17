"use client";
import React from "react";

/**
 * ExportToImage
 * - Export obou pláten s dočasným přepnutím pohledu
 *
 * Props:
 *  - getCanvas: (view: "front" | "side") => Fabric.Canvas | null
 *  - currentView: "front" | "side"
 *  - switchView: (view: "front" | "side") => Promise<void> | void
 *  - filenameBase?: string
 *  - multiplier?: number
 *  - includeBackground?: boolean
 */
export default function ExportToImage({
  getCanvas,
  currentView,
  switchView,
  filenameBase = "bag",
  multiplier = 2,
  includeBackground = true,
}) {
  const downloadDataURL = (dataURL, filename) => {
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const waitFrame = () =>
    new Promise((r) => requestAnimationFrame(() => r()));

  // Počkej, až plátno existuje, má rozměry a je vykreslené
  const waitUntilReady = async (view, timeoutMs = 1500) => {
    const start = performance.now();
    // počkáme pár snímků, aby se stihl mount/render po přepnutí
    for (;;) {
      const c = getCanvas?.(view);
      if (c && c.getWidth() > 0 && c.getHeight() > 0) {
        // ještě 1–2 snímky na jistotu, že proběhla async práce (background atd.)
        await waitFrame();
        await waitFrame();
        return c;
      }
      if (performance.now() - start > timeoutMs) return c || null;
      await waitFrame();
    }
  };

  const exportCanvas = (canvas, filename) => {
    if (!canvas) return;

    // skryj výběr
    canvas.discardActiveObject();

    // dočasně vypni zoom (export v logickém prostoru)
    const prevVpt = canvas.viewportTransform
      ? [...canvas.viewportTransform]
      : [1, 0, 0, 1, 0, 0];
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    // případně dočasně vypni background
    const prevBg = canvas.backgroundImage;
    if (!includeBackground) {
      canvas.backgroundImage = null;
    }

    canvas.requestRenderAll();

    const dataURL = canvas.toDataURL({
      format: "png",
      multiplier,
      enableRetinaScaling: false,
      quality: 1,
      withoutTransform: true,
    });

    // vrať zpět
    if (!includeBackground) {
      canvas.backgroundImage = prevBg;
    }
    canvas.setViewportTransform(prevVpt);
    canvas.requestRenderAll();

    downloadDataURL(dataURL, filename);
  };

  const exportOneView = async (view, suffix) => {
    if (currentView !== view) {
      await Promise.resolve(switchView?.(view));
    }
    const canvas = await waitUntilReady(view);
    exportCanvas(canvas, `${filenameBase}_${suffix}.png`);
  };

  const handleExport = async () => {
    const original = currentView;

    // pořadí je na tobě – tady exportujeme current -> druhý
    await exportOneView("front", "front");
    await exportOneView("side", "side");

    // vrať zpět původní pohled
    if (currentView !== original) {
      await Promise.resolve(switchView?.(original));
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
    >
      Export PNGs
    </button>
  );
}
