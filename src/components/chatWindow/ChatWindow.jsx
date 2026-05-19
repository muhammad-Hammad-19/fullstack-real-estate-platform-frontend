import { ArrowLeft, ShieldCheck, Send } from "lucide-react";
import { format } from "timeago.js";

const ChatWindow = ({ 
  activeChat, 
  chatMessage, 
  setChatMessage, 
  onSendMessage, 
  onCloseChat, 
  userId, 
  messagesEndRef 
}) => {
  return (
    <>
      {/* Active Terminal Window Header */}
      <div className="h-20 px-5 border-b border-slate-200/60 bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onCloseChat}
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
          onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
          placeholder="Write your secure message..."
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-4 py-3.5 rounded-xl outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all duration-150"
        />
        <button
          onClick={onSendMessage}
          className="bg-slate-900 text-white hover:bg-slate-800 active:scale-95 px-5 py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md shrink-0 flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="w-3 h-3" />
        </button>
      </div>
    </>
  );
};

export default ChatWindow;