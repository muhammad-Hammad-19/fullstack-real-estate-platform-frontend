import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register", // backend port check karo
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        console.log("Registration Successful");

        // login page par redirect
        navigate("/auth/login");
      }
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT SIDE */}
      <div className="flex-[3] flex flex-col justify-center items-center px-10 bg-white">
        <div className="max-w-[400px] w-full">
          <h1 className="text-4xl font-bold mb-8">Create an Account</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* USERNAME */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-4 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
              required
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-4 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
              required
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-4 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
              required
            />

            {/* ERROR MESSAGE */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#fece51] p-4 rounded-md font-bold text-lg hover:bg-yellow-400 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* LOGIN LINK */}
            <p className="text-gray-600 text-center mt-2">
              Do you have an account?{" "}
              <Link
                to="/auth/login"
                className="text-black font-semibold underline hover:text-gray-700"
              >
                Login
              </Link>
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
