import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import axios from "axios";
import Map from "../../components/map/Map";
import Slider from "../../components/slider/Slider";
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
  const [chatLoading, setChatLoading] = useState(false);

  // 🔄 1. FETCH DATA AND DETECT SAVED STATUS
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `http://localhost:3000/api/posts/${id}/details`,
          { withCredentials: true },
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

        if (user) {
          try {
            const savedCheck = await axios.get(
              "http://localhost:3000/api/users/savedPosts",
              { withCredentials: true },
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

  // 💾 2. SAVE TOGGLE HANDLER
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

  // ─── 🔥 CHAT AND MESSAGE PROTECTION SYSTEM ────────────────────────
  const handleMessageOwner = async () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    const ownerId = post.userId || post.user?.id || post.user?._id;
    const currentUserId = user.id || user.userId;

    if (ownerId === currentUserId) {
      alert("Aap apni hi property par chat shuru nahi kar sakte!");
      return;
    }

    if (!ownerId) {
      alert("Is post ke owner ki details nahi mil sakein.");
      return;
    }

    try {
      setChatLoading(true);
      await axios.post(
        "http://localhost:3000/api/chats",
        { receiverId: ownerId },
        { withCredentials: true },
      );

      navigate("/profile");
    } catch (err) {
      console.error("Chat backend redirection:", err);
      navigate("/profile");
    } finally {
      setChatLoading(false);
    }
  };

  // 🛠️ CRITICAL VALVE: Check coordinates strictly before rendering Map Container
  const hasValidCoordinates = useMemo(() => {
    if (!post) return false;
    const lat = parseFloat(post.latitude);
    const lng = parseFloat(post.longitude);

    return (
      !isNaN(lat) && lat >= -90 && lat <= 90 &&
      !isNaN(lng) && lng >= -180 && lng <= 180
    );
  }, [post]);

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
      {/* 🟢 LEFT AREA (Details & Description) */}
      <div className="flex-[3] h-full overflow-y-auto p-4 md:p-8 lg:pr-12">
        <div className="w-full">
          <Slider images={post.images || []} />

          <div className="mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="text-2xl md:text-3xl font-normal text-slate-800 tracking-tight">
                  {post.title}
                </h1>
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <img src="/pin.png" alt="pin location" className="w-4 h-4" />
                  <span>
                    {post.address}, {post.city}
                  </span>
                </div>
                <div className="bg-[#fece51]/40 text-slate-800 text-xl px-2 py-1 rounded-md w-max font-light">
                  Rs. {post.price ? post.price.toLocaleString() : 0}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 px-12 py-4 rounded-xl bg-[#fece51]/20 font-semibold text-sm">
                <img
                  src={post.user?.avatar || "/noavatar.png"}
                  alt={post.user?.username || "Owner"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span>{post.user?.username || "Agent"}</span>
              </div>
            </div>

            <div
              className="mt-12 text-slate-600 leading-relaxed text-sm md:text-base border-t pt-8"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  post.postDetail?.desc ||
                    "No description provided for this listing.",
                ),
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* 🔴 RIGHT AREA (Features & Location Spec Boxes) */}
      <div className="flex-[2] bg-[#fcf5f3] p-4 md:p-8 lg:px-6 flex flex-col gap-6 overflow-y-auto h-full">
        <div>
          <p className="font-bold text-slate-800 mb-3 text-base">General</p>
          <div className="flex flex-col gap-5 p-5 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src="/utility.png"
                alt=""
                className="w-6 h-6 p-1 bg-[#fece51]/20 rounded"
              />
              <div className="text-xs md:text-sm">
                <span className="font-bold block text-slate-700">
                  Utilities
                </span>
                {post.postDetail?.utilities === "owner" ? (
                  <p className="text-slate-500">Owner is responsible</p>
                ) : (
                  <p className="text-slate-500">Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="/pet.png"
                alt=""
                className="w-6 h-6 p-1 bg-[#fece51]/20 rounded"
              />
              <div className="text-xs md:text-sm">
                <span className="font-bold block text-slate-700">
                  Pet Policy
                </span>
                {post.postDetail?.pet === "allowed" ? (
                  <p className="text-slate-500">Pets Allowed</p>
                ) : (
                  <p className="text-slate-500">Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="/fee.png"
                alt=""
                className="w-6 h-6 p-1 bg-[#fece51]/20 rounded"
              />
              <div className="text-xs md:text-sm">
                <span className="font-bold block text-slate-700">
                  Income Policy
                </span>
                <p className="text-slate-500">
                  {post.postDetail?.income || "Standard documentation"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold text-slate-800 mb-3 text-base">Sizes</p>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-md flex-1 shadow-sm text-[11px] lg:text-xs text-slate-700">
              <img src="/size.png" alt="" className="w-5 h-5" />
              <span>{post.postDetail?.size || 0} sqft</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-md flex-1 shadow-sm text-[11px] lg:text-xs text-slate-700">
              <img src="/bed.png" alt="" className="w-5 h-5" />
              <span>{post.bedroom || 0} beds</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-md flex-1 shadow-sm text-[11px] lg:text-xs text-slate-700">
              <img src="/bath.png" alt="" className="w-5 h-5" />
              <span>{post.bathroom || 0} bath</span>
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold text-slate-800 mb-3 text-base">
            Nearby Places
          </p>
          <div className="flex justify-between p-4 bg-white rounded-xl shadow-sm gap-2">
            <div className="flex flex-col items-center text-center gap-1 flex-1">
              <img src="/school.png" alt="" className="w-5 h-5" />
              <span className="font-bold text-xs text-slate-700">School</span>
              <p className="text-[10px] text-slate-500">
                {post.postDetail?.school > 999
                  ? post.postDetail.school / 1000 + "km"
                  : (post.postDetail?.school || 0) + "m"}{" "}
                away
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-1 flex-1 border-x border-slate-100">
              <img src="/pet.png" alt="" className="w-5 h-5" />
              <span className="font-bold text-xs text-slate-700">Bus Stop</span>
              <p className="text-[10px] text-slate-500">
                {post.postDetail?.bus || 0}m away
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-1 flex-1">
              <img src="/fee.png" alt="" className="w-5 h-5" />
              <span className="font-bold text-xs text-slate-700">
                Restaurant
              </span>
              <p className="text-[10px] text-slate-500">
                {post.postDetail?.restaurant || 0}m away
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold text-slate-800 mb-3 text-base">Location</p>
          <div className="w-full h-[200px] rounded-xl overflow-hidden shadow-sm border border-slate-100">
            {/* 🛠️ FIXED DESIGN INTERCEPTOR */}
            {hasValidCoordinates ? (
              <Map items={[post]} />
            ) : (
              <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-1 text-xs px-4 text-center">
                <span className="text-xl">📍</span>
                <p className="font-medium text-slate-500">Map unavailable</p>
                <p className="text-[10px]">This listing has invalid geographic coordinates.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-auto pt-4">
          <button
            onClick={handleMessageOwner}
            disabled={chatLoading}
            className="flex items-center justify-center gap-2 p-4 bg-white border border-[#fece51] rounded-md text-sm font-medium text-slate-700 cursor-pointer hover:bg-yellow-50/50 active:scale-95 transition-all flex-1 disabled:opacity-50"
          >
            <img src="/chat.png" alt="" className="w-4 h-4" />
            {chatLoading ? "Opening..." : "Send a Message"}
          </button>

          <button
            onClick={handleSave}
            disabled={saveLoading}
            style={{ backgroundColor: saved ? "#fece51" : "white" }}
            className="flex items-center justify-center gap-2 p-4 border border-[#fece51] rounded-md text-sm font-medium text-slate-700 cursor-pointer active:scale-95 transition-all flex-1"
          >
            <img src="/save.png" alt="" className="w-4 h-4" />
            {saveLoading
              ? "Processing..."
              : saved
                ? "Place Saved"
                : "Save the Place"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;