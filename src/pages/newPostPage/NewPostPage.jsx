import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function NewPostPage() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // React Hook Form Initialize
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Form Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    // Data ko aapke backend architecture ke mutabiq split kiya hai
    const payload = {
      postData: {
        title: data.title,
        price: parseInt(data.price),
        address: data.address,
        city: data.city,
        bedroom: parseInt(data.bedroom),
        bathroom: parseInt(data.bathroom),
        type: data.type,
        property: data.property,
        images: images, // State se images le rahay hain
      },
      postDetail: {
        desc: data.desc,
        size: parseInt(data.size),
      },
    };

    try {
      // Axios POST Request (Yahan apna sahi API URL lagayein agar interceptor nahi hai)
      const res = await axios.post("/posts", payload);
      console.log("Success:", res.data);
      // Agar redirect karna ho: window.location.href = `/${res.data.id}`;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Left Side: Form Container */}
      <div className="flex-[3] overflow-y-auto p-6 md:p-12">
        <h1 className="text-3xl font-light mb-8 text-slate-800">
          Add New Post
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-wrap justify-between gap-6"
        >
          {/* Title */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Title
            </label>
            <input
              type="text"
              placeholder="Post title"
              className={`p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${errors.title ? "border-red-500" : "border-slate-200"}`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="text-xs text-red-500">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Price
            </label>
            <input
              type="number"
              placeholder="e.g. 1500"
              className={`p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${errors.price ? "border-red-500" : "border-slate-200"}`}
              {...register("price", {
                required: "Price is required",
                min: { value: 1, message: "Price must be greater than 0" },
              })}
            />
            {errors.price && (
              <span className="text-xs text-red-500">
                {errors.price.message}
              </span>
            )}
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Address
            </label>
            <input
              type="text"
              placeholder="Full address"
              className={`p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${errors.address ? "border-red-500" : "border-slate-200"}`}
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <span className="text-xs text-red-500">
                {errors.address.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-slate-600">
              Description
            </label>
            <textarea
              rows="6"
              placeholder="Write something about the property..."
              className={`p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none ${errors.desc ? "border-red-500" : "border-slate-200"}`}
              {...register("desc", { required: "Description is required" })}
            ></textarea>
            {errors.desc && (
              <span className="text-xs text-red-500">
                {errors.desc.message}
              </span>
            )}
          </div>

          {/* City */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">City</label>
            <input
              type="text"
              className={`p-4 border rounded-md focus:outline-none focus:border-teal-500 ${errors.city ? "border-red-500" : "border-slate-200"}`}
              {...register("city", { required: "City is required" })}
            />
            {errors.city && (
              <span className="text-xs text-red-500">
                {errors.city.message}
              </span>
            )}
          </div>

          {/* Bedroom */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Bedroom
            </label>
            <input
              type="number"
              className={`p-4 border rounded-md focus:outline-none focus:border-teal-500 ${errors.bedroom ? "border-red-500" : "border-slate-200"}`}
              {...register("bedroom", { required: "Required", min: 1 })}
            />
            {errors.bedroom && (
              <span className="text-xs text-red-500">
                {errors.bedroom.message || "Min 1 bedroom required"}
              </span>
            )}
          </div>

          {/* Bathroom */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Bathroom
            </label>
            <input
              type="number"
              className={`p-4 border rounded-md focus:outline-none focus:border-teal-500 ${errors.bathroom ? "border-red-500" : "border-slate-200"}`}
              {...register("bathroom", { required: "Required", min: 1 })}
            />
            {errors.bathroom && (
              <span className="text-xs text-red-500">
                {errors.bathroom.message || "Min 1 bathroom required"}
              </span>
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Type</label>
            <select
              className="p-4 border border-slate-200 rounded-md bg-white focus:border-teal-500 outline-none"
              {...register("type")}
            >
              <option value="rent">Rent</option>
              <option value="buy">Buy</option>
            </select>
          </div>

          {/* Property */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Property
            </label>
            <select
              className="p-4 border border-slate-200 rounded-md bg-white focus:border-teal-500 outline-none"
              {...register("property")}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
            </select>
          </div>

          {/* Size */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Size (sqft)
            </label>
            <input
              type="number"
              className={`p-4 border rounded-md focus:outline-none focus:border-teal-500 ${errors.size ? "border-red-500" : "border-slate-200"}`}
              {...register("size", { required: "Size is required" })}
            />
            {errors.size && (
              <span className="text-xs text-red-500">
                {errors.size.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="w-full md:w-[30%] flex flex-col gap-2 mt-4">
            <button
              disabled={loading}
              className="w-full p-4 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition-all duration-300 shadow-md active:scale-95 disabled:bg-teal-400"
            >
              {loading ? "Submitting..." : "Add Post"}
            </button>
            {error && (
              <span className="text-sm text-red-500 text-center font-medium">
                {error}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Right Side: Media Container */}
      <div className="flex-[2] bg-slate-50 flex flex-col gap-8 items-center justify-center p-6 border-l border-slate-100">
        <div className="grid grid-cols-2 gap-4 w-full overflow-y-auto max-h-[500px] p-2">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              className="w-full h-32 object-cover rounded-lg border-2 border-white shadow-sm transition-transform hover:scale-105"
              alt="Uploaded"
            />
          ))}
          {images.length === 0 && (
            <div className="col-span-2 flex flex-col items-center gap-2 text-slate-400">
              <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center">
                📷
              </div>
              <p className="text-sm italic">No images uploaded yet</p>
            </div>
          )}
        </div>

        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "lamadev",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
