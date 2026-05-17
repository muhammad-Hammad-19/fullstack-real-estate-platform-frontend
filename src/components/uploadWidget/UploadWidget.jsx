import { useEffect } from "react";

const UploadWidget = ({ uwConfig, setState }) => {
  useEffect(() => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: uwConfig?.cloudName || "hzxyensd5",
        uploadPreset: uwConfig?.uploadPreset || "aoh4fpwm",
        folder: uwConfig?.folder || "posts",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          // Parent (NewPostPage) ke images array me naye image URL ko add karna
          setState((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
    
    const handleUploadClick = () => widget.open();

    document
      .getElementById("upload_widget")
      .addEventListener("click", handleUploadClick);

    // Cleanup structure to prevent memory leaks
    return () => {
      const btn = document.getElementById("upload_widget");
      if (btn) btn.removeEventListener("click", handleUploadClick);
    };
  }, [uwConfig, setState]);

  return (
    <button
      type="button"
      id="upload_widget"
      className="bg-[#51c7fe] text-white px-6 py-3 rounded-md font-semibold cursor-pointer shadow-sm hover:bg-[#40b6ed] transition-all"
    >
      Upload Photo
    </button>
  );
};

export default UploadWidget;