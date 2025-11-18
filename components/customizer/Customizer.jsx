"use client";
import { useRef, useState } from "react";
import ResponsiveBagCanvas from "./ResponsiveBagCanvas";
import ToolbarProperties from "./ToolbarProperties";
import ToolbarColorProperties from "./ToolbarColorProperties";
import BoundaryGuard from "./BoundaryGuard";
import ExportToImage from "./ExportToImage";
import MainButton from "./buttons/MainButton";

import {
  RiDeleteBin3Line,
  RiImage2Fill,
  RiImageLine,
  RiSave2Line,
  RiShoppingBag2Line,
  RiShoppingCartLine,
  RiText,
} from "react-icons/ri";

/**
 * Hlavní komponenta:
 * - přepínač Front/Side (mountuje vždy jen jedno plátno)
 * - Add text, Add image, Delete selected
 * - ukládá JSON zvlášť pro front/side, aby věci zůstaly po přepnutí
 */
export default function Customizer() {
  const [view, setView] = useState("front"); // "front" | "side"
  const [activeCanvas, setActiveCanvas] = useState(null); // kvuli toolbaru
  const canvases = useRef({ front: null, side: null });
  const fabrics = useRef({ front: null, side: null });
  const savedJSON = useRef({ front: null, side: null });
  const fileInputRef = useRef(null);
  const [bagColors, setBagColors] = useState({
    strap: "black",
    fabric: "green",
  });
  const [canvasTick, setCanvasTick] = useState(0); // už máš; necháme ho pro re-run efektů

  const saveCurrentViewJSON = () => {
    const canvas = canvases.current[view];
    if (!canvas) return;
    savedJSON.current[view] = canvas.toJSON();
  };

  const switchView = (target) => {
    if (target === view) return;

    const current = canvases.current[view];
    if (current) {
      current.discardActiveObject(); // ⚙️ zruší označení na starém canvasu
      current.requestRenderAll();
    }

    saveCurrentViewJSON();
    setView(target);
    // pokud už je plátno pro target nachystané, rovnou ho dej do state - kvuli toolbaru
    const next = canvases.current[target];
    setActiveCanvas(next || null);
  };

  const handleAddText = () => {
    const canvas = canvases.current[view];
    const fabric = fabrics.current[view];
    if (!canvas || !fabric) return;

    const text = new fabric.Textbox("My Text", {
      left: canvas.getWidth() / 2 - 50,
      top: canvas.getHeight() / 2 + 80,
      width: 100,
      originX: "center",
      originY: "center",
      fontSize: 28,
      fill: "#000000",
      editable: true,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
    savedJSON.current[view] = canvas.toJSON();
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const canvas = canvases.current[view];
    const fabric = fabrics.current[view];
    if (!canvas || !fabric) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result;
        const img = await fabric.Image.fromURL(dataUrl);

        const baseW = canvas.getWidth();
        const baseH = canvas.getHeight();
        const maxW = baseW * 0.6;
        const maxH = baseH * 0.6;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);

        img.set({
          originX: "center",
          originY: "center",
          left: baseW / 2,
          top: baseH / 2,
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          evented: true,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
        savedJSON.current[view] = canvas.toJSON();
      } catch (err) {
        console.error("Add image failed:", err);
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsDataURL(file);
  };


  return (
    <section className="container flex flex-col items-center relative my-10 overflow-hidden">
      <h1 className="h1 mb-10">Přizpůsobit</h1>
      <div className="md:absolute left-0 top-40 flex flex-col gap-2 z-10 justify-center items-center md:items-start w-full md:w-auto">
        <div className="flex gap-2 w-full">
          <button
            onClick={() => switchView("front")}
            className={`h-35 w-1/2 md:w-35 transition-colors flex flex-col justify-center items-center rounded-xl border bg-gray-100 backdrop-blur shadow-lg cursor-pointer hover:bg-gray-200 duration-300 ${
              view === "front" ? "border-accent border-4" : "border-gray-200"
            }`}
          >
            <img src="./bag_symbol_front.png" width={50} alt="" />
          </button>

          <button
            onClick={() => switchView("side")}
            className={`h-35 w-1/2 md:w-35 transition-colors flex flex-col justify-center items-center gap-0 rounded-xl border  bg-gray-100 backdrop-blur p-4 shadow-lg cursor-pointer hover:bg-gray-200 duration-300 ${
              view === "side" ? "border-accent border-4" : "border-gray-200"
            }`}
          >
            <span className="text-sm mr-2"></span>
            <img src="./bag_symbol_side.png" width={70} alt="" />
          </button>
        </div>
        <div className="flex md:flex-col gap-2 mt-8 md:mt-20">
          <button
            onClick={handleAddText}
            className="h-25 w-25 md:h-35 md:w-35 transition-colors flex justify-center items-center rounded-xl border border-gray-200 bg-blue-50 hover:bg-blue-100 backdrop-blur p-4 shadow-lg cursor-pointer duration-300"
            title="Přidat text"
          >
            <span className="text-7xl">
              <RiText />
            </span>
          </button>

          <button
            onClick={openFilePicker}
            className="h-25 w-25 md:h-35 md:w-35 transition-colors flex justify-center items-center rounded-xl border border-gray-200 bg-red-50 backdrop-blur p-4 shadow-lg cursor-pointer duration-300 hover:bg-red-100"
            title="Přidat obrázek"

          >
            <span className="text-7xl">
              <RiImageLine />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelected}
          />

        </div>
      </div>

      {/* CANVAS WRAPPER */}
      <div className="relative w-full max-w-[900px] h-[320px] md:h-[800px] mx-auto">
        <ResponsiveBagCanvas
          imgSrc="/bag_front.png"
          initialJSON={savedJSON.current.front}
          visible={view === "front"}
          onReady={(canvas, fabric) => {
            canvases.current.front = canvas;
            fabrics.current.front = fabric;
            if (view === "front") setActiveCanvas(canvas);
            setCanvasTick((t) => t + 1); // 👈 vynutí re-render
          }}
        />

        <ResponsiveBagCanvas
          imgSrc="/bag_side.png"
          initialJSON={savedJSON.current.side}
          visible={view === "side"}
          onReady={(canvas, fabric) => {
            canvases.current.side = canvas;
            fabrics.current.side = fabric;
            if (view === "side") setActiveCanvas(canvas);
            setCanvasTick((t) => t + 1); // 👈 vynutí re-render
          }}
        />
      </div>

      <BoundaryGuard canvas={activeCanvas} />
      <ToolbarProperties canvas={activeCanvas} />
      <ToolbarColorProperties
        frontCanvas={canvases.current.front}
        sideCanvas={canvases.current.side}
        view={view}
        basePath="/bag"
        ext="png"
        colors={bagColors} // 👈 řízený stav barev
        onChangeColors={(
          upd // 👈 updater z toolbaru
        ) => setBagColors((prev) => ({ ...prev, ...upd }))}
        tick={canvasTick} // 👈 jen aby efekt proběhl, ne jako key!
      />

      <div className="flex flex-col md:flex-row gap-10 items-center justify-center mt-10 md:mt-0">
        <button className="btn btn-accent rounded text-white">
          <span className="pr-2 text-2xl">
            <RiSave2Line />
          </span>
          Uložit
        </button>
        <div className="flex flex-col items-center justify-center">
          <h2 className="h2">299,- Kč</h2>
          <p>Cena včetně DPH, bez poštovného</p>
        </div>
        <button className="btn btn-accent rounded text-white">
          <span className="pr-2 text-2xl">
            <RiShoppingCartLine />
          </span>
          Do košíku
        </button>

        <ExportToImage
          getCanvas={(v) => canvases.current[v]} // ← vrátí instanci canvasu
          currentView={view} // ← aktuální pohled
          switchView={async (v) => {
            // ← přepnutí pohledu
            // uložit JSON aktivního, ať se nic neztratí
            const cur = canvases.current[view];
            if (cur) savedJSON.current[view] = cur.toJSON();

            setView(v);
            // aktivní canvas nastavíme hned, pokud existuje
            const next = canvases.current[v];
            setActiveCanvas(next || null);
          }}
          filenameBase="gymbag"
          multiplier={2}
          includeBackground={false}
        />
      </div>
    </section>
  );
}
