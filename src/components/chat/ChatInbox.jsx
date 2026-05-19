import { useContext, useEffect, useRef, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { useUser } from "../../context/SocketContext"; // 🎯 Aapka unified hook
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats: initialChats }) {
  const [conversations, setConversations] = useState(initialChats || []);
  const [chat, setChat] = useState(null);

  // ✅ FIX: Ek hi line mein safely custom hook ko call kar ke values nikal lein
  const { user: currentUser, socket } = useUser(); 
  
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);
  const increase = useNotificationStore((state) => state.increase);

  useEffect(() => {
    setConversations(initialChats || []);
  }, [initialChats]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (data) => {
      const isCurrentChatOpen = chat && chat.id === data.chatId;

      if (isCurrentChatOpen) {
        setChat((prev) => ({
          ...prev,
          messages: [...prev.messages, data],
        }));
        apiRequest
          .put("/chats/read/" + chat.id)
          .catch((err) => console.log(err));
      } else {
        increase();
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === data.chatId) {
            return {
              ...c,
              lastMessage: data.text,
              seenBy: isCurrentChatOpen ? [currentUser.id] : [],
            };
          }
          return c;
        }),
      );
    };

    socket.on("getMessage", handleIncomingMessage);

    return () => {
      socket.off("getMessage", handleIncomingMessage);
    };
  }, [socket, chat, currentUser?.id, increase]); // Added optional chaining safe-guard

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, seenBy: [...c.seenBy, currentUser.id] } : c,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();

      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: { ...res.data, chatId: chat.id },
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === chat.id
            ? { ...c, lastMessage: text, seenBy: [currentUser.id] }
            : c,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent">
      {/* 1. INBOX MESSAGES PANEL */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
        <h1 className="text-xl font-light text-slate-800 tracking-tight px-1">
          Messages
        </h1>

        {conversations?.map((c) => {
          const isSeen = c.seenBy.includes(currentUser?.id) || chat?.id === c.id;
          return (
            <div
              key={c.id}
              onClick={() => handleOpenChat(c.id, c.receiver)}
              className={`p-5 rounded-xl flex items-center gap-5 cursor-pointer transition-all border ${
                isSeen
                  ? "bg-white border-slate-100 hover:border-slate-200/80 shadow-sm"
                  : "bg-amber-50/50 border-amber-200 shadow-sm hover:bg-amber-50"
              }`}
            >
              <img
                src={c.receiver.avatar || "/noavatar.jpg"}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {c.receiver.username}
                </span>
                <p
                  className={`text-xs truncate mt-1 ${isSeen ? "text-slate-400 font-normal" : "text-slate-700 font-semibold"}`}
                >
                  {c.lastMessage || "No connection transmissions yet..."}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. DYNAMIC CHAT BOX ELEMENT */}
      {chat && (
        <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between mt-6 overflow-hidden min-h-[480px]">
          {/* HEADER TOP CONSOLE */}
          <div className="bg-amber-50/70 border-b border-amber-100 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <img
                src={chat.receiver.avatar || "/noavatar.jpg"}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                {chat.receiver.username}
              </span>
            </div>
            <span
              onClick={() => setChat(null)}
              className="text-slate-400 hover:text-slate-700 font-bold text-xs cursor-pointer bg-white border border-slate-200/60 shadow-sm w-6 h-6 rounded-lg flex items-center justify-center transition-all"
            >
              ✕
            </span>
          </div>

          {/* MESSAGES CENTER BOARD */}
          <div className="h-[350px] overflow-y-auto p-5 flex flex-col gap-4 bg-slate-50/30">
            {chat.messages.map((message) => {
              const isMe = message.userId === currentUser?.id;
              return (
                <div
                  key={message.id}
                  className={`flex flex-col max-w-[70%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-slate-900 text-white rounded-tr-none"
                        : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium mt-1.5 px-1 bg-amber-100/40 text-amber-800 px-1.5 py-0.5 rounded-md self-start">
                    {format(message.createdAt)}
                  </span>
                </div>
              );
            })}
            <div ref={messageEndRef}></div>
          </div>

          {/* CHAT FIELD INPUT DISPATCH */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200/60 h-16 flex items-center justify-between px-3 bg-white gap-3 shrink-0"
          >
            <textarea
              name="text"
              placeholder="Type message response..."
              className="flex-[3] h-10 max-h-10 bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 outline-none placeholder-slate-400 focus:border-slate-300 focus:bg-white transition-all resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.target.form.requestSubmit();
                }
              }}
            />
            <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white h-10 px-4 rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;