"use client";
import { useEffect, useState } from "react";
import { LuAlignLeft, LuAlignCenter, LuAlignRight, LuBold, LuItalic, LuStrikethrough } from "react-icons/lu";

const FONTS = [
  "Arial", "Helvetica", "Inter", "Roboto",
  "Georgia", "Times New Roman", "Courier New", "monospace",
];

export default function ToolBarTextProperties({ canvas, object }) {
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textAlign, setTextAlign] = useState("left");
  const [textValue, setTextValue] = useState("");
  const [color, setColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrike, setIsStrike] = useState(false);

  // Načti hodnoty z objektu při mountu / změně objektu
  useEffect(() => {
    if (!object) return;
    setFontSize(Math.round(object.fontSize || 20));
    setFontFamily(object.fontFamily || "Arial");
    setTextAlign(object.textAlign || "left");
    setTextValue(object.text || "");
    setColor(object.fill || "#000000");
    setIsBold((object.fontWeight || "normal") === "bold");
    setIsItalic((object.fontStyle || "normal") === "italic");
    setIsStrike(!!object.linethrough);
  }, [object]);

  // LIVE SYNC při psaní na plátně (double-click edit)
  useEffect(() => {
    if (!object || object.type !== "textbox") return;

    const onChanged = () => {
      const current = object.text || "";
      // přepiš state jen když se opravdu změnil (zabrání zbytečným renderům)
      setTextValue((prev) => (prev !== current ? current : prev));
    };

    const onEditExit = () => {
      // po ukončení editace raději ještě jednou srovnej vše
      const current = object.text || "";
      setTextValue(current);
      // zarovnání/velikost/rodina se běžně nemění během editace,
      // ale kdyby se to stalo skrz jiné ovladače, můžeš zde případně dočíst i další props
    };

    // události na objektu (ne na canvasu!)
    object.on("changed", onChanged);
    object.on("editing:exited", onEditExit);

    return () => {
      object.off("changed", onChanged);
      object.off("editing:exited", onEditExit);
    };
  }, [object]);

  const render = () => canvas?.requestRenderAll();

  // Handlery
  const applyFontSize = (e) => {
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v) || v <= 0) v = 1;
    setFontSize(v);
    object?.set({ fontSize: v }); object?.setCoords(); render();
  };
  const applyFontFamily = (e) => {
    const v = e.target.value; setFontFamily(v);
    object?.set({ fontFamily: v }); render();
  };
  const applyTextAlign = (align) => {
    setTextAlign(align);
    object?.set({ textAlign: align }); object?.setCoords(); render();
  };
  const applyTextValue = (e) => {
    const v = e.target.value;
    setTextValue(v);
    object?.set({ text: v }); object?.setCoords(); render();
  };
  const handleColorChange = (e) => {
    const v = e.target.value; setColor(v);
    object?.set({ fill: v }); render();
  };
  const toggleBold = () => {
    const next = !isBold; setIsBold(next);
    object?.set({ fontWeight: next ? "bold" : "normal" }); object?.setCoords(); render();
  };
  const toggleItalic = () => {
    const next = !isItalic; setIsItalic(next);
    object?.set({ fontStyle: next ? "italic" : "normal" }); object?.setCoords(); render();
  };
  const toggleStrike = () => {
    const next = !isStrike; setIsStrike(next);
    object?.set({ linethrough: next }); object?.setCoords(); render();
  };

  return (


<div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur p-4 shadow-sm">
  <div className="flex justify-around flex-wrap items-end gap-5">

    {/* Font size */}
    <label className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-600">Font size</span>
      <input
        className="h-9 w-16 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
        type="number"
        min="1"
        value={fontSize}
        onChange={applyFontSize}
      />
    </label>

    {/* Font family */}
    <label className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-600">Font</span>
      <div className="relative">
        <select
          className="h-9 appearance-none rounded-md border border-gray-300 bg-white pe-8 ps-2 text-sm shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
          value={fontFamily}
          onChange={applyFontFamily}
        >
          {FONTS.map((f) => (
            <option key={f} value={f} style={{ fontFamily: f }}>
              {f}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>
    </label>

    {/* Color */}
    <label className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-600">Color</span>
      <input
        className="h-9 w-28 cursor-pointer rounded-md border border-gray-300 bg-white p-1 shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
        type="color"
        value={color}
        onChange={handleColorChange}
      />
    </label>

    {/* Align */}
    <div className="flex items-center gap-1">
      <span className="mr-1 text-xs font-medium text-gray-600">Align</span>
      {["left", "center", "right"].map((al) => (
        <button
          key={al}
          onClick={() => applyTextAlign(al)}
          className={[
            "inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 shadow-sm transition",
            textAlign === al
              ? "border-black bg-white"
              : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
            "focus:outline-none focus:ring-2 focus:ring-black/10"
          ].join(" ")}
          title={al}
        >
          {al === "left" && <LuAlignLeft className="text-[18px]" />}
          {al === "center" && <LuAlignCenter className="text-[18px]" />}
          {al === "right" && <LuAlignRight className="text-[18px]" />}
        </button>
      ))}
    </div>

    {/* Bold / Italic / Strike */}
    <div className="flex items-center gap-1">
      <span className="mr-1 text-xs font-medium text-gray-600">Style</span>
      <button
        onClick={toggleBold}
        className={[
          "inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 shadow-sm transition",
          isBold ? "border-black bg-white" : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
          "focus:outline-none focus:ring-2 focus:ring-black/10"
        ].join(" ")}
        title="Bold"
      >
        <LuBold className="text-[18px]" />
      </button>

      <button
        onClick={toggleItalic}
        className={[
          "inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 shadow-sm transition",
          isItalic ? "border-black bg-white" : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
          "focus:outline-none focus:ring-2 focus:ring-black/10"
        ].join(" ")}
        title="Italic"
      >
        <LuItalic className="text-[18px]" />
      </button>

      <button
        onClick={toggleStrike}
        className={[
          "inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 shadow-sm transition",
          isStrike ? "border-black bg-white" : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
          "focus:outline-none focus:ring-2 focus:ring-black/10"
        ].join(" ")}
        title="Strikethrough"
      >
        <LuStrikethrough className="text-[18px]" />
      </button>
    </div>
  </div>

  {/* Textarea */}
  <div className="mt-3">
    {/* <label className="mb-1 block text-xs font-medium text-gray-600">Text</label> */}
    <textarea
      className="min-h-24 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
      value={textValue}
      onChange={applyTextValue}
      placeholder="Zadej text…"
    />
  </div>
</div>

  );
}
