import { useEffect, useRef } from "react";

const UploadWidget = ({ uwConfig, setState }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: uwConfig?.cloudName || "hzxyensd5",
        uploadPreset: uwConfig?.uploadPreset || "aoh4fpwm",
        folder: uwConfig?.folder || "posts",
        multiple: uwConfig?.multiple || false, // Default single image hoga
      },
      (error, result) => {
        if (!error && result.event === "success") {
          if (typeof setState === "function") {
            
            if (uwConfig?.multiple) {
              // 1. Agar MULTIPLE images hain (Jaise NewPostPage par)
              setState((prev) => {
                const currentImages = Array.isArray(prev) ? prev : [];
                return [...currentImages, result.info.secure_url];
              });
            } else {
              // 2. Agar SINGLE image hai (Jaise ProfileUpdate par)
              setState(result.info.secure_url);
            }

          } else {
            console.error("🎯 Error: Parent component se 'setState' prop sahi se nahi mili!");
          }
        }
      }
    );
  }, [uwConfig, setState]);

  return (
    <button
      type="button"
      onClick={() => widgetRef.current?.open()}
      className="bg-[#51c7fe] text-white px-6 py-3 rounded-md font-semibold cursor-pointer shadow-sm hover:bg-[#40b6ed] transition-all"
    >
      Upload Photo
    </button>
  );
};

export default UploadWidget;