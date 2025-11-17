function MainButton({ callbackMethod, imageSrc}) {
  return (
    <div>
      <button
        onClick={() => callbackMethod}
        className={`h-20 w-20 rounded-lg border transition-colors flex justify-center items-center ${
          view === "front" ? "bg-black text-white" : "bg-white"
        }`}
      >
        <img src={imageSrc} width={50} alt="" />
      </button>
    </div>
  );
}

export default MainButton;
