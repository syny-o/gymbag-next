"use client";
import { useEffect, useState } from "react";

export default function ToolBarImgProperties({ canvas, object }) {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  // Pomocná funkce pro aktualizaci rozměrů
  const updateSize = (obj) => {
    if (!obj) return;
    const w = Math.round(obj.getScaledWidth?.() ?? obj.width ?? 0);
    const h = Math.round(obj.getScaledHeight?.() ?? obj.height ?? 0);
    setWidth(w);
    setHeight(h);
  };

  // Načti velikost při načtení / změně objektu
  useEffect(() => {
    if (!object) return;
    updateSize(object);
  }, [object]);

  // Sleduj události canvasu (scaling, modified)
  useEffect(() => {
    if (!canvas || !object) return;

    const handleScaling = (e) => {
      if (e?.target === object) updateSize(object);
    };

    const handleModified = (e) => {
      if (e?.target === object) updateSize(object);
    };

    canvas.on("object:scaling", handleScaling);
    canvas.on("object:modified", handleModified);

    return () => {
      canvas.off("object:scaling", handleScaling);
      canvas.off("object:modified", handleModified);
    };
  }, [canvas, object]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2">
        <span className="text-sm">Width</span>
        <input
          className="border rounded px-2 py-1 w-24"
          type="text"
          value={width}
          readOnly
        />
      </label>
      <label className="flex items-center gap-2">
        <span className="text-sm">Height</span>
        <input
          className="border rounded px-2 py-1 w-24"
          type="text"
          value={height}
          readOnly
        />
      </label>
    </div>
  );
}
