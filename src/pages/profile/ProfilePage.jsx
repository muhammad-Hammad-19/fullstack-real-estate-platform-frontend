// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useUser } from "../../context/AuthContext";
// import Card from "../../components/card/Card";

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const { user, updateUser } = useUser();

//   // States
//   const [userPosts, setUserPosts] = useState([]);
//   const [loadingUserPosts, setLoadingUserPosts] = useState(true);
//   const [userPostsError, setUserPostsError] = useState("");

//   const [savedPosts, setSavedPosts] = useState([]);
//   const [loadingSavedPosts, setLoadingSavedPosts] = useState(true);
//   const [savedPostsError, setSavedPostsError] = useState("");

//   // 🔥 CHAT STATES
//   const [activeChat, setActiveChat] = useState(null); // Kis user se chat khuli hai
//   const [chatMessage, setChatMessage] = useState(""); // Input field ke liye
//   const [conversations, setConversations] = useState([
//     {
//       id: "dummy_1",
//       username: "Jane Doe",
//       avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
//       messages: [
//         { id: "m1", sender: "other", text: "Hello! Is this property still available?" },
//         { id: "m2", sender: "me", text: "Yes, it is! When would you like to visit?" }
//       ]
//     },
//     {
//       id: "dummy_2",
//       username: "Ali Khan",
//       avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
//       messages: [
//         { id: "m3", sender: "other", text: "Price mein thoda discount ho sakta hai?" }
//       ]
//     },
//     {
//       id: "dummy_3",
//       username: "Zainab Fatima",
//       avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
//       messages: [
//         { id: "m4", sender: "other", text: "Can you share exact location map link?" }
//       ]
//     }
//   ]);

//   const messagesEndRef = useRef(null);

//   // Chat open hone par automatically down scroll karne ke liye
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [activeChat?.messages]);

//   // Auth guard protection
//   useEffect(() => {
//     if (!user) {
//       navigate("/auth/login");
//     }
//   }, [user, navigate]);

//   // Fetch Data Calls
//   useEffect(() => {
//     if (!user) return;

//     const fetchUserPosts = async () => {
//       try {
//         setLoadingUserPosts(true);
//         setUserPostsError("");

//         const res = await axios.get(
//           `http://localhost:3000/api/posts/user/${user?.userId || user?.id}`,
//           { withCredentials: true }
//         );

//         const data = res.data.data || res.data;
//         setUserPosts(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("My Posts fetch error:", err);
//         setUserPostsError("Aapki posts load karne mein error aaya.");
//       } finally {
//         setLoadingUserPosts(false);
//       }
//     };

//     const fetchSavedPosts = async () => {
//       try {
//         setLoadingSavedPosts(true);
//         setSavedPostsError("");

//         const res = await axios.get(
//           "http://localhost:3000/api/users/savedPosts",
//           { withCredentials: true }
//         );

//         const data = res.data.data || [];
//         setSavedPosts(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Saved Posts fetch error:", err);
//         setSavedPostsError("Saved items load karne mein error aaya.");
//       } finally {
//         setLoadingSavedPosts(false);
//       }
//     };

//     fetchUserPosts();
//     fetchSavedPosts();
//   }, [user]);

//   // 🔥 MESSAGE SEND FUNCTION
//   const handleSendMessage = () => {
//     if (!chatMessage.trim() || !activeChat) return;

//     const newMessage = {
//       id: Date.now().toString(),
//       sender: "me",
//       text: chatMessage.trim()
//     };

//     // Main array update karein
//     const updatedConversations = conversations.map(chat => {
//       if (chat.id === activeChat.id) {
//         return {
//           ...chat,
//           messages: [...chat.messages, newMessage]
//         };
//       }
//       return chat;
//     });

//     setConversations(updatedConversations);
//     setActiveChat(prev => ({
//       ...prev,
//       messages: [...prev.messages, newMessage]
//     }));
//     setChatMessage("");
//   };

