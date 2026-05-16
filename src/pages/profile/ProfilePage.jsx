import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/AuthContext";
import Card from "../../components/card/Card";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  // States
  const [userPosts, setUserPosts] = useState([]);
  const [loadingUserPosts, setLoadingUserPosts] = useState(true);
  const [userPostsError, setUserPostsError] = useState("");

  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingSavedPosts, setLoadingSavedPosts] = useState(true);
  const [savedPostsError, setSavedPostsError] = useState("");

  // 🔥 CHAT STATES
  const [activeChat, setActiveChat] = useState(null); // Kis user se chat khuli hai
  const [chatMessage, setChatMessage] = useState(""); // Input field ke liye
  const [conversations, setConversations] = useState([
    {
      id: "dummy_1",
      username: "Jane Doe",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      messages: [
        { id: "m1", sender: "other", text: "Hello! Is this property still available?" },
        { id: "m2", sender: "me", text: "Yes, it is! When would you like to visit?" }
      ]
    },
    {
      id: "dummy_2",
      username: "Ali Khan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      messages: [
        { id: "m3", sender: "other", text: "Price mein thoda discount ho sakta hai?" }
      ]
    },
    {
      id: "dummy_3",
      username: "Zainab Fatima",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
      messages: [
        { id: "m4", sender: "other", text: "Can you share exact location map link?" }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  // Chat open hone par automatically down scroll karne ke liye
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // Auth guard protection
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);
  
  // Fetch Data Calls
  useEffect(() => {
    if (!user) return;

    const fetchUserPosts = async () => {
      try {
        setLoadingUserPosts(true);
        setUserPostsError("");

        const res = await axios.get(
          `http://localhost:3000/api/posts/user/${user?.userId || user?.id}`,
          { withCredentials: true }
        );

        const data = res.data.data || res.data;
        setUserPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("My Posts fetch error:", err);
        setUserPostsError("Aapki posts load karne mein error aaya.");
      } finally {
        setLoadingUserPosts(false);
      }
    };

    const fetchSavedPosts = async () => {
      try {
        setLoadingSavedPosts(true);
        setSavedPostsError("");

        const res = await axios.get(
          "http://localhost:3000/api/users/savedPosts",
          { withCredentials: true }
        );

        const data = res.data.data || [];
        setSavedPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Saved Posts fetch error:", err);
        setSavedPostsError("Saved items load karne mein error aaya.");
      } finally {
        setLoadingSavedPosts(false);
      }
    };

    fetchUserPosts();
    fetchSavedPosts();
  }, [user]);

  // 🔥 MESSAGE SEND FUNCTION
  const handleSendMessage = () => {
    if (!chatMessage.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: chatMessage.trim()
    };

    // Main array update karein
    const updatedConversations = conversations.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });

    setConversations(updatedConversations);
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
    setChatMessage("");
  };

  if (!user) {
    return <div className="p-10 text-center font-bold">Loading User...</div>;
  }

  const handleLogout = () => {
    updateUser(null);
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] overflow-hidden bg-white w-full">
      
      {/* ─── LEFT SIDE CONTENT (Bilkul touch nahi kiya) ─── */}
      <div className="flex-[3] p-6 md:p-10 overflow-y-auto">
        <div className="max-w-[700px] flex flex-col gap-12">
          
          {/* USER INFORMATION */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h1 className="text-2xl md:text-3xl font-light uppercase tracking-wider">
                User Information
              </h1>
              <button
                onClick={() => navigate("/profile/update")}
                className="bg-[#fece51] px-5 py-2 rounded-md font-medium hover:bg-yellow-400 transition-all shadow-sm"
              >
                Update Profile
              </button>
            </div>

            <div className="flex flex-col gap-4 text-lg text-slate-700">
              <span className="flex items-center gap-4">
                <b className="w-24">Avatar:</b>
                <img
                  src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="user"
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                />
              </span>
              <span className="flex items-center gap-4">
                <b className="w-24">Username:</b> {user.username}
              </span>
              <span className="flex items-center gap-4">
                <b className="w-24">E-mail:</b> {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-md font-medium w-max mt-4 hover:bg-red-600 transition-all shadow-md"
              >
                Logout
              </button>
            </div>
          </div>

          {/* MY LIST BOX */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h1 className="text-2xl md:text-3xl font-light uppercase tracking-wider text-slate-800">
                My List
              </h1>
              <button
                onClick={() => navigate("/add")}
                className="bg-[#fece51] px-5 py-2 rounded-md font-medium hover:bg-yellow-400 transition-all shadow-sm"
              >
                Create New Post
              </button>
            </div>

            {userPostsError && (
              <p className="text-red-500 bg-red-50 p-3 rounded-md text-sm border border-red-200">
                {userPostsError}
              </p>
            )}

            <div className="flex flex-col gap-8">
              {loadingUserPosts ? (
                <p className="text-gray-400 italic text-center py-6">Loading your posts...</p>
              ) : userPosts.length > 0 ? (
                userPosts.map((item) => <Card key={item.id} item={item} />)
              ) : (
                <p className="text-gray-400 italic text-center py-10 bg-slate-50 rounded-lg border-2 border-dashed">
                  No posts yet. Start by creating one!
                </p>
              )}
            </div>
          </div>

          {/* SAVED LIST BOX */}
          <div className="flex flex-col gap-8 pb-10">
            <div className="flex items-center justify-between border-b pb-4">
              <h1 className="text-2xl md:text-3xl font-light uppercase tracking-wider text-slate-800">
                Saved List
              </h1>
            </div>

            {savedPostsError && (
              <p className="text-red-500 bg-red-50 p-3 rounded-md text-sm border border-red-200">
                {savedPostsError}
              </p>
            )}

            <div className="flex flex-col gap-8">
              {loadingSavedPosts ? (
                <p className="text-gray-400 italic text-center py-6">Loading saved items...</p>
              ) : savedPosts.length > 0 ? (
                savedPosts.map((item) =>
                  item.post ? <Card key={item.id} item={item.post} /> : null
                )
              ) : (
                <p className="text-gray-400 italic text-center py-10 bg-slate-50 rounded-lg border-2 border-dashed">
                  Aapne koi post abhi tak save nahi ki.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT SIDE CHAT LAYER (UPDATED & FIXED) ─── */}
      <div className="flex flex-[2] bg-[#fcf5f3] h-full flex-col border-l border-[#f7deda] relative">
        
        {/* CHAT INTERFACE MODE SWITCHER */}
        {!activeChat ? (
          <>
            {/* 1. Inbox User List View */}
            <div className="p-5 font-light text-2xl border-b border-[#f7deda] bg-white">
              Messages
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {conversations.map((chat) => {
                const lastMsg = chat.messages[chat.messages.length - 1];
                return (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className="bg-white p-4 rounded-xl flex items-center gap-4 shadow-sm hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100"
                  >
                    <img
                      src={chat.avatar}
                      alt={chat.username}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold block text-slate-800 text-base">{chat.username}</span>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {lastMsg ? lastMsg.text : "No messages yet"}
                      </p>
                    </div>
                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full shrink-0"></div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* 2. Active Individual Chat Thread View */}
            <div className="p-4 border-b border-[#f7deda] bg-white flex items-center gap-3 shadow-sm">
              {/* Arrow Back Button */}
              <button
                onClick={() => setActiveChat(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-all text-slate-600 font-bold"
                title="Go Back"
              >
                ← Back
              </button>
              
              <img
                src={activeChat.avatar}
                alt={activeChat.username}
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-bold text-slate-800">{activeChat.username}</span>
            </div>

            {/* Message History Thread */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-stone-50/50">
              {activeChat.messages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 max-w-[75%] rounded-xl text-sm shadow-sm ${
                        isMe
                          ? "bg-[#fece51] text-slate-800 rounded-tr-none"
                          : "bg-white text-slate-700 border rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Message Footer Box */}
            <div className="p-3 border-t border-[#f7deda] bg-white flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 text-sm px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#fece51] transition-all"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#fece51] hover:bg-yellow-400 px-5 py-2.5 rounded-lg font-bold text-sm text-slate-800 transition-all active:scale-95"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default ProfilePage;