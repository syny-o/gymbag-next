"use client";
import { useEffect, useState } from "react";
import {
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuRotateCw,
  LuTrash2,
} from "react-icons/lu";

const FONT_OPTIONS = [
  "Arial",
  "Helvetica",
  "Inter",
  "Roboto",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "monospace",
];

export default function ToolBarTextProperties({ canvas, object }) {
  const [textValue, setTextValue] = useState("");
  const [fontSize, setFontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textAlign, setTextAlign] = useState("left");
  const [angle, setAngle] = useState(0);

  const [letterSpacing, setLetterSpacing] = useState(0); // charSpacing
  const [lineHeight, setLineHeight] = useState(1.2);

  const [fillColor, setFillColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("");

  const [outlineEnabled, setOutlineEnabled] = useState(false);
  const [outlineColor, setOutlineColor] = useState("#000000");
  const [outlineWidth, setOutlineWidth] = useState(0);

  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(0);

  // načtení hodnot z objectu při výběru / změně
  useEffect(() => {
    if (!object) return;

    setTextValue(object.text || "");
    setFontSize(Math.round(object.fontSize || 40));
    setFontFamily(object.fontFamily || "Arial");
    setTextAlign(object.textAlign || "left");
    setAngle(Math.round(object.angle || 0));
    setLetterSpacing(object.charSpacing ?? 0);
    setLineHeight(object.lineHeight ?? 1.2);
    setFillColor(object.fill || "#000000");
    setBackgroundColor(object.backgroundColor || "");

    const strokeWidth = object.strokeWidth ?? 0;
    setOutlineWidth(strokeWidth);
    setOutlineEnabled(strokeWidth > 0);
    setOutlineColor(object.stroke || "#000000");

    const sh = object.shadow;
    if (sh) {
      setShadowEnabled(true);
      setShadowColor(sh.color || "#000000");
      setShadowBlur(sh.blur ?? 0);
      setShadowOffsetX(sh.offsetX ?? 0);
      setShadowOffsetY(sh.offsetY ?? 0);
    } else {
      setShadowEnabled(false);
      setShadowBlur(0);
      setShadowOffsetX(0);
      setShadowOffsetY(0);
    }
  }, [object]);

  // reakce na změny při editaci přímo na plátně (double-click)
  useEffect(() => {
    if (!object || object.type !== "textbox") return;

    const onChanged = () => {
      const current = object.text || "";
      setTextValue((prev) => (prev !== current ? current : prev));
    };

    const onEditExit = () => {
      const current = object.text || "";
      setTextValue(current);
    };

    object.on("changed", onChanged);
    object.on("editing:exited", onEditExit);

    return () => {
      object.off("changed", onChanged);
      object.off("editing:exited", onEditExit);
    };
  }, [object]);

  // sync při rotaci / resize myší
  useEffect(() => {
    if (!canvas || !object) return;

    const onModified = (e) => {
      if (e?.target === object) {
        setAngle(Math.round(object.angle || 0));
        setFontSize(object.fontSize || 40);
        setTextAlign(object.textAlign || "left");
      }
    };

    canvas.on("object:modified", onModified);
    return () => {
      canvas.off("object:modified", onModified);
    };
  }, [canvas, object]);

  const render = () => canvas?.requestRenderAll();

  // --- HANDLERY ---

  const changeText = (e) => {
    if (!object) return;

    const v = e.target.value;
    setTextValue(v);

    // Fabric v6 vyžaduje set() + recalculation
    object.set("text", v);
    object.initDimensions(); // 🔥 přepočítá velikost textboxu
    object.setCoords();
    render();
  };

  const changeFontSize = (e) => {
    if (!object) return;
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v)) return;
    if (v <= 0) v = 1;

    setFontSize(v);
    object.set({ fontSize: v });
    object.setCoords();
    render();
  };

  const changeFontFamily = (e) => {
    if (!object) return;
    const v = e.target.value;
    setFontFamily(v);
    object.set({ fontFamily: v });
    object.setCoords();
    render();
  };

  const toggle = (prop, trueValue, falseValue) => {
    if (!object) return;
    const next = object[prop] === trueValue ? falseValue : trueValue;
    object.set({ [prop]: next });
    object.setCoords();
    render();
  };

  const toggleBold = () => toggle("fontWeight", "bold", "normal");
  const toggleItalic = () => toggle("fontStyle", "italic", "normal");
  const toggleStrike = () => toggle("linethrough", true, false);

  const setAlign = (align) => {
    if (!object) return;
    setTextAlign(align);
    object.set({ textAlign: align });
    object.setCoords();
    render();
  };

  const applyAngle = (e) => {
    if (!object) return;
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v)) v = 0;
    if (v > 360) v = v % 360;
    if (v < 0) v = (v % 360) + 360;

    setAngle(v);
    object.rotate(v);
    object.setCoords();
    render();
  };

  const resetAngle = () => {
    if (!object) return;
    setAngle(0);
    object.rotate(0);
    object.setCoords();
    render();
  };

  const deleteText = () => {
    if (!canvas || !object) return;
    canvas.remove(object);
    canvas.discardActiveObject();
    render();
  };

  const changeFillColor = (e) => {
    if (!object) return;
    const v = e.target.value;
    setFillColor(v);
    object.set({ fill: v });
    render();
  };

  const changeLetterSpacing = (e) => {
    if (!object) return;
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v)) v = 0;
    setLetterSpacing(v);
    object.set({ charSpacing: v });
    object.setCoords();
    render();
  };

  const changeLineHeight = (e) => {
    if (!object) return;
    let v = parseFloat(e.target.value);
    if (Number.isNaN(v)) v = 1;
    if (v < 0.5) v = 0.5;
    if (v > 3) v = 3;
    setLineHeight(v);
    object.set({ lineHeight: v });
    object.setCoords();
    render();
  };

  const changeBackgroundColor = (e) => {
    if (!object) return;
    const v = e.target.value;
    setBackgroundColor(v);
    object.set({ backgroundColor: v || undefined });
    object.setCoords();
    render();
  };

  const toggleOutline = () => {
    if (!object) return;
    const next = !outlineEnabled;
    setOutlineEnabled(next);

    if (next) {
      const width = outlineWidth || 1;
      const color = outlineColor || "#000000";
      setOutlineWidth(width);
      object.set({ stroke: color, strokeWidth: width });
    } else {
      object.set({ strokeWidth: 0 });
    }
    object.setCoords();
    render();
  };

  const changeOutlineColor = (e) => {
    if (!object) return;
    const v = e.target.value;
    setOutlineColor(v);
    if (outlineEnabled || (object.strokeWidth ?? 0) > 0) {
      object.set({ stroke: v });
      object.setCoords();
      render();
    }
  };

  const changeOutlineWidth = (e) => {
    if (!object) return;
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v) || v < 0) v = 0;
    setOutlineWidth(v);
    if (v === 0) {
      setOutlineEnabled(false);
      object.set({ strokeWidth: 0 });
    } else {
      setOutlineEnabled(true);
      object.set({ strokeWidth: v, stroke: outlineColor || "#000000" });
    }
    object.setCoords();
    render();
  };

  const toggleShadow = () => {
    if (!object) return;
    const next = !shadowEnabled;
    setShadowEnabled(next);

    if (next) {
      const sh = {
        color: shadowColor || "rgba(0,0,0,0.4)",
        blur: shadowBlur || 8,
        offsetX: shadowOffsetX ?? 2,
        offsetY: shadowOffsetY ?? 2,
      };
      object.set({ shadow: sh });
    } else {
      object.set({ shadow: null });
    }
    object.setCoords();
    render();
  };

  const applyShadowColor = (e) => {
    if (!object) return;
    const v = e.target.value;
    setShadowColor(v);
    if (!shadowEnabled) return;
    const sh = object.shadow || {};
    object.set({
      shadow: {
        ...sh,
        color: v,
      },
    });
    object.setCoords();
    render();
  };

  const applyShadowNumber = (field) => (e) => {
    if (!object) return;
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v)) v = 0;

    const sh = object.shadow || {
      color: shadowColor || "rgba(0,0,0,0.4)",
      blur: shadowBlur,
      offsetX: shadowOffsetX,
      offsetY: shadowOffsetY,
    };

    if (field === "blur") {
      setShadowBlur(v);
      sh.blur = v;
    } else if (field === "offsetX") {
      setShadowOffsetX(v);
      sh.offsetX = v;
    } else if (field === "offsetY") {
      setShadowOffsetY(v);
      sh.offsetY = v;
    }

    if (shadowEnabled) {
      object.set({ shadow: sh });
      object.setCoords();
      render();
    }
  };

  if (!object) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur p-4 shadow-sm space-y-4">
      {/* TEXT AREA */}
      <textarea
        className="w-full min-h-[80px] rounded-md border border-gray-300 p-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
        value={textValue}
        onChange={changeText}
      />

      {/* ZÁKLADNÍ ŘÁDEK: font size + family + color */}
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col text-xs font-medium text-gray-600">
          Font size
          <input
            className="h-9 w-14 rounded-md border border-gray-300 px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            type="number"
            value={fontSize}
            onChange={changeFontSize}
            min={1}
          />
        </label>

        <label className="flex flex-col text-xs font-medium text-gray-600">
          Font
          <select
            className="h-9 w-46 rounded-md border border-gray-300 px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            value={fontFamily}
            onChange={changeFontFamily}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-xs font-medium text-gray-600">
          Color
          <input
            type="color"
            className="h-9 w-12 rounded-md border border-gray-300 p-1 shadow-sm"
            value={fillColor}
            onChange={changeFillColor}
          />
        </label>

        <label className="flex flex-col text-xs font-medium text-gray-600">
          Letter spacing
          <input
            className="h-9 w-14 rounded-md border border-gray-300 px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            type="number"
            value={letterSpacing}
            onChange={changeLetterSpacing}
          />
        </label>

        <label className="flex flex-col text-xs font-medium text-gray-600">
          Line height
          <input
            className="h-9 w-14 rounded-md border border-gray-300 px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            type="number"
            step="0.1"
            min="0.5"
            max="3"
            value={lineHeight}
            onChange={changeLineHeight}
          />
        </label>        
      </div>

      {/* STYL + ALIGN + ROTATE + DELETE */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        {/* Styl */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleBold}
            className={`h-9 w-9 flex items-center justify-center rounded-md border shadow-sm ${
              object.fontWeight === "bold"
                ? "border-black bg-white"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
            title="Bold"
          >
            <LuBold />
          </button>
          <button
            onClick={toggleItalic}
            className={`h-9 w-9 flex items-center justify-center rounded-md border shadow-sm ${
              object.fontStyle === "italic"
                ? "border-black bg-white"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
            title="Italic"
          >
            <LuItalic />
          </button>
          <button
            onClick={toggleStrike}
            className={`h-9 w-9 flex items-center justify-center rounded-md border shadow-sm ${
              object.linethrough
                ? "border-black bg-white"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
            title="Strikethrough"
          >
            <LuStrikethrough />
          </button>
        </div>

        {/* Align */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAlign("left")}
            className={`h-9 w-9 flex items-center justify-center rounded-md border shadow-sm ${
              textAlign === "left"
                ? "border-black bg-white"
                : "border-gray-300 hover:border-gray-400"
            }`}
            title="Align left"
          >
            <LuAlignLeft />
          </button>
          <button
            onClick={() => setAlign("center")}
            className={`h-9 w-9 flex items-center justify-center rounded-md border shadow-sm ${
              textAlign === "center"
                ? "border-black bg-white"
                : "border-gray-300 hover:border-gray-400"
            }`}
            title="Align center"
          >
            <LuAlignCenter />
          </button>
          <button
            onClick={() => setAlign("right")}
            className={`h-9 w-9 flex items-center justify-center rounded-md border shadow-sm ${
              textAlign === "right"
                ? "border-black bg-white"
                : "border-gray-300 hover:border-gray-400"
            }`}
            title="Align right"
          >
            <LuAlignRight />
          </button>
        </div>

        {/* Rotate */}
        <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
          <span>Rotate</span>
          <div className="flex items-center gap-1">
            <input
              className="h-9 w-20 rounded-md border border-gray-300 px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              type="number"
              value={angle}
              onChange={applyAngle}
            />
            <span className="text-xs text-gray-500">°</span>
            <button
              type="button"
              onClick={resetAngle}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-gray-400 hover:bg-gray-50"
              title="Reset angle"
            >
              <LuRotateCw className="text-[18px]" />
            </button>
          </div>
        </label>

        {/* Delete */}
        <button
          type="button"
          onClick={deleteText}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-300 bg-white text-red-600 shadow-sm hover:border-red-400 hover:bg-red-50"
          title="Delete text"
        >
          <LuTrash2 className="text-[18px]" />
        </button>
      </div>

      {/* ADVANCED: spacing + background */}
      <div className="flex flex-wrap items-end gap-4">

{/* 
        <label className="flex flex-col text-xs font-medium text-gray-600">
          Background
          <input
            type="color"
            className="h-9 w-12 rounded-md border border-gray-300 p-1 shadow-sm"
            value={backgroundColor || "#ffffff"}
            onChange={changeBackgroundColor}
          />
        </label> */}
      </div>

      {/* OUTLINE */}
      {/* <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-2">
          <input
            id="outline-toggle"
            type="checkbox"
            checked={outlineEnabled}
            onChange={toggleOutline}
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/30"
          />
          <label
            htmlFor="outline-toggle"
            className="text-xs font-medium text-gray-700"
          >
            Outline
          </label>
        </div>

        <label className="flex flex-col text-xs font-medium text-gray-600">
          Outline color
          <input
            type="color"
            disabled={!outlineEnabled}
            className="h-9 w-12 rounded-md border border-gray-300 p-1 shadow-sm disabled:opacity-50"
            value={outlineColor}
            onChange={changeOutlineColor}
          />
        </label>

        <label className="flex flex-col text-xs font-medium text-gray-600">
          Outline width
          <input
            className="h-9 w-20 rounded-md border border-gray-300 px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10 disabled:opacity-50"
            type="number"
            min={0}
            value={outlineWidth}
            disabled={!outlineEnabled}
            onChange={changeOutlineWidth}
          />
        </label>
      </div> */}

      {/* SHADOW */}
      {/* <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-2">
          <input
            id="shadow-toggle"
            type="checkbox"
            checked={shadowEnabled}
            onChange={toggleShadow}
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/30"
          />
          <label
            htmlFor="shadow-toggle"
            className="text-xs font-medium text-gray-700"
          >
            Shadow
          </label>
        </div>

        <label className="flex flex-col text-xs font-medium text-gray-600">
          Shadow color
          <input
            type="color"
            className="h-9 w-12 rounded-md border border-gray-300 p-1 shadow-sm disabled:opacity-50"
            value={shadowColor}
            disabled={!shadowEnabled}
            onChange={applyShadowColor}
          />
        </label>

        <label className="flex flex-col text-xs font-medium text-gray-600">
          Blur
          <input
            className="h-9 w-20 rounded-md border border-gray-300 px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10 disabled:opacity-50"
            type="number"
            min={0}
            disabled={!shadowEnabled}
            value={shadowBlur}
            onChange={applyShadowNumber("blur")}
          />
        </label>

        <label className="flex flex-col text-xs font-medium text-gray-600">
          Offset X
          <input
            className="h-9 w-20 rounded-md border border-gray-300 px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10 disabled:opacity-50"
            type="number"
            disabled={!shadowEnabled}
            value={shadowOffsetX}
            onChange={applyShadowNumber("offsetX")}
          />
        </label>

        <label className="flex flex-col text-xs font-medium text-gray-600">
          Offset Y
          <input
            className="h-9 w-20 rounded-md border border-gray-300 px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10 disabled:opacity-50"
            type="number"
            disabled={!shadowEnabled}
            value={shadowOffsetY}
            onChange={applyShadowNumber("offsetY")}
          />
        </label>
      </div> */}
    </div>
  );
}