//   if (!user) {
//     return <div className="p-10 text-center font-bold">Loading User...</div>;
//   }

//   const handleLogout = () => {
//     updateUser(null);
//     navigate("/");
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] overflow-hidden bg-white w-full">

//       {/* ─── LEFT SIDE CONTENT (Bilkul touch nahi kiya) ─── */}
//       <div className="flex-[3] p-6 md:p-10 overflow-y-auto">
//         <div className="max-w-[700px] flex flex-col gap-12">

//           {/* USER INFORMATION */}
//           <div className="flex flex-col gap-6">
//             <div className="flex items-center justify-between border-b pb-4">
//               <h1 className="text-2xl md:text-3xl font-light uppercase tracking-wider">
//                 User Information
//               </h1>
//               <button
//                 onClick={() => navigate("/profile/update")}
//                 className="bg-[#fece51] px-5 py-2 rounded-md font-medium hover:bg-yellow-400 transition-all shadow-sm"
//               >
//                 Update Profile
//               </button>
//             </div>

//             <div className="flex flex-col gap-4 text-lg text-slate-700">
//               <span className="flex items-center gap-4">
//                 <b className="w-24">Avatar:</b>
//                 <img
//                   src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
//                   alt="user"
//                   className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
//                 />
//               </span>
//               <span className="flex items-center gap-4">
//                 <b className="w-24">Username:</b> {user.username}
//               </span>
//               <span className="flex items-center gap-4">
//                 <b className="w-24">E-mail:</b> {user.email}
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-500 text-white px-6 py-2 rounded-md font-medium w-max mt-4 hover:bg-red-600 transition-all shadow-md"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* MY LIST BOX */}
//           <div className="flex flex-col gap-8">
//             <div className="flex items-center justify-between border-b pb-4">
//               <h1 className="text-2xl md:text-3xl font-light uppercase tracking-wider text-slate-800">
//                 My List
//               </h1>
//               <button
//                 onClick={() => navigate("/add")}
//                 className="bg-[#fece51] px-5 py-2 rounded-md font-medium hover:bg-yellow-400 transition-all shadow-sm"
//               >
//                 Create New Post
//               </button>
//             </div>

//             {userPostsError && (
//               <p className="text-red-500 bg-red-50 p-3 rounded-md text-sm border border-red-200">
//                 {userPostsError}
//               </p>
//             )}

//             <div className="flex flex-col gap-8">
//               {loadingUserPosts ? (
//                 <p className="text-gray-400 italic text-center py-6">Loading your posts...</p>
//               ) : userPosts.length > 0 ? (
//                 userPosts.map((item) => <Card key={item.id} item={item} />)
//               ) : (
//                 <p className="text-gray-400 italic text-center py-10 bg-slate-50 rounded-lg border-2 border-dashed">
//                   No posts yet. Start by creating one!
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* SAVED LIST BOX */}
//           <div className="flex flex-col gap-8 pb-10">
//             <div className="flex items-center justify-between border-b pb-4">
//               <h1 className="text-2xl md:text-3xl font-light uppercase tracking-wider text-slate-800">
//                 Saved List
//               </h1>
//             </div>

//             {savedPostsError && (
//               <p className="text-red-500 bg-red-50 p-3 rounded-md text-sm border border-red-200">
//                 {savedPostsError}
//               </p>
//             )}

//             <div className="flex flex-col gap-8">
//               {loadingSavedPosts ? (
//                 <p className="text-gray-400 italic text-center py-6">Loading saved items...</p>
//               ) : savedPosts.length > 0 ? (
//                 savedPosts.map((item) =>
//                   item.post ? <Card key={item.id} item={item.post} /> : null
//                 )
//               ) : (
//                 <p className="text-gray-400 italic text-center py-10 bg-slate-50 rounded-lg border-2 border-dashed">
//                   Aapne koi post abhi tak save nahi ki.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ─── RIGHT SIDE CHAT LAYER (UPDATED & FIXED) ─── */}
//       <div className="flex flex-[2] bg-[#fcf5f3] h-full flex-col border-l border-[#f7deda] relative">

