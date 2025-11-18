"use client";
import { useEffect, useState } from "react";
import ToolBarTextProperties from "./ToolBarTextProperties";
import ToolBarImgProperties from "./ToolBarImgProperties";

export default function ToolbarProperties({ canvas }) {
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    if (!canvas) {
      setSelectedObject(null);
      return;
    }

    const updateSel = () => {
      const obj = canvas.getActiveObject?.() || null;
      setSelectedObject(obj);
    };

    canvas.on("selection:created", updateSel);
    canvas.on("selection:updated", updateSel);
    canvas.on("selection:cleared", updateSel);
    canvas.on("object:modified", updateSel);

    // první načtení
    const id = requestAnimationFrame(updateSel);

    return () => {
      cancelAnimationFrame(id);
      canvas.off("selection:created", updateSel);
      canvas.off("selection:updated", updateSel);
      canvas.off("selection:cleared", updateSel);
      canvas.off("object:modified", updateSel);
    };
  }, [canvas]);

  if (!selectedObject) return null;

  return (
    <div className="w-full md:max-w-[600px] mx-auto pb-3 rounded-lg md:absolute top-35 z-50">
      <div className="text-sm text-neutral-600 mb-3">
        {/* Selected: {selectedObject.type} */}
      </div>

      {selectedObject.type === "textbox" ? (
        <ToolBarTextProperties canvas={canvas} object={selectedObject} />
      ) : (
        <ToolBarImgProperties canvas={canvas} object={selectedObject} />
      )}
    </div>
  );
}
