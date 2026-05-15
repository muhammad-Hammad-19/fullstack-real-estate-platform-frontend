import { useEffect } from "react";

const UploadWidget = ({ setAvatar }) => {
  useEffect(() => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "hzxyensd5",
        uploadPreset: "aoh4fpwm",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          setAvatar(result.info.secure_url);
        }
      }
    );
    
    document
      .getElementById("upload_widget")
      .addEventListener("click", () => widget.open());
  }, [setAvatar]);

  return (
    <button
      id="upload_widget"
      className="bg-[#51c7fe] text-white px-6 py-3 rounded-md"
    >
      Upload Photo
    </button>
  );
};

export default UploadWidget;