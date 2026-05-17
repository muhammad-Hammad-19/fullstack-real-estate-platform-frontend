import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // 1. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      price: "",
      address: "",
      city: "",
      bedroom: "1",
      bathroom: "1",
      type: "rent",
      property: "apartment",
      latitude: "",
      longitude: "",
      desc: "",
      utilities: "owner",
      pet: "not allowed",
      income: "",
      size: "",
      school: "",
      bus: "",
      restaurant: "",
    },
  });

  // 2. Form Submit Handler
  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error("Kam az kam ek image upload karna lazmi hai!");
      return;
    }

    setLoading(true);

    const payload = {
      postData: {
        title: data.title,
        price: parseInt(data.price),
        address: data.address,
        city: data.city,
        bedroom: parseInt(data.bedroom),
        bathroom: parseInt(data.bathroom),
        latitude: data.latitude,
        longitude: data.longitude,
        type: data.type,
        property: data.property,
        images: images,
      },
      postDetail: {
        desc: data.desc,
        utilities: data.utilities,
        pet: data.pet,
        income: data.income || "Standard verification",
        size: parseInt(data.size),
        school: parseInt(data.school) || 0,
        bus: parseInt(data.bus) || 0,
        restaurant: parseInt(data.restaurant) || 0,
      },
    };
    
    try {
      const res = await axios.post("http://localhost:3000/api/posts", payload, {
        withCredentials: true,
      });

      console.log("Success Server Response:", res.data);

      navigate("/profile");

      toast.success("Post added successfully! 🚀");

      setImages([]);
      reset();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Something went wrong!";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      {/* ─── LEFT SIDE: FORM CONTAINER ──────────────────────────────── */}
      <div className="flex-[3] overflow-y-auto p-6 md:p-12 border-r border-slate-100">
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
              className={`p-4 border rounded-md outline-none focus:border-teal-500 ${errors.title ? "border-red-500" : "border-slate-200"}`}
              {...register("title", { required: "Title required hai" })}
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Price
            </label>
            <input
              type="number"
              placeholder="e.g. 120000"
              className={`p-4 border rounded-md outline-none focus:border-teal-500 ${errors.price ? "border-red-500" : "border-slate-200"}`}
              {...register("price", { required: "Price required hai" })}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Address
            </label>
            <input
              type="text"
              placeholder="Block 13D, Gulshan-e-Iqbal"
              className={`p-4 border rounded-md outline-none focus:border-teal-500 ${errors.address ? "border-red-500" : "border-slate-200"}`}
              {...register("address", { required: "Address required hai" })}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-slate-600">
              Description (HTML allowed)
            </label>
            <textarea
              rows="4"
              placeholder="Write something about the property..."
              className={`p-4 border rounded-md outline-none focus:border-teal-500 resize-none ${errors.desc ? "border-red-500" : "border-slate-200"}`}
              {...register("desc", { required: "Description required hai" })}
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">City</label>
            <input
              type="text"
              placeholder="Karachi"
              className={`p-4 border rounded-md outline-none focus:border-teal-500 ${errors.city ? "border-red-500" : "border-slate-200"}`}
              {...register("city", { required: "City required hai" })}
            />
          </div>

          {/* Bedroom */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Bedroom
            </label>
            <input
              type="number"
              min="1"
              className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500"
              {...register("bedroom", { required: true })}
            />
          </div>

          {/* Bathroom */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Bathroom
            </label>
            <input
              type="number"
              min="1"
              className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500"
              {...register("bathroom", { required: true })}
            />
          </div>

          {/* Latitude */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Latitude
            </label>
            <input
              type="text"
              placeholder="e.g. 24.9182"
              className={`p-4 border rounded-md outline-none focus:border-teal-500 ${errors.latitude ? "border-red-500" : "border-slate-200"}`}
              {...register("latitude", { required: "Latitude zaroori hai" })}
            />
          </div>

          {/* Longitude */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Longitude
            </label>
            <input
              type="text"
              placeholder="e.g. 67.0781"
              className={`p-4 border rounded-md outline-none focus:border-teal-500 ${errors.longitude ? "border-red-500" : "border-slate-200"}`}
              {...register("longitude", { required: "Longitude zaroori hai" })}
            />
          </div>

          {/* Size */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Size (sqft)
            </label>
            <input
              type="number"
              placeholder="e.g. 2150"
              className={`p-4 border rounded-md outline-none focus:border-teal-500 ${errors.size ? "border-red-500" : "border-slate-200"}`}
              {...register("size", { required: "Size matrix missing" })}
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Type</label>
            <select
              className="p-4 border border-slate-200 rounded-md bg-white outline-none focus:border-teal-500"
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
              className="p-4 border border-slate-200 rounded-md bg-white outline-none focus:border-teal-500"
              {...register("property")}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
            </select>
          </div>

          {/* Utilities Policy */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Utilities Policy
            </label>
            <select
              className="p-4 border border-slate-200 rounded-md bg-white outline-none focus:border-teal-500"
              {...register("utilities")}
            >
              <option value="owner">Owner is responsible</option>
              <option value="tenant">Tenant is responsible</option>
            </select>
          </div>

          {/* Pet Policy */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Pet Policy
            </label>
            <select
              className="p-4 border border-slate-200 rounded-md bg-white outline-none focus:border-teal-500"
              {...register("pet")}
            >
              <option value="not allowed">Not Allowed</option>
              <option value="allowed">Allowed</option>
            </select>
          </div>

          {/* Income Policy */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Income Policy
            </label>
            <input
              type="text"
              placeholder="e.g. 6-month bank statement"
              className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500"
              {...register("income")}
            />
          </div>

          {/* School Distance */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              School Distance (m)
            </label>
            <input
              type="number"
              placeholder="e.g. 350"
              className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500"
              {...register("school")}
            />
          </div>

          {/* Bus Stop Distance */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Bus Distance (m)
            </label>
            <input
              type="number"
              placeholder="e.g. 200"
              className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500"
              {...register("bus")}
            />
          </div>

          {/* Restaurant Distance */}
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">
              Restaurant Distance (m)
            </label>
            <input
              type="number"
              placeholder="e.g. 150"
              className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500"
              {...register("restaurant")}
            />
          </div>

          {/* Submit Action Container */}
          <div className="w-full md:w-[30%] flex flex-col gap-2 mt-4">
            <button
              disabled={loading}
              className="w-full p-4 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition-all duration-300 shadow-md active:scale-95 disabled:bg-teal-400 cursor-pointer"
            >
              {loading ? "Submitting..." : "Add Post"}
            </button>
          </div>
        </form>
      </div>

      {/* ─── RIGHT SIDE: MEDIA BOX CONTAINER ──────────────────────────── */}
      <div className="flex-[2] bg-slate-50 flex flex-col p-6 md:p-8 items-center justify-start gap-6 overflow-y-auto max-h-screen">
        <div className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4 mt-4 lg:mt-12">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-700 text-sm tracking-wide uppercase">
              Property Media
            </span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-semibold">
              {images.length} Files Selected
            </span>
          </div>

          {/* Uploaded Photos Grid View inside Widget Container */}
          <div className="grid grid-cols-2 gap-3 w-full max-h-[360px] overflow-y-auto p-1">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border border-slate-100 shadow-xs h-28"
              >
                <img
                  src={img}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt="Uploaded Asset"
                />
                <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  #{index + 1}
                </span>
              </div>
            ))}

            {/* Placeholder Empty State Grid block inside container */}
            {images.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <div className="text-3xl">📷</div>
                <p className="text-xs italic font-medium text-slate-400">
                  No photos uploaded yet
                </p>
              </div>
            )}
          </div>

          {/* Centralized Core Upload Widget Button interface */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-center">
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
      </div>
    </div>
  );
}

export default NewPostPage;
