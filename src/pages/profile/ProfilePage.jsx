import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] overflow-hidden">
      
      {/* LEFT SIDE: USER DETAILS (FLEX 3) */}
      <div className="flex-[3] p-10 overflow-y-auto">
        <div className="max-w-[600px] flex flex-col gap-10">
          
          {/* USER INFORMATION BOX */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-light uppercase">User Information</h1>
              <button className="bg-[#fece51] px-6 py-2 rounded-md font-medium hover:bg-yellow-400 transition-all">
                Update Profile
              </button>
            </div>

            <div className="flex flex-col gap-4 text-lg">
              <span className="flex items-center gap-4">
                <b>Avatar:</b>
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                  alt="user" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              </span>
              <span><b>Username:</b> John Doe</span>
              <span><b>E-mail:</b> john@gmail.com</span>
              
              <button className="bg-red-500 text-white px-6 py-2 rounded-md font-medium w-max mt-4 hover:bg-red-600 transition-all">
                Logout
              </button>
            </div>
          </div>

          {/* SECOND BOX: USER LISTS (Optional/Placeholder) */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-light uppercase">My List</h1>
              <button className="bg-[#fece51] px-6 py-2 rounded-md font-medium hover:bg-yellow-400">
                Create New Post
              </button>
            </div>
            {/* List items yahan ayenge */}
            <p className="text-gray-400 italic">No posts yet...</p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: CHAT SYSTEM (FLEX 2) */}
      <div className="flex-[2] bg-[#fcf5f3] h-full flex flex-col">
        <div className="p-5 font-light text-2xl border-b border-[#f7deda]">
           Messages
        </div>
        
        {/* CHAT LIST AREA */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Example Chat Item */}
          <div className="bg-white p-5 rounded-lg flex items-center gap-5 cursor-pointer shadow-sm hover:shadow-md transition-all">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
              alt="" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-bold">Jane Doe</span>
            <p className="text-sm text-gray-500 truncate">Hello! Is this property still available?</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg flex items-center gap-5 cursor-pointer opacity-70">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
              alt="" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-bold">Agent Smith</span>
            <p className="text-sm text-gray-500 truncate">We can schedule a visit tomorrow.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;