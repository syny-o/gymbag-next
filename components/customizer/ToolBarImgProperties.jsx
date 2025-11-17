"use client";
import { useEffect, useState } from "react";
import {
  LuFlipHorizontal,
  LuFlipVertical,
  LuRotateCw,
  LuLayers,
  LuTrash2,
} from "react-icons/lu";

export default function ToolBarImgProperties({ canvas, object }) {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [angle, setAngle] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  // Pomocná funkce pro aktualizaci rozměrů a stavu z objektu
  const updateFromObject = (obj) => {
    if (!obj) return;
    const w = Math.round(obj.getScaledWidth?.() ?? obj.width ?? 0);
    const h = Math.round(obj.getScaledHeight?.() ?? obj.height ?? 0);
    setWidth(w);
    setHeight(h);
    setAngle(Math.round(obj.angle || 0));
    setOpacity(Math.round((obj.opacity ?? 1) * 100));
    setFlipX(!!obj.flipX);
    setFlipY(!!obj.flipY);
  };

  // Načti hodnoty při mountu / změně objektu
  useEffect(() => {
    if (!object) return;
    updateFromObject(object);
  }, [object]);

  // Sleduj změny na plátně (scale/rotate/modify myší)
  useEffect(() => {
    if (!canvas || !object) return;

    const handleScaling = (e) => {
      if (e?.target === object) updateFromObject(object);
    };

    const handleModified = (e) => {
      if (e?.target === object) updateFromObject(object);
    };

    canvas.on("object:scaling", handleScaling);
    canvas.on("object:modified", handleModified);

    return () => {
      canvas.off("object:scaling", handleScaling);
      canvas.off("object:modified", handleModified);
    };
  }, [canvas, object]);

  const render = () => canvas?.requestRenderAll();

  // --- HANDLERY ---

  const applyWidth = (e) => {
    if (!object) return;
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v) || v <= 0) v = 1;
    setWidth(v);

    const baseW = object.width || object.getScaledWidth?.() || v || 1;
    const newScale = v / baseW;

    // zachovej poměr stran -> scaleX = scaleY
    object.set({
      scaleX: newScale,
      scaleY: newScale,
    });
    object.setCoords();
    updateFromObject(object);
    render();
  };

  const applyHeight = (e) => {
    if (!object) return;
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v) || v <= 0) v = 1;
    setHeight(v);

    const baseH = object.height || object.getScaledHeight?.() || v || 1;
    const newScale = v / baseH;

    object.set({
      scaleX: newScale,
      scaleY: newScale,
    });
    object.setCoords();
    updateFromObject(object);
    render();
  };

  const applyAngle = (e) => {
    if (!object) return;
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v)) v = 0;
    // udrž to v rozumném rozsahu
    if (v > 360) v = v % 360;
    if (v < 0) v = (v % 360) + 360;

    setAngle(v);
    object.rotate(v);
    object.setCoords();
    render();
  };

  const applyOpacity = (e) => {
    if (!object) return;
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v)) v = 100;
    if (v < 0) v = 0;
    if (v > 100) v = 100;
    setOpacity(v);
    object.set({ opacity: v / 100 });
    render();
  };

  const toggleFlipX = () => {
    if (!object) return;
    const next = !flipX;
    setFlipX(next);
    object.set({ flipX: next });
    object.setCoords();
    render();
  };

  const toggleFlipY = () => {
    if (!object) return;
    const next = !flipY;
    setFlipY(next);
    object.set({ flipY: next });
    object.setCoords();
    render();
  };

  const bringToFront = () => {
    if (!canvas || !object) return;
    canvas.bringObjectToFront(object);
    render();
  };

  const sendToBack = () => {
    if (!canvas || !object) return;
    canvas.sendObjectToBack(object);
    render();
  };

  const deleteObject = () => {
    if (!canvas || !object) return;
    canvas.remove(object);
    canvas.discardActiveObject();
    render();
  };

  if (!object) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur p-4 shadow-sm">
      <div className="flex justify-around flex-wrap items-end gap-5">
        {/* Width */}
        <label className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Width</span>
          <input
            className="h-9 w-20 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            type="number"
            min="1"
            value={width}
            onChange={applyWidth}
          />
        </label>

        {/* Height */}
        <label className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Height</span>
          <input
            className="h-9 w-20 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            type="number"
            min="1"
            value={height}
            onChange={applyHeight}
          />
        </label>

        {/* Angle */}
        <label className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Rotate</span>
          <div className="flex items-center gap-1">
            <input
              className="h-9 w-20 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              type="number"
              value={angle}
              onChange={applyAngle}
            />
            <span className="text-xs text-gray-500">°</span>
            <button
              type="button"
              onClick={() => applyAngle({ target: { value: 0 } })}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
              title="Reset angle"
            >
              <LuRotateCw className="text-[18px]" />
            </button>
          </div>
        </label>

        {/* Opacity */}
        <label className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Opacity</span>
          <div className="flex items-center gap-2">
            <input
              className="h-9 w-24"
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={applyOpacity}
            />
            <span className="w-10 text-right text-xs text-gray-600">
              {opacity}%
            </span>
          </div>
        </label>

        {/* Flip + Layers + Delete */}
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs font-medium text-gray-600">Image</span>

          {/* Flip X */}
          <button
            type="button"
            onClick={toggleFlipX}
            className={[
              "inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 shadow-sm transition",
              flipX
                ? "border-black bg-white"
                : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-black/10",
            ].join(" ")}
            title="Flip horizontal"
          >
            <LuFlipHorizontal className="text-[18px]" />
          </button>

          {/* Flip Y */}
          <button
            type="button"
            onClick={toggleFlipY}
            className={[
              "inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 shadow-sm transition",
              flipY
                ? "border-black bg-white"
                : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-black/10",
            ].join(" ")}
            title="Flip vertical"
          >
            <LuFlipVertical className="text-[18px]" />
          </button>

          {/* Bring to front */}
          <button
            type="button"
            onClick={bringToFront}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
            title="Bring to front"
          >
            <LuLayers className="text-[18px]" />
          </button>

          {/* Send to back */}
          <button
            type="button"
            onClick={sendToBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
            title="Send to back"
          >
            <LuLayers className="rotate-180 text-[18px]" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={deleteObject}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-300 bg-white text-red-600 shadow-sm hover:border-red-400 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300/60"
            title="Delete image"
          >
            <LuTrash2 className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
