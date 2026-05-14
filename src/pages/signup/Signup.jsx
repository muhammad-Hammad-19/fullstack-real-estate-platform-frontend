import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3800/api/auth/register",
        {
          username,
          email,
          password,
        },
      );
      
      if (response.data.success) {
        console.log("Registration Successful:", response.data);

        // Signup ke baad login page par bhej rahe hain
        navigate("/auth/login");
      }
    } catch (err) {
      console.error(
        "Signup Error:",
        err.response?.data?.message || err.message,
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-[3] flex flex-col justify-center items-center px-10 bg-white">
        <div className="max-w-[400px] w-full">
          <h1 className="text-4xl font-bold mb-8">Create an Account</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="p-5 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
              required
            />

            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="p-5 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
              required
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="p-5 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
              required
            />

            <button
              type="submit"
              className="bg-[#fece51] p-5 rounded-md font-bold text-lg hover:bg-yellow-400 transition-all cursor-pointer mt-2"
            >
              Register
            </button>

            <p className="text-gray-600 text-center mt-2">
              Do you have an account?{" "}
              <a
                href="/login"
                className="text-black font-semibold underline hover:text-gray-700"
              >
                Login
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

export default Signup;
