import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, socket } = useUser();

  const fetchChats = useNotificationStore((state) => state.fetchChats);
  const number = useNotificationStore((state) => state.number);
  const initSocketListener = useNotificationStore(
    (state) => state.initSocketListener,
  );

  useEffect(() => {
    if (user) fetchChats();
    if (user && socket) initSocketListener(socket);
  }, [user, socket, fetchChats, initSocketListener]);

  return (
    <>
      {/* MAIN NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-[70px] md:h-[80px] bg-white z-[999] border-b border-slate-100 backdrop-blur-md bg-white/90">
        <div className="max-w-[1400px] h-full mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-12">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl md:text-2xl shrink-0"
            >
              <img
                src="/logo.png"
                alt="logo"
                className="w-7 h-7 md:w-8 md:h-8 object-contain"
              />
              <span className="text-slate-800 tracking-tight">EmmaEstate</span>
            </Link>

            <div className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-sm lg:text-base text-slate-600">
              <Link
                to="/"
                className="hover:text-[#fece51] transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-[#fece51] transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="hover:text-[#fece51] transition-colors duration-200"
              >
                Contact
              </Link>
              <Link
                to="/agents"
                className="hover:text-[#fece51] transition-colors duration-200"
              >
                Agents
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-5">
            {user ? (
              <div className="flex items-center gap-3 md:gap-5">
                <div className="hidden sm:flex items-center gap-2.5">
                  <img
                    src={user.avatar || "/noavatar.png"}
                    alt="user"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-slate-200"
                  />
                  <span className="font-semibold text-xs md:text-sm text-slate-700 max-w-[100px] truncate">
                    {user.username}
                  </span>
                </div>

                <Link
                  to="/profile"
                  className="relative bg-[#fece51] text-slate-800 px-4 py-2 md:px-6 md:py-2.5 rounded-md font-bold text-xs md:text-sm shadow-sm hover:bg-yellow-400 transition-all active:scale-95"
                >
                  Profile
                  {number > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-[9px] md:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                      {number}
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-5 font-bold text-sm">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-[#fece51] text-slate-800 px-5 py-2 rounded-md hover:bg-yellow-400 transition-all shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger Menu Icon */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-1.5 z-[1001] rounded-md hover:bg-slate-50 transition-colors"
            >
              <img
                src="/menu.png"
                alt="open menu"
                className="w-6 h-6 object-contain"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE PANEL SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-slate-900 text-white z-[1002] flex flex-col pt-24 px-6 gap-6 font-semibold text-base transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ❌ Dedicated Close Button Inside Mobile Menu */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all"
        >
          X
        </button>

        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="hover:text-[#fece51] transition py-1 border-b border-slate-800/50"
        >
          Home
        </Link>
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="hover:text-[#fece51] transition py-1 border-b border-slate-800/50"
        >
          About
        </Link>
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="hover:text-[#fece51] transition py-1 border-b border-slate-800/50"
        >
          Contact
        </Link>
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="hover:text-[#fece51] transition py-1 border-b border-slate-800/50"
        >
          Agents
        </Link>

        <div className="mt-auto mb-10 w-full">
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-lg">
                <img
                  src={user.avatar || "/noavatar.png"}
                  alt="user avatar"
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <span className="font-bold text-sm truncate">
                  {user.username}
                </span>
              </div>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="relative bg-[#fece51] text-slate-900 py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                Profile View
                {number > 0 && (
                  <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {number}
                  </span>
                )}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              <Link
                to="/auth/login"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2.5 border border-slate-700 rounded-md hover:bg-slate-800 text-sm font-medium transition"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2.5 bg-[#fece51] text-slate-900 rounded-md text-sm font-bold shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