//         {/* CHAT INTERFACE MODE SWITCHER */}
//         {!activeChat ? (
//           <>
//             {/* 1. Inbox User List View */}
//             <div className="p-5 font-light text-2xl border-b border-[#f7deda] bg-white">
//               Messages
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
//               {conversations.map((chat) => {
//                 const lastMsg = chat.messages[chat.messages.length - 1];
//                 return (
//                   <div
//                     key={chat.id}
//                     onClick={() => setActiveChat(chat)}
//                     className="bg-white p-4 rounded-xl flex items-center gap-4 shadow-sm hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100"
//                   >
//                     <img
//                       src={chat.avatar}
//                       alt={chat.username}
//                       className="w-12 h-12 rounded-full object-cover border border-slate-200"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <span className="font-bold block text-slate-800 text-base">{chat.username}</span>
//                       <p className="text-sm text-gray-500 truncate mt-0.5">
//                         {lastMsg ? lastMsg.text : "No messages yet"}
//                       </p>
//                     </div>
//                     <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full shrink-0"></div>
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         ) : (
//           <>
//             {/* 2. Active Individual Chat Thread View */}
//             <div className="p-4 border-b border-[#f7deda] bg-white flex items-center gap-3 shadow-sm">
//               {/* Arrow Back Button */}
//               <button
//                 onClick={() => setActiveChat(null)}
//                 className="p-1.5 hover:bg-slate-100 rounded-full transition-all text-slate-600 font-bold"
//                 title="Go Back"
//               >
//                 ← Back
//               </button>

//               <img
//                 src={activeChat.avatar}
//                 alt={activeChat.username}
//                 className="w-9 h-9 rounded-full object-cover"
//               />
//               <span className="font-bold text-slate-800">{activeChat.username}</span>
//             </div>

//             {/* Message History Thread */}
//             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-stone-50/50">
//               {activeChat.messages.map((msg) => {
//                 const isMe = msg.sender === "me";
//                 return (
//                   <div
//                     key={msg.id}
//                     className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`p-3 max-w-[75%] rounded-xl text-sm shadow-sm ${
//                         isMe
//                           ? "bg-[#fece51] text-slate-800 rounded-tr-none"
//                           : "bg-white text-slate-700 border rounded-tl-none"
//                       }`}
//                     >
//                       {msg.text}
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Message Footer Box */}
//             <div className="p-3 border-t border-[#f7deda] bg-white flex items-center gap-2">
//               <input
//                 type="text"
//                 value={chatMessage}
//                 onChange={(e) => setChatMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                 placeholder="Type a message..."
//                 className="flex-1 bg-slate-50 text-sm px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#fece51] transition-all"
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="bg-[#fece51] hover:bg-yellow-400 px-5 py-2.5 rounded-lg font-bold text-sm text-slate-800 transition-all active:scale-95"
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//     </div>
//   );
// };

