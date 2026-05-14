import React from "react";

const ProfileUpdate = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT SIDE: UPDATE PROFILE FORM */}
      <div className="flex-[3] flex flex-col justify-center items-center px-10 bg-white">
        <div className="max-w-[400px] w-full">
          <h1 className="text-4xl font-bold mb-8">Update Profile</h1>

          <form className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Username"
              className="p-5 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
            />
            <input
              type="email"
              placeholder="Email"
              className="p-5 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
            />
            <input
              type="password"
              placeholder="New Password"
              className="p-5 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
            />

            <button
              type="submit"
              className="bg-[#51c7fec4] p-5 rounded-md font-bold text-lg  cursor-pointer mt-2"
            >
              Update
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: IMAGE & UPLOAD SECTION */}
      <div
        className="
          hidden
          md:flex
          flex-[2]
          bg-[#fcf5f3]
          relative
          overflow-hidden
          -mt-[100px]
          h-[calc(100vh+100px)]
          flex-col
          items-center
          justify-center
          gap-6
        "
      >
        {/* Dummy Profile Photo */}
        <div className="w-40 h-40 rounded-full bg-gray-300 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="dummy profile"
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        {/* Upload Button */}
        <label className="bg-[#51c7fe]  text-white px-6 py-3 rounded-md cursor-pointer hover:bg-gray-800 transition-all font-medium">
          Upload Photo
          <input type="file" className="hidden" />
        </label>
        
        {/* Background Decorative Image (Optional - Overlayed) */}
        <img
          src="/bg.png"
          alt="hero"
          className="
            absolute
            top-0
            right-[-15%]
            h-full
            max-w-none
            object-cover
            scale-110
            z-[-1]
            opacity-30
          "
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
