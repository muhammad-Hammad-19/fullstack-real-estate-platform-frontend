import { useState } from "react";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  // Images guard condition agar array khali ho ya array na ho
  if (!images || images.length === 0) return null;

  const changeSlide = (direction) => {
    if (direction === "left") {
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  return (
    <div className="w-full h-[350px] sm:h-[280px] flex gap-5">
      {/* ─── FULLSCREEN LIGHTBOX SLIDER (.fullSlider) ────────────────── */}
      {imageIndex !== null && (
        <div className="fixed inset-0 w-screen h-screen bg-black flex justify-between items-center z-[9999]">
          {/* Left Arrow */}
          <div
            className="flex-1 flex items-center justify-center cursor-pointer select-none"
            onClick={() => changeSlide("left")}
          >
            <img
              src="/arrow.png"
              alt="Previous"
              className="w-[50px] md:w-[30px] sm:w-[20px] invert"
            />
          </div>

          {/* Main Image Container */}
          <div className="flex-[10] h-[80vh] flex items-center justify-center">
            <img
              src={images[imageIndex]}
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Right Arrow */}
          <div
            className="flex-1 flex items-center justify-center cursor-pointer select-none"
            onClick={() => changeSlide("right")}
          >
            <img
              src="/arrow.png"
              alt="Next"
              className="w-[50px] md:w-[30px] sm:w-[20px] rotate-180 invert"
            />
          </div>

          {/* Close Button */}
          <div
            className="absolute top-0 right-0 color-white text-white text-3xl md:text-4xl font-bold p-8 md:p-12 cursor-pointer select-none hover:text-amber-400 transition-colors"
            onClick={() => setImageIndex(null)}
          >
            ✕
          </div>
        </div>
      )}

      {/* ─── MAIN DISPLAY GALLERY (.bigImage & .smallImages) ─────────── */}

      {/* Big Main Image Banner */}
      <div className="flex-[3] sm:flex-[2] h-full overflow-hidden rounded-xl">
        <img
          src={images[0]}
          alt="Main property view"
          className="w-full h-full object-cover rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          onClick={() => setImageIndex(0)}
        />
      </div>

      {/* Small Sidebar Thumbnails */}
      <div className="flex-1 h-full flex flex-col justify-between gap-2.5 overflow-y-auto pr-1">
        {images.slice(1, 4).map((image, index) => (
          <div
            key={index}
            className="h-[100px] sm:h-[80px] w-full overflow-hidden rounded-xl"
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setImageIndex(index + 1)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
