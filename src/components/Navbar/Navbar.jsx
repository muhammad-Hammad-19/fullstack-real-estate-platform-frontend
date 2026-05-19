import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/AuthContext"; // Aapka bataya hua custom context hook
import { useNotificationStore } from "../../lib/notificationStore";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, socket } = useUser(); // Context se safely user aur socket dono nikal liye

  const fetchChats = useNotificationStore((state) => state.fetchChats);
  const number = useNotificationStore((state) => state.number);
  const initSocketListener = useNotificationStore((state) => state.initSocketListener);

  console.log("🎯 Current Notification Number in Navbar:", number);

  // Synchronize state lifecycle and socket registration
  useEffect(() => {
    if (user) {
      fetchChats();
    }
    if (user && socket) {
      initSocketListener(socket); // Socket register ho gaya store mein safely
    }
  }, [user, socket, fetchChats, initSocketListener]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[80px] bg-white z-[999] border-b border-slate-100">
        <div className="max-w-[1400px] h-full mx-auto px-5 md:px-10 lg:px-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
              <img src="/logo.png" alt="logo" className="w-8 h-8" />
              <span className="hidden sm:block text-slate-800 tracking-tight">
                EmmaEstate
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
              <Link to="/" className="hover:text-[#fece51] transition">
                Home
              </Link>
              <Link to="/about" className="hover:text-[#fece51] transition">
                About
              </Link>
              <Link to="/contact" className="hover:text-[#fece51] transition">
                Contact
              </Link>
              <Link to="/agents" className="hover:text-[#fece51] transition">
                Agents
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {user ? (
              <div className="flex items-center gap-5">
                <div className="hidden md:flex items-center gap-3">
                  <img
                    src={user.avatar || "/noavatar.png"}
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <span className="font-semibold text-sm text-slate-700">
                    {user.username}
                  </span>
                </div>

                <Link
                  to="/profile"
                  className="relative bg-[#fece51] text-slate-800 px-6 py-2.5 rounded-md font-bold text-sm shadow-sm hover:bg-yellow-400 transition-all active:scale-95"
                >
                  Profile
                  {number > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                      {number}
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6 font-bold text-sm">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-[#fece51] text-slate-800 px-6 py-2.5 rounded-md hover:bg-yellow-400 transition-all shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            <div className="md:hidden z-[1001] flex items-center">
              <img
                src={open ? "/close.png" : "/menu.png"}
                alt="menu"
                className="w-7 h-7 cursor-pointer object-contain"
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE PANEL SYSTEM */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] sm:w-[50%] bg-slate-900 text-white z-[1000] flex flex-col items-center justify-center gap-8 font-semibold text-lg transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link to="/" onClick={() => setOpen(false)} className="hover:text-[#fece51] transition">Home</Link>
        <Link to="/about" onClick={() => setOpen(false)} className="hover:text-[#fece51] transition">About</Link>
        <Link to="/contact" onClick={() => setOpen(false)} className="hover:text-[#fece51] transition">Contact</Link>
        <Link to="/agents" onClick={() => setOpen(false)} className="hover:text-[#fece51] transition">Agents</Link>
        <hr className="w-1/2 border-slate-700 my-2" />
        {user ? (
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="relative bg-[#fece51] text-slate-900 px-8 py-3 rounded-md font-bold text-sm flex items-center gap-2"
          >
            Profile View
            {number > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
                {number}
              </span>
            )}
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full px-10">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2 border border-slate-700 rounded-md hover:bg-slate-800 text-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2 bg-[#fece51] text-slate-900 rounded-md text-sm font-bold"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;