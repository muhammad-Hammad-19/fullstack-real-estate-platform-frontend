import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import axios from "axios";
import Map from "../../components/map/Map";
import { useUser } from "../../context/AuthContext";

function SinglePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // 🔄 1. FETCH POST DETAILS & DETECT SAVED STATUS
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError("");

        // Single Post data call (Using exact ID parameter)
        const res = await axios.get(`http://localhost:3000/api/posts/${id}`, {
          withCredentials: true,
        });

        // 🟢 FIX: Array se single object extraction clean tareeqe se kiya
        const exactPostData = res.data.data || res.data;
        const finalPost = Array.isArray(exactPostData)
          ? exactPostData[0]
          : exactPostData;

        if (!finalPost) {
          setError("Property details nahi mil saki!");
          return;
        }

        setPost(finalPost);

        // 🟢 SAVED STATUS VERIFICATION (Clean Lookup)
        if (user) {
          try {
            const savedCheck = await axios.get(
              "http://localhost:3000/api/users/savedPosts",
              {
                withCredentials: true,
              },
            );
            const savedList = savedCheck.data.data || [];

            // Check if this post ID matches any item inside user's saved array
            const isThisPostSaved = savedList.some(
              (item) => item.postId === id,
            );
            setSaved(isThisPostSaved);
          } catch (err) {
            console.error("Saved status verify failed:", err);
          }
        }
      } catch (err) {
        console.error("Single post load error:", err);
        setError(
          err.response?.data?.message || "Property load karne mein masala hua!",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPostData();
  }, [id, user]);

  // 💾 2. TOGGLE SAVE/UNSAVE ACTION HANDLER
  const handleSave = async () => {
    if (!user) {
      navigate("/auth/login"); // Sahi auth login path
      return;
    }

    try {
      setSaveLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/users/save",
        { postId: id },
        { withCredentials: true },
      );

      if (response.data.success) {
        // State updates beautifully dynamically based on backend dynamic response
        setSaved(response.data.isSaved);
      }
    } catch (err) {
      console.error("Post save error:", err);
      alert(err.response?.data?.message || "Koshish nakaam rahi.");
    } finally {
      setSaveLoading(false);
    }
  };

  // ─── RENDERING CONDITIONALS ───────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)] text-lg font-medium text-gray-500">
        Loading Property Details...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)] text-red-500 font-semibold">
        {error || "Post data unavailable."}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-white">
      {/* ─── LEFT SIDE CONTENT BOX ─────────────────────────────────── */}
      <div className="flex-[3] h-full overflow-y-auto p-6 md:p-8">
        {/* Main Banner Image Container */}
        <div className="h-[380px] w-full shadow-sm">
          <img
            src={
              post.images?.[0] ||
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
            }
            alt={post.title}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Content Details */}
        <div className="mt-8 max-w-[800px]">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {post.title}
          </h1>
          <p className="text-gray-500 mt-1">
            {post.address}, {post.city}
          </p>

          <div className="bg-[#fece51]/20 text-[#d49e1e] text-xl px-4 py-2 rounded-lg mt-4 w-max font-bold">
            Rs. {post.price.toLocaleString()}
          </div>

          {/* Main Description */}
          <div
            className="mt-8 text-slate-600 leading-relaxed text-base border-t pt-6"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                post.postDetail?.desc ||
                  "No description provided for this listing.",
              ),
            }}
          />
        </div>
      </div>

      {/* ─── RIGHT SIDE UTILITIES & ACTIONS ─────────────────────────── */}
      <div className="flex-[2] bg-[#fcf5f3] p-6 md:p-8 border-l border-[#f7deda] flex flex-col gap-6">
        <div>
          <p className="font-bold text-slate-700 mb-2">Property Specs</p>
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-sm text-slate-600">
            <span>
              <b>{post.postDetail?.size || 0}</b> sqft
            </span>
            <span className="text-slate-300">|</span>
            <span>
              <b>{post.bedroom}</b> Beds
            </span>
            <span className="text-slate-300">|</span>
            <span>
              <b>{post.bathroom}</b> Baths
            </span>
          </div>
        </div>

        <div>
          <p className="font-bold text-slate-700 mb-2">Location Map</p>
          <div className="w-full h-[240px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <Map items={[post]} />
          </div>
        </div>

        {/* Action Button Controls */}
        <div className="flex gap-4 mt-auto pt-6 border-t border-[#f7deda]">
          <button className="w-full p-3 bg-white border-2 border-[#fece51] hover:bg-yellow-50 rounded-xl font-bold text-slate-700 transition-all active:scale-95 cursor-pointer">
            Message Owner
          </button>

          <button
            onClick={handleSave}
            disabled={saveLoading}
            className={`w-full p-3 border-2 border-[#fece51] rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
              saved
                ? "bg-[#fece51] text-slate-800 hover:bg-yellow-400"
                : "bg-white text-slate-700 hover:bg-yellow-50"
            }`}
          >
            {saveLoading ? "Processing..." : saved ? "Saved ✔" : "Save Place"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
