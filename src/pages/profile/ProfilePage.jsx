import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotificationStore } from "../../lib/notificationStore";
import Card from "../../components/card/Card";
import {
  MessageSquare,
  ArrowLeft,
  LogOut,
  User as UserIcon,
  Plus,
  Settings,
  Bookmark,
  FileText,
  Send,
  ShieldCheck,
} from "lucide-react";
import { socket } from "../../socket";
import { format } from "timeago.js";
import { useUser } from "../../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useUser();
  const userId = currentUser?.id || currentUser?.userId || currentUser?._id;

  const decreaseNotification = useNotificationStore((state) => state.decrease);
  const increaseNotification = useNotificationStore((state) => state.increase);

  const [userPosts, setUserPosts] = useState([]);
  const [loadingUserPosts, setLoadingUserPosts] = useState(true);
  const [userPostsError, setUserPostsError] = useState("");

  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingSavedPosts, setLoadingSavedPosts] = useState(true);

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);

  const messagesEndRef = useRef(null);

  // Auto Scroll Engine
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // Protected Route Check
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  // Identity Registration Hook
  useEffect(() => {
    if (userId && socket) {
      console.log("⚡ Registering identity on socket server:", userId);
      socket.emit("register", userId);
    }
  }, [userId]);

  // ⚡ LIVE WIRE INTERCEPTOR
  useEffect(() => {
    if (!socket) return;

    const handleLiveIncoming = (data) => {
      console.log("📩 Live Message Intercepted on Frontend:", data);
      if (!data || !data.chatId) return;

      setActiveChat((latestActiveChat) => {
        if (!latestActiveChat) {
          increaseNotification();
          return null;
        }

        const currentChatWindowId = latestActiveChat.id || latestActiveChat._id;
        const isCurrentChat =
          String(currentChatWindowId) === String(data.chatId);

        if (isCurrentChat) {
          const currentMessages = latestActiveChat.messages || [];
          const alreadyExists = currentMessages.some(
            (m) => String(m.id || m._id) === String(data.id || data._id),
          );

          if (alreadyExists) return latestActiveChat;

          return {
            ...latestActiveChat,
            messages: [...currentMessages, data],
          };
        } else {
          increaseNotification();
          return latestActiveChat;
        }
      });

      // Update the left conversation panel in real-time
      setConversations((prevInbox) =>
        prevInbox.map((chatItem) => {
          const chatItemId = chatItem.id || chatItem._id;
          if (String(chatItemId) === String(data.chatId)) {
            return {
              ...chatItem,
              lastMessage: data.text,
              seenBy: [data.userId],
            };
          }
          return chatItem;
        }),
      );
    };

    socket.on("getMessage", handleLiveIncoming);

    return () => {
      socket.off("getMessage", handleLiveIncoming);
    };
  }, [increaseNotification]);

  // Fetch Dashboard Core Data
  useEffect(() => {
    if (!currentUser) return;

    const fetchDashboardData = async () => {
      try {
        setLoadingUserPosts(true);
        setLoadingChats(true);

        const [postsRes, savedRes, chatsRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/posts/user/${userId}`, {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/users/savedPosts", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/chats", {
            withCredentials: true,
          }),
        ]);
        
        setUserPosts(
          Array.isArray(postsRes.data.data)
            ? postsRes.data.data
            : postsRes.data,
        );
        setSavedPosts(savedRes.data.data || []);
        setConversations(chatsRes.data || []);
      } catch (err) {
        console.error("Dashboard engine failed:", err);
        setUserPostsError("Data load karne mein koi masla hua hai.");
      } finally {
        setLoadingUserPosts(false);
        setLoadingSavedPosts(false);
        setLoadingChats(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, userId]);

  // 🛠️ FIXED CHAT SELECTION (Preserving Receiver Identity cleanly)
  const handleOpenChat = async (chat) => {
    try {
      const chatId = chat.id || chat._id;
      const isUnread = !chat?.seenBy?.includes(userId);
      const res = await axios.get(`http://localhost:3000/api/chats/${chatId}`, {
        withCredentials: true,
      });

      // Hum explicitly context database logic aur initial receiver reference data ko bind kar rahe hain
      const completeChatData = res.data.data || res.data;
      
      setActiveChat({ 
        ...completeChatData, 
        receiver: chat.receiver || completeChatData.receiver 
      });

      setConversations((prev) =>
        prev.map((c) => {
          const cId = c.id || c._id;
          return cId === chatId
            ? { ...c, seenBy: [...(c.seenBy || []), userId] }
            : c;
        }),
      );

      if (isUnread) {
        decreaseNotification();
        await axios.put(
          `http://localhost:3000/api/chats/read/${chatId}`,
          {},
          { withCredentials: true },
        );
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  // 🛠️ FIXED LIVE TRANSMISSION ENGINE (Targeting specific keys)
  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !activeChat) return;

    const currentActiveChatId = activeChat.id || activeChat._id;

    // Strict Deep Fallback evaluation pattern for modern Node/Mongoose payloads
    const targetReceiverId =
      activeChat.receiver?.id ||
      activeChat.receiver?.userId ||
      activeChat.receiver?._id ||
      (activeChat.users && activeChat.users.find(id => String(id) !== String(userId)));

    if (!targetReceiverId) {
      console.error("❌ Transmission halt: Could not parse target receiver ID context.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/api/messages/${currentActiveChatId}`,
        { text: chatMessage.trim() },
        { withCredentials: true },
      );

      // Extract modern API layout container patterns safely
      const newMsg = res.data.data || res.data;

      if (socket) {
        console.log(`🚀 Emitting payload to secure pipeline node: ${targetReceiverId}`);
        socket.emit("sendMessage", {
          receiverId: String(targetReceiverId),
          data: { ...newMsg, chatId: currentActiveChatId },
        });
      }

      setActiveChat((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), newMsg],
      }));

      setConversations((prev) =>
        prev.map((c) => {
          const cId = c.id || c._id;
          return cId === currentActiveChatId
            ? { ...c, lastMessage: chatMessage.trim(), seenBy: [userId] }
            : c;
        }),
      );

      setChatMessage("");
    } catch (err) {
      console.error("Transmission layout execution failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true },
      );
      updateUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-slate-50/50 w-full text-slate-900 font-sans">
      {/* LEFT PANEL */}
      <div className="flex-[3] p-6 md:p-10 overflow-y-auto bg-white border-r border-slate-100">
        <div className="max-w-[750px] mx-auto flex flex-col gap-14">
          {/* PROFILE CARD */}
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
                  src={currentUser.avatar || "/noavatar.png"}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
                <h2 className="text-xl font-bold tracking-tight text-slate-800">
                  {currentUser.username}
                </h2>
                <p className="text-sm text-slate-400 font-normal">
                  {currentUser.email}
                </p>
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

          {/* MY LISTINGS */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h1 className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> My Listings
              </h1>
              <button
                onClick={() => navigate("/add")}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold text-xs hover:bg-slate-800 transition-all shadow-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>

            {userPostsError && (
              <p className="text-red-600 text-xs">{userPostsError}</p>
            )}

            <div className="grid grid-cols-1 gap-6">
              {loadingUserPosts ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  Loading posts...
                </p>
              ) : userPosts.length > 0 ? (
                userPosts.map((item) => (
                  <Card key={item.id || item._id} item={item} />
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-6 border border-dashed rounded-2xl">
                  No posts yet.
                </p>
              )}
            </div>
          </div>

          {/* SAVED ITEMS */}
          <div className="flex flex-col gap-6 pb-12">
            <div className="border-b border-slate-100 pb-4">
              <h1 className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-slate-400" /> Saved Items
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {loadingSavedPosts ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  Loading saved items...
                </p>
              ) : savedPosts.length > 0 ? (
                savedPosts.map((item) =>
                  item.post ? (
                    <Card key={item.id || item._id} item={item.post} />
                  ) : null,
                )
              ) : (
                <p className="text-sm text-slate-400 text-center py-6 border border-dashed rounded-2xl">
                  Aapne koi post abhi tak save nahi ki.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (CHAT LAYER UI) */}
      <div className="flex flex-[2] bg-slate-50/50 h-full flex-col relative border-l border-slate-200/60 shadow-sm">
        {!activeChat ? (
          <>
            {/* Header Area */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200/60 bg-white">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" /> Messages Inbox
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium tracking-wide">Real-time active handshakes</p>
              </div>
              <span className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1 rounded-lg tracking-wider shadow-sm">
                {conversations.length} OPEN
              </span>
            </div>

            {/* Inbox Contacts Feed */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {loadingChats ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : conversations.length > 0 ? (
                conversations.map((chat) => {
                  const isSeen = chat?.seenBy?.includes(userId);
                  return (
                    <div
                      key={chat.id || chat._id}
                      onClick={() => handleOpenChat(chat)}
                      className={`group p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 cursor-pointer border ${
                        isSeen
                          ? "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
                          : "bg-amber-50/40 border-amber-200 shadow-sm hover:bg-amber-50"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={chat.receiver?.avatar || "/noavatar.png"}
                          alt=""
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-inner"
                        />
                        {!isSeen && (
                          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-400 border-2 border-white rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 truncate group-hover:text-slate-900">
                            {chat.receiver?.username || "Secure Connection"}
                          </span>
                          {!isSeen && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              New
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate mt-1 ${isSeen ? "text-slate-400 font-normal" : "text-slate-700 font-semibold"}`}>
                          {chat.lastMessage || "Click to open active stream..."}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white p-6">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-400">No active network handshakes</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Active Terminal Window Header */}
            <div className="h-20 px-5 border-b border-slate-200/60 bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveChat(null)}
                  className="p-2 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <img
                  src={activeChat.receiver?.avatar || "/noavatar.png"}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                />
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 text-xs block truncate">
                    {activeChat.receiver?.username}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Active Terminal Stream
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Frame Logs Container */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-slate-50/50">
              {activeChat.messages?.map((msg) => {
                const isMe = String(msg.userId) === String(userId);
                return (
                  <div
                    key={msg.id || msg._id}
                    className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3.5 max-w-[72%] rounded-2xl text-xs flex flex-col gap-1.5 transition-all shadow-sm ${
                        isMe
                          ? "bg-slate-900 text-slate-100 rounded-tr-none shadow-slate-900/10"
                          : "bg-white text-slate-800 border border-slate-200/70 rounded-tl-none"
                      }`}
                    >
                      <span className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</span>
                      <span className={`text-[9px] font-medium tracking-tight self-end opacity-60 ${isMe ? "text-slate-300" : "text-slate-400"}`}>
                        {format(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Secure Message Transmission Input Block */}
            <div className="p-4 border-t border-slate-200/60 bg-white flex items-center gap-2.5 shrink-0">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Write your secure message..."
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-4 py-3.5 rounded-xl outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all duration-150"
              />
              <button
                onClick={handleSendMessage}
                className="bg-slate-900 text-white hover:bg-slate-800 active:scale-95 px-5 py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md shrink-0 flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;