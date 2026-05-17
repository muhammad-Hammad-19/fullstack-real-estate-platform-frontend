import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../context/AuthContext";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "react-toastify/dist/ReactToastify.css";

const ProfileUpdate = () => {
  const { user, updateUser } = useUser();
  const userId = user?.id || user?.userId;
  const navigate = useNavigate();

  // ─── REACT HOOK FORM SETUP ───
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
    },
  });

  // Watch avatar state value live
  const avatar = watch("avatar") || user?.avatar || "";

  // Sync state if user reloads or context populates late
  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user, reset]);

  // Callback wrapper for the Cloudinary UploadWidget component
  const handleAvatarSuccess = (url) => {
    setValue("avatar", url, { shouldValidate: true });
    toast.info("New image uploaded! Click update to save changes.", { autoClose: 2000 });
  };

  // ─── SUBMIT HANDLER ───
  const onSubmit = async (data) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${userId}`,
        {
          username: data.username,
          email: data.email,
          avatar: data.avatar || user?.avatar || "",
          // Agar password khali hai toh bhejoji mat taake backend par update na ho
          ...(data.password && { password: data.password }),
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success || res.status === 200) {
        // Context update globally
        updateUser(res.data.user || res.data.data);
        
        toast.success("Profile updated successfully! 🌟", {
          position: "top-right",
          autoClose: 3000,
        });
        
        navigate("/profile");
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      const msg = err.response?.data?.message || "Failed to update profile details.";
      toast.error(msg, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-900 bg-white">
      {/* LEFT SIDE FORM WRAPPER */}
      <div className="flex-[3] flex flex-col justify-center items-center px-6 md:px-10">
        <div className="max-w-[360px] w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Update Profile</h1>
            <p className="text-sm text-slate-400">Modify your personal account credentials.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            {/* USERNAME FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 px-0.5">Username</label>
              <input
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: "Username is required!",
                  minLength: { value: 3, message: "Username must be at least 3 characters" },
                })}
                className={`p-4 border text-sm rounded-xl outline-none transition-all ${
                  errors.username ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-slate-900"
                }`}
              />
              {errors.username && (
                <span className="text-[11px] font-semibold text-red-500 px-1">{errors.username.message}</span>
              )}
            </div>

            {/* EMAIL FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 px-0.5">Email Address</label>
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", {
                  required: "Email is required!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address style format",
                  },
                })}
                className={`p-4 border text-sm rounded-xl outline-none transition-all ${
                  errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-slate-900"
                }`}
              />
              {errors.email && (
                <span className="text-[11px] font-semibold text-red-500 px-1">{errors.email.message}</span>
              )}
            </div>

            {/* NEW PASSWORD FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 px-0.5">New Password (Optional)</label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                {...register("password", {
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className={`p-4 border text-sm rounded-xl outline-none transition-all ${
                  errors.password ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-slate-900"
                }`}
              />
              {errors.password && (
                <span className="text-[11px] font-semibold text-red-500 px-1">{errors.password.message}</span>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#fece51] hover:bg-yellow-400 disabled:bg-slate-100 disabled:text-slate-400 p-4 rounded-xl font-bold text-sm transition-all shadow-sm mt-2 flex items-center justify-center"
            >
              {isSubmitting ? "Saving changes..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE AVATAR LAYER */}
      <div className="hidden md:flex flex-[2] bg-slate-50 relative overflow-hidden border-l border-slate-100 h-full flex-col items-center justify-center gap-6">
        {/* PROFILE AVATAR DISPLAY */}
        <div className="w-36 h-36 rounded-full bg-white border-4 border-white shadow-md overflow-hidden relative group transition-all duration-200 hover:scale-105">
          <img
            src={avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="user avatar preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* UPLOAD WIDGET TRIGGER */}
        <UploadWidget setAvatar={handleAvatarSuccess} />

        {/* BACKGROUND SUBTLE VECTOR TEXTURE */}
        <img
          src="/bg.png"
          alt="hero texture background"
          className="absolute top-0 right-[-15%] h-full object-cover opacity-[0.15] z-[-1] pointer-events-none select-none animate-pulse-slow"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;