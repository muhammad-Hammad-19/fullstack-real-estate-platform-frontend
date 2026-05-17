import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();

  // ─── REACT HOOK FORM SETUP ───
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // ─── HANDLER FOR REGISTRATION ───
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          username: data.username,
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        },
      );

      if (
        response.data.success ||
        response.status === 201 ||
        response.status === 200
      ) {
        console.log("Registration Successful");

        // 🟢 Success Toast Notification
        toast.success("Account created successfully! Please log in. 🎉", {
          position: "top-right",
          autoClose: 3000,
        });

        // Redirecting directly to login route
        navigate("/auth/login");
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";

      // 🔴 Error Toast Notification
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-900 bg-white">
      {/* LEFT SIDE LAYOUT */}
      <div className="flex-[3] flex flex-col justify-center items-center px-6 md:px-10">
        <div className="max-w-[360px] w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Create an Account
            </h1>
            <p className="text-sm text-slate-400">
              Sign up to access platform support features.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* USERNAME INPUT */}
            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: "Username is required!",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                className={`p-4 border text-sm rounded-xl outline-none transition-all ${
                  errors.username
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-slate-900"
                }`}
              />
              {errors.username && (
                <span className="text-[11px] font-semibold text-red-500 px-1">
                  {errors.username.message}
                </span>
              )}
            </div>

            {/* EMAIL INPUT */}
            <div className="flex flex-col gap-1.5">
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", {
                  required: "Email is required!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address format",
                  },
                })}
                className={`p-4 border text-sm rounded-xl outline-none transition-all ${
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-slate-900"
                }`}
              />
              {errors.email && (
                <span className="text-[11px] font-semibold text-red-500 px-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* PASSWORD INPUT */}
            <div className="flex flex-col gap-1.5">
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`p-4 border text-sm rounded-xl outline-none transition-all ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-slate-900"
                }`}
              />
              {errors.password && (
                <span className="text-[11px] font-semibold text-red-500 px-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#fece51] p-4 rounded-xl text-black font-bold text-sm hover:bg-yellow-400 disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-sm mt-2 flex items-center justify-center"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            {/* LOGIN REDIRECT LINK */}
            <p className="text-slate-500 text-xs text-center mt-3">
              Do you have an account?{" "}
              <Link
                to="/auth/login"
                className="text-slate-900 font-semibold underline hover:text-black"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE HERO IMAGE BANNER */}
      <div className="hidden md:block flex-[2] bg-[#fcf5f3] relative overflow-hidden -mt-[100px] h-[calc(100vh+100px)]">
        <img
          src="/bg.png"
          alt="hero image banner"
          className="absolute top-0 right-[-15%] h-full max-w-none object-cover scale-110"
        />
      </div>
    </div>
  );
};

export default Signup;
