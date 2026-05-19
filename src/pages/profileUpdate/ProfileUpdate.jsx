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
      avatar: user?.avatar || "",
    },
  });

  // Live preview ke liye watch bilkul sahi hai
  const avatar = watch("avatar");

  // CRITICAL FIX: Sirf tab reset karein jab form 'dirty' (bina chere) na ho, taake image change ke baad purana data overwrite na kare
  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
        password: "",
        avatar: user.avatar || "",
      });
    }
  }, [user]); // Baar-baar reset function dependency me lagane se loop hota hai, isko hata diya.

  // Clean and direct state updater from Cloudinary
  const handleAvatarSuccess = (url) => {
    if (url) {
      // shouldDirty toggles state clearly for react-hook-form
      setValue("avatar", url, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      toast.info("📸 New image selected! Save changes to update.", { autoClose: 2000 });
    }
  };

  // ─── SUBMIT HANDLER ───
  const onSubmit = async (data) => {
    try {
      const payload = {
        username: data.username,
        email: data.email,
        avatar: data.avatar || user?.avatar || "",
        ...(data.password && { password: data.password }),
      };

      const res = await axios.put(
        `http://localhost:3000/api/users/${userId}`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success || res.status === 200) {
        // Response se aaya hua updated user object pakrein
        const updatedUserData = res.data.user || res.data.data || payload;
        
        // 1. Context Global state update karein
        updateUser(updatedUserData);

        // 2. LocalStorage ko force-sync karein taake refresh par purana data na khule
        const currentLocal = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...currentLocal, ...updatedUserData }));
        
        toast.success("Profile updated successfully! 🌟", {
          position: "top-right",
          autoClose: 2000,
        });

        // Choti si delay taake context set ho sake dynamic transitions me
        setTimeout(() => {
          navigate("/profile");
        }, 500);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      const msg = err.response?.data?.message || "Failed to update profile details.";
      toast.error(msg, { position: "top-right", autoClose: 4000 });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen overflow-y-auto md:overflow-hidden font-sans text-slate-900 bg-white">
      
      {/* MOBILE AVATAR LAYER */}
      <div className="flex md:hidden flex-col items-center justify-center gap-4 pt-[100px] pb-4 bg-slate-50/60 border-b border-slate-100">
        <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-md overflow-hidden relative">
          <img
            src={avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="user avatar preview"
            className="w-full h-full object-cover"
          />
        </div>
        <UploadWidget setState={handleAvatarSuccess} />
      </div>

      {/* LEFT SIDE FORM WRAPPER */}
      <div className="flex-[3] flex flex-col justify-center items-center px-6 md:px-10 py-10 md:py-0">
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

      {/* DESKTOP AVATAR LAYER */}
      <div className="hidden md:flex flex-[2] bg-slate-50 relative overflow-hidden border-l border-slate-100 h-full flex-col items-center justify-center gap-6">
        <div className="w-36 h-36 rounded-full bg-white border-4 border-white shadow-md overflow-hidden relative group transition-all duration-200 hover:scale-105">
          <img
            src={avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="user avatar preview"
            className="w-full h-full object-cover"
          />
        </div>

        <UploadWidget setState={handleAvatarSuccess} />
        
        <img
          src="/bg.png"
          alt="hero texture background"
          className="absolute top-0 right-[-15%] h-full object-cover opacity-[0.15] z-[-1] pointer-events-none select-none"
        />
      </div>

    </div>
  );
};

export default ProfileUpdate;