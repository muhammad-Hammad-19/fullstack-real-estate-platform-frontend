import React, { useEffect, useState } from "react";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useUser } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const { user, updateUser } = useUser();

  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${user.id}`,
        {
          username,
          email,
          password,
          avatar,
        },
        {
          withCredentials: true,
        },
      );

      console.log("SEND DATA:", {
        username,
        email,
        password,
        avatar,
      });

      if (res.data.success) {
        updateUser(res.data.user);
        navigate("/profile");
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT SIDE */}
      <div className="flex-[3] flex flex-col justify-center items-center px-10 bg-white">
        <div className="max-w-[400px] w-full">
          <h1 className="text-4xl font-bold mb-8">Update Profile</h1>

          <form onSubmit={handleUpdate} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-5 border border-gray-300 rounded-md"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-5 border border-gray-300 rounded-md"
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-5 border border-gray-300 rounded-md"
            />

            <button
              type="submit"
              className="bg-[#51c7fec4] p-5 rounded-md font-bold"
            >
              Update
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex flex-[2] bg-[#fcf5f3] relative overflow-hidden -mt-[100px] h-[calc(100vh+100px)] flex-col items-center justify-center gap-6">
        {/* PROFILE IMAGE */}
        <div className="w-40 h-40 rounded-full bg-gray-300 border-4 border-white shadow-lg overflow-hidden">
          <img
            src={
              avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* UPLOAD BUTTON */}
        <UploadWidget setAvatar={setAvatar} />

        {/* BACKGROUND */}
        <img
          src="/bg.png"
          alt="hero"
          className="absolute top-0 right-[-15%] h-full object-cover opacity-30 z-[-1]"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
