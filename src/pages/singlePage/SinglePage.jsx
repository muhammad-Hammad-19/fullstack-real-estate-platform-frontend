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

  // 🔄 FETCH POST DETAILS & CHECK IF ALREADY SAVED
  useEffect(() => {
    const fetchPostAndSavedStatus = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Original Post Data fetch kiya
        const res = await axios.get(`http://localhost:3000/api/posts/${id}`);
        const exactPostData = res.data.data || res.data;
        setPost(exactPostData);

        // 2. Refresh sync: Agar user logged in hai, check karein yeh saved list me hai ya nahi
        if (user) {
          try {
            const savedCheck = await axios.get("http://localhost:3000/api/users/savedPosts", {
              withCredentials: true,
            });
            const savedList = savedCheck.data.data || [];
            const isThisPostSaved = savedList.some((item) => item.postId === id);
            setSaved(isThisPostSaved);
          } catch (err) {
            console.error("Saved status verify failed:", err);
          }
        }
      } catch (err) {
        console.error("Single post load error:", err);
        setError(err.response?.data?.message || "Property load karne mein masala hua!");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPostAndSavedStatus();
  }, [id, user]);

  // 💾 TOGGLE SAVE ACTION
  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setSaveLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/users/save",
        { postId: id },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSaved(response.data.isSaved); // Backend strict status handler
        alert(response.data.message);
      }
    } catch (err) {
      console.error("Post save error:", err);
      alert(err.response?.data?.message || "Koshish nakaam rahi.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-100px)]">Loading...</div>;
  if (error || !post) return <div className="flex items-center justify-center h-[calc(100vh-100px)] text-red-500">{error}</div>;

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-white">
      {/* LEFT CONTENT BOX */}
      <div className="flex-[3] h-full overflow-y-auto p-6">
        <div className="flex gap-2 h-[350px] w-full">
          <img src={post.images?.[0] || "/noimage.jpg"} alt="Main" className="w-full h-full object-cover rounded-xl" />
        </div>
        <div className="mt-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-gray-500">{post.address}, {post.city}</p>
          <div className="bg-[#fece51]/30 p-2 rounded mt-2 w-max font-bold">${post.price}</div>
          <div 
            className="mt-6 text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.postDetail?.desc || "") }} 
          />
        </div>
      </div>

      {/* RIGHT UTILITIES & ACTIONS */}
      <div className="flex-[2] bg-[#fcf5f3] p-6 border-l">
        <div className="flex flex-col gap-4">
          <p className="font-bold">Sizes</p>
          <div className="flex gap-2 bg-white p-3 rounded-xl border">
            <span>{post.postDetail?.size || 0} sqft</span> | <span>{post.bedroom} Beds</span> | <span>{post.bathroom} Bath</span>
          </div>

          <p className="font-bold">Location</p>
          <div className="w-full h-[200px] rounded-xl overflow-hidden"><Map items={[post]} /></div>

          <div className="flex gap-4 mt-4">
            <button className="w-full p-3 bg-white border border-[#fece51] rounded-md font-semibold text-slate-700">Message</button>
            <button
              onClick={handleSave}
              disabled={saveLoading}
              style={{ backgroundColor: saved ? "#fece51" : "white" }}
              className="w-full p-3 border border-[#fece51] rounded-md font-semibold transition-all shadow-sm active:scale-95"
            >
              {saveLoading ? "Processing..." : saved ? "Place Saved ✔" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;