// export default ProfilePage;

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/AuthContext";
import Card from "../../components/card/Card";
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  LogOut, 
  User as UserIcon, 
  Plus, 
  Settings, 
  Bookmark, 
  FileText 
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  // Dashboard & Posts States
  const [userPosts, setUserPosts] = useState([]);
  const [loadingUserPosts, setLoadingUserPosts] = useState(true);
  const [userPostsError, setUserPostsError] = useState("");

  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingSavedPosts, setLoadingSavedPosts] = useState(true);
  const [savedPostsError, setSavedPostsError] = useState("");

  // Chat & Inbox States
  const [conversations, setConversations] = useState([]); 
  const [activeChat, setActiveChat] = useState(null); 
  const [chatMessage, setChatMessage] = useState(""); 
  const [loadingChats, setLoadingChats] = useState(true);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat thread
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // Auth guard protection
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  // ─── 1. FETCH ALL DATA IN PARALLEL (SIMPLIFIED) ───
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setLoadingUserPosts(true);
        setLoadingSavedPosts(true);
        setLoadingChats(true);

        // Saari requests ek sath parallel chalengi
        const [postsRes, savedRes, chatsRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/posts/user/${user?.userId || user?.id}`, { withCredentials: true }),
          axios.get("http://localhost:3000/api/users/savedPosts", { withCredentials: true }),
          axios.get("http://localhost:3000/api/chats", { withCredentials: true })
        ]);

        setUserPosts(Array.isArray(postsRes.data.data) ? postsRes.data.data : postsRes.data);
        setSavedPosts(savedRes.data.data || []);
        setConversations(chatsRes.data);

      } catch (err) {
        console.error("Dashboard data load karne mein error:", err);
        setUserPostsError("Data load karne mein koi masla hua hai.");
      } finally {
        setLoadingUserPosts(false);
        setLoadingSavedPosts(false);
        setLoadingChats(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // ─── 2. CHAT CLICK HANDLER (EASY TO READ) ───
  const handleOpenChat = async (chat) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/chats/${chat?.id}`, { withCredentials: true });
      
      // Active chat set karein aur list se receiver object append kar dein
      setActiveChat({ ...res.data, receiver: chat.receiver });

      // Inbox sidebar list mein is chat ko immediate "seen" mark karein
      const myId = user.id || user.userId;
      const updatedConversations = conversations.map((c) => {
        if (c.id === chat.id) {
          return { ...c, seenBy: [...c.seenBy, myId] };
        }
        return c;
      });
      setConversations(updatedConversations);

    } catch (err) {
      console.error("Chat details lane mein masla hua:", err);
    }
  };

  // ─── 3. MESSAGE SEND FUNCTION (EASY TO READ) ───
  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !activeChat) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/messages/${activeChat.id}`,
        { text: chatMessage.trim() },
        { withCredentials: true }
      );

      const newMsg = res.data;

      // Current open chat thread ko screen par update karein
      setActiveChat((prev) => ({
        ...prev,
        messages: [...prev.messages, newMsg],
      }));

      // Inbox list ka last message sidebar mein update karein
      const myId = user.id || user.userId;
      const updatedConversations = conversations.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            lastMessage: chatMessage.trim(),
            seenBy: [myId],
          };
        }
        return c;
      });
      setConversations(updatedConversations);
      setChatMessage(""); 

    } catch (err) {
      console.error("Message send nahi ho saka:", err);
    }
  };

  const handleLogout = () => {
    updateUser(null);
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden bg-slate-50/50 w-full text-slate-900 font-sans">
      
      {/* ─── LEFT SIDE CONTENT (DASHBOARD & POSTS) ─── */}
      <div className="flex-[3] p-6 md:p-10 overflow-y-auto bg-white border-r border-slate-100">
        <div className="max-w-[750px] mx-auto flex flex-col gap-14">
          
          {/* USER INFORMATION PROFILE CARD */}
          <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
              <h1 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-slate-400" /> User Profile
              </h1>
              <button
                onClick={() => navigate("/profile/update")}
                className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-1.5 rounded-xl font-medium text-xs transition-all shadow-sm flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" /> Update
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="user avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              
              <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
                <h2 className="text-xl font-bold tracking-tight text-slate-800">{user.username}</h2>
                <p className="text-sm text-slate-400 font-normal">{user.email}</p>
                <div className="mt-3 flex justify-center sm:justify-start">
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100/70 px-4 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MY LIST BOX */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h1 className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> My Listings
              </h1>
              <button
                onClick={() => navigate("/post/create")}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold text-xs hover:bg-slate-800 transition-all shadow-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>

            {userPostsError && (
              <p className="text-red-600 bg-red-50/50 p-3 rounded-xl text-xs border border-red-100">{userPostsError}</p>
            )}

            <div className="grid grid-cols-1 gap-6">
              {loadingUserPosts ? (
                <p className="text-xs text-slate-400 italic text-center py-6">Loading posts...</p>
              ) : userPosts.length > 0 ? (
                userPosts.map((item) => <Card key={item.id} item={item} />)
              ) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400">No posts yet. Start by creating one!</p>
                </div>
              )}
            </div>
          </div>

          {/* SAVED LIST BOX */}
          <div className="flex flex-col gap-6 pb-12">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h1 className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-slate-400" /> Saved Items
              </h1>
            </div>

            {savedPostsError && (
              <p className="text-red-600 bg-red-50/50 p-3 rounded-xl text-xs border border-red-100">{savedPostsError}</p>
            )}

            <div className="grid grid-cols-1 gap-6">
              {loadingSavedPosts ? (
                <p className="text-xs text-slate-400 italic text-center py-6">Loading saved items...</p>
              ) : savedPosts.length > 0 ? (
                savedPosts.map((item) => item.post ? <Card key={item.id} item={item.post} /> : null)
              ) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400">Aapne koi post abhi tak save nahi ki.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT SIDE REAL CHAT LAYER (PREMIUM MODERNIZE DESIGN) ─── */}
      <div className="flex flex-[2] bg-slate-50 h-full flex-col relative">
        {!activeChat ? (
          <>
            {/* Inbox User List Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200/60 bg-white">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500" /> Messages
              </h2>
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                {conversations.length} Open
              </span>
            </div>

            {/* Inbox List Container */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {loadingChats ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
                </div>
              ) : conversations.length > 0 ? (
                conversations.map((chat) => {
                  const isSeen = chat?.seenBy?.includes(user.id || user.userId);
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleOpenChat(chat)}
                      className={`group p-3.5 rounded-xl flex items-center gap-4 transition-all duration-200 cursor-pointer border ${
                        isSeen
                          ? "bg-white border-slate-100 hover:border-slate-200/80 hover:shadow-sm"
                          : "bg-white border-amber-200 shadow-[0_2px_12px_rgba(254,206,81,0.08)] hover:border-amber-300"
                      }`}
                    >
                      {/* Avatar Wrapper */}
                      <div className="relative shrink-0">
                        <img
                          src={chat.receiver?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                          alt={chat.receiver?.username}
                          className={`w-10 h-10 rounded-full object-cover border p-0.5 ${
                            isSeen ? "border-slate-100" : "border-amber-400"
                          }`}
                        />
                        {!isSeen && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 border-2 border-white rounded-full" />
                        )}
                      </div>

                      {/* Info block */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <span className={`text-xs tracking-tight truncate block ${isSeen ? "font-semibold text-slate-700" : "font-bold text-slate-900"}`}>
                            {chat.receiver?.username || "Unknown User"}
                          </span>
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${isSeen ? "text-slate-400" : "text-slate-900 font-medium"}`}>
                          {chat.lastMessage || "Click to start conversation"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                  <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-400">No conversations yet</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Active Individual Chat Header */}
            <div className="h-16 px-4 border-b border-slate-200/60 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveChat(null)}
                  className="p-2 hover:bg-slate-50 text-slate-500 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-slate-200" />

                <img
                  src={activeChat.receiver?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={activeChat.receiver?.username}
                  className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 text-xs block truncate">
                    {activeChat.receiver?.username}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active Now
                  </span>
                </div>
              </div>
            </div>

            {/* Message History Thread */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/50">
              {activeChat.messages?.map((msg) => {
                const isMe = msg.userId === (user.id || user.userId);
                return (
                  <div
                    key={msg.id}
                    className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 max-w-[75%] rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-slate-900 text-white rounded-tr-none"
                          : "bg-white text-slate-800 border border-slate-200/60 rounded-tl-none"
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
            <div className="p-4 border-t border-slate-200/60 bg-white shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:border-slate-400 focus-within:bg-white transition-all duration-150">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-xs px-2.5 py-2 outline-none text-slate-800 placeholder-slate-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-lg transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;