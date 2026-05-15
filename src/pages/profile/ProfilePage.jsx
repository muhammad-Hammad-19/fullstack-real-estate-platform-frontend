import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/AuthContext";
import Card from "../../components/card/Card";
import { listData } from "../../lib/dummydata";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);
  
  if (!user)
    return <div className="p-10 text-center font-bold">Loading...</div>;

  const handleLogout = () => {
    updateUser(null);
    navigate("/");
  };
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] overflow-hidden bg-white">
      {/* LEFT SIDE: USER DETAILS & LISTS */}
      <div className="flex-[3] p-6 md:p-10 overflow-y-auto">
        <div className="max-w-[700px] flex flex-col gap-12">
          {/* USER INFORMATION BOX */}
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
                  src={
                    user.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
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
                className="bg-red-500 text-white px-6 py-2 rounded-md font-medium w-max mt-4 hover:bg-red-600 transition-all shadow-md active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>

          {/* MY LIST BOX */}
          <div className="flex flex-col gap-8 pb-10">
            <div className="flex items-center justify-between border-b pb-4">
              <h1 className="text-2xl md:text-3xl font-light uppercase tracking-wider">
                My List
              </h1>
              <button
                onClick={() => navigate("/add")}
                className="bg-[#fece51] px-5 py-2 rounded-md font-medium hover:bg-yellow-400 transition-all shadow-sm"
              >
                Create New Post
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {listData.length > 0 ? (
                //  Yahan pe 'item={item}' fix kar diya hai
                listData.map((item) => <Card key={item.id} item={item} />)
              ) : (
                <p className="text-gray-400 italic text-center py-10 bg-slate-50 rounded-lg border-2 border-dashed">
                  No posts yet. Start by creating one!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: CHAT SYSTEM */}
      <div className="hidden md:flex flex-[2] bg-[#fcf5f3] h-full flex-col border-l border-[#f7deda]">
        <div className="p-5 font-light text-2xl border-b border-[#f7deda] bg-white/50">
          Messages
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-xl flex items-center gap-5 cursor-pointer shadow-sm hover:shadow-md transition-all hover:translate-x-1">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="chat-user"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <span className="font-bold block text-slate-800">Jane Doe</span>
              <p className="text-sm text-gray-500 truncate w-48">
                Hello! Is this property still available?
              </p>
            </div>
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
