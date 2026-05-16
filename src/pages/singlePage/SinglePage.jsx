import React, { useEffect, useState } from "react";
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

        const res = await axios.get(
          `http://localhost:3000/api/posts/${id}/details`,
          {
            withCredentials: true,
          },
        );

        const exactPostData = res.data.data || res.data;
        const finalPost = Array.isArray(exactPostData)
          ? exactPostData[0]
          : exactPostData;

        if (!finalPost) {
          setError("Property details nahi mil saki!");
          return;
        }

        setPost(finalPost);

        // 🟢 SAVED STATUS VERIFICATION
        if (user) {
          try {
            const savedCheck = await axios.get(
              "http://localhost:3000/api/users/savedPosts",
              {
                withCredentials: true,
              },
            );
            const savedList = savedCheck.data.data || savedCheck.data || [];

            const isThisPostSaved = savedList.some(
              (item) =>
                item.postId === id ||
                item.id === id ||
                item.post?._id === id ||
                item.post?.id === id,
            );
            setSaved(isThisPostSaved);
          } catch (err) {
            console.error("Saved status verify failed:", err);
          }
        }
      } catch (err) {
        console.error("Single post load error:", err);
        setError(
          err.response?.data?.message ||
            "Property details load karne mein error aaya!",
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
      navigate("/auth/login");
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
      <div className="flex items-center justify-center h-[calc(100vh-100px)] text-lg font-medium text-slate-500 bg-slate-50">
        Loading Property Details...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-4 bg-slate-50">
        <p className="text-red-500 font-semibold text-lg">
          {error || "Post data unavailable."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-white">
      {/* LEFT SIDE CONTENT */}
      <div className="flex-[3] h-full overflow-y-auto p-4 md:p-8">
        <div className="h-[260px] md:h-[380px] w-full shadow-sm">
          <img
            src={
              post.images?.[0] ||
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
            }
            alt={post.title}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="mt-8 max-w-[800px]">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            {post.title}
          </h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">
            {post.address}, {post.city}
          </p>

          <div className="bg-[#fece51]/20 text-[#d49e1e] text-lg md:text-xl px-4 py-1.5 rounded-lg mt-4 w-max font-bold">
            Rs. {post.price ? post.price.toLocaleString() : 0}
          </div>

          <div
            className="mt-8 text-slate-600 leading-relaxed text-sm md:text-base border-t pt-6 dynamic-desc"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                post.postDetail?.desc ||
                  "No description provided for this listing.",
              ),
            }}
          />
        </div>
      </div>

      {/* RIGHT SIDE UTILITIES */}
      <div className="flex-[2] bg-[#fcf5f3] p-4 md:p-8 border-t lg:border-t-0 lg:border-l border-[#f7deda] flex flex-col gap-6">
        <div>
          <p className="font-bold text-slate-700 mb-2 text-sm md:text-base">
            Property Specs
          </p>
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-xs md:text-sm text-slate-600">
            <span>
              <b>{post.postDetail?.size || 0}</b> sqft
            </span>
            <span className="text-slate-200">|</span>
            <span>
              <b>{post.bedroom || 0}</b> Beds
            </span>
            <span className="text-slate-200">|</span>
            <span>
              <b>{post.bathroom || 0}</b> Baths
            </span>
          </div>
        </div>

        <div>
          <p className="font-bold text-slate-700 mb-2 text-sm md:text-base">
            Location Map
          </p>
          <div className="w-full h-[200px] md:h-[240px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            {/* 🟢 FIXED: Double quotes hataye taake valid array pass ho */}
            <Map items={[post]} />
          </div>
        </div>

        {/* Action Button Controls */}
        <div className="flex gap-4 mt-6 lg:mt-auto pt-6 border-t border-[#f7deda]">
          <button className="w-full p-3 bg-white border-2 border-[#fece51] hover:bg-yellow-50 rounded-xl font-bold text-slate-700 text-sm md:text-base transition-all active:scale-95 cursor-pointer">
            Message Owner
          </button>

          <button
            onClick={handleSave}
            disabled={saveLoading}
            className={`w-full p-3 border-2 border-[#fece51] rounded-xl font-bold text-sm md:text-base transition-all shadow-md active:scale-95 cursor-pointer ${
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
