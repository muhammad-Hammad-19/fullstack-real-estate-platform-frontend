import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simple fetch function bina kisi filters ke
  const fetchAllPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3000/api/posts");
      // Backend structured response handle karne ke liye fallback lagaya hai
      setPosts(res.data.data || res.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  // Context load hote hi automatic saari posts fetch ho jayengi
  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts, loading, error, refetch: fetchAllPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePosts must be used within PostContextProvider");
  return context;
};