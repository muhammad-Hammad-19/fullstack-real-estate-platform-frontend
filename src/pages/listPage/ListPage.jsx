import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";

const ListPage = () => {
  const [searchParams] = useSearchParams();

  // Local States for managing data flow
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchFilteredPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `http://localhost:3000/api/posts?${searchParams.toString()}`,
          {
            withCredentials: true,
          },
        );

        setPosts(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching filtered posts:", err);
        setError(
          err.response?.data?.message ||
            "Properties load karne mein masala hua!",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPosts();
  }, [searchParams]); // Jab bhi user filter submit karega aur URL badlega, ye function dobara chalega

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] overflow-hidden bg-white w-full">
      {/* LEFT SIDE: CARDS LIST */}
      <div className="flex-[3] h-full overflow-y-auto p-4 md:p-6">
        <div className="max-w-[750px] mx-auto flex flex-col gap-8 pb-10">
          <Filter />
          
          <div className="flex flex-col gap-6">
            {loading ? (
              <p className="text-center text-slate-500 py-10 font-medium">
                Loading properties...
              </p>
            ) : error ? (
              <p className="text-center text-red-500 py-10 font-medium">
                {error}
              </p>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => <Card key={post.id} item={post} />)
            ) : (
              <p className="text-gray-400 italic text-center py-10 bg-slate-50 rounded-lg border-2 border-dashed">
                No properties match your filter criteria.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: MAP SYSTEM */}
      <div className="hidden md:block flex-[2] h-full bg-[#fcf5f3] relative">
        {/* Loading state handle ho taaki empty posts par map component crash na kare */}
        {!loading && (
          <Map 
            items={
              Array.isArray(posts) 
                ? posts.filter(post => {
                    const lat = parseFloat(post.latitude);
                    const lng = parseFloat(post.longitude);
                    // Sirf wahi posts map ko do jinki lat/lng numbers hon aur valid range me hon
                    return !isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
                  })
                : []
            } 
          />
        )}
      </div>
    </div>
  );
};

export default ListPage;