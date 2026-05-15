import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { updateUser } = useUser();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success) {
        // Context update
        updateUser(res.data.data);

        console.log("Login Successful!");

        navigate("/profile");
      }
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-[3] flex flex-col justify-center items-center px-10 bg-white">
        <div className="max-w-[400px] w-full">
          <h1 className="text-4xl font-bold mb-8">Welcome back</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="p-5 border border-gray-300 rounded-md outline-none focus:border-black"
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="p-5 border border-gray-300 rounded-md outline-none focus:border-black"
              required
            />

            <button
              type="submit"
              className="bg-[#fece51] p-5 rounded-md text-black font-bold text-lg hover:bg-yellow-400 transition-all"
            >
              Login
            </button>

            <p className="text-gray-600 text-center mt-2">
              Don't you have an account?{" "}
              <a
                href="/auth/signup"
                className="text-black font-semibold underline"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hidden md:block flex-[2] bg-[#fcf5f3] relative overflow-hidden -mt-[100px] h-[calc(100vh+100px)]">
        <img
          src="/bg.png"
          alt="hero"
          className="absolute top-0 right-[-15%] h-full max-w-none object-cover scale-110"
        />
      </div>
    </div>
  );
};

export default Login;
