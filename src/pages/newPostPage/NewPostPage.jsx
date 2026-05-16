import { useState } from "react";
import axios from "axios";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function NewPostPage() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Simple Form State with Latitude and Longitude
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    address: "",
    city: "",
    bedroom: "1",
    bathroom: "1",
    type: "rent",
    property: "apartment",
    size: "",
    latitude: "",
    longitude: "",
    desc: "",
  });

  // Inputs Change Handler
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Backend Prisma architecture ke mutabiq nested payload structuring
    const payload = {
      postData: {
        title: formData.title,
        price: parseInt(formData.price),
        address: formData.address,
        city: formData.city,
        bedroom: parseInt(formData.bedroom),
        bathroom: parseInt(formData.bathroom),
        type: formData.type,
        property: formData.property,
        latitude: formData.latitude, // Required by Prisma
        longitude: formData.longitude, // Required by Prisma
        images: images, 
      },
      postDetail: {
        desc: formData.desc,
        size: parseInt(formData.size),
      },
    };

    try {
      // Axios request directed to port 3000
      const res = await axios.post("http://localhost:3000/api/posts", payload, {
        withCredentials: true, // Cookies/Sessions forward karne ke liye
      });
      
      console.log("Success:", res.data);
      alert("Post added successfully!");
      setImages([]);
      setFormData({
        title: "",
        price: "",
        address: "",
        city: "",
        bedroom: "1",
        bathroom: "1",
        type: "rent",
        property: "apartment",
        size: "",
        latitude: "",
        longitude: "",
        desc: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      
      {/* ─── LEFT SIDE: FORM CONTAINER ──────────────────────────────── */}
      <div className="flex-[3] overflow-y-auto p-6 md:p-12">
        <h1 className="text-3xl font-light mb-8 text-slate-800">Add New Post</h1>

        <form onSubmit={handleSubmit} className="flex flex-wrap justify-between gap-6">
          
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Post title" className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500" />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Price</label>
            <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 1500" className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500" />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Address</label>
            <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Full address" className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500" />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-slate-600">Description</label>
            <textarea required rows="4" name="desc" value={formData.desc} onChange={handleChange} placeholder="Write something about the property..." className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500 resize-none" />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">City</label>
            <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="London" className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500" />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Bedroom</label>
            <input required type="number" min="1" name="bedroom" value={formData.bedroom} onChange={handleChange} className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500" />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Bathroom</label>
            <input required type="number" min="1" name="bathroom" value={formData.bathroom} onChange={handleChange} className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500" />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Latitude</label>
            <input required type="text" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="e.g. 51.5074" className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500" />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Longitude</label>
            <input required type="text" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="e.g. -0.1278" className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500" />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Size (sqft)</label>
            <input required type="number" name="size" value={formData.size} onChange={handleChange} placeholder="e.g. 1200" className="p-4 border border-slate-200 rounded-md outline-none focus:border-teal-500" />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="p-4 border border-slate-200 rounded-md bg-white outline-none focus:border-teal-500">
              <option value="rent">Rent</option>
              <option value="buy">Buy</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-sm font-semibold text-slate-600">Property</label>
            <select name="property" value={formData.property} onChange={handleChange} className="p-4 border border-slate-200 rounded-md bg-white outline-none focus:border-teal-500">
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
            </select>
          </div>

          {/* Submit Action Container */}
          <div className="w-full md:w-[30%] flex flex-col gap-2 mt-4">
            <button
              disabled={loading}
              className="w-full p-4 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition-all duration-300 shadow-md active:scale-95 disabled:bg-teal-400 cursor-pointer"
            >
              {loading ? "Submitting..." : "Add Post"}
            </button>
            {error && <span className="text-sm text-red-500 text-center font-medium">{error}</span>}
          </div>
        </form>
      </div>

      {/* ─── RIGHT SIDE: MEDIA CONTAINER ──────────────────────────── */}
      <div className="flex-[2] bg-slate-50 flex flex-col gap-8 items-center justify-center p-6 border-l border-slate-100">
        <div className="grid grid-cols-2 gap-4 w-full overflow-y-auto max-h-[400px] p-2">
          {images.map((img, index) => (
            <img key={index} src={img} className="w-full h-32 object-cover rounded-lg border-2 border-white shadow-sm" alt="Uploaded View" />
          ))}
          {images.length === 0 && (
            <div className="col-span-2 flex flex-col items-center gap-2 text-slate-400">
              <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-xl">📷</div>
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