import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const user = true;
  
  return (
    <nav className="fixed top-0 left-0 w-full h-[100px] bg-white z-[999]">
      {/* Container: Iski padding aur max-width aapke pages se match karni chahiye */}
      <div className="max-w-[1400px] h-full mx-auto px-5 md:px-10 lg:px-20 flex items-center justify-between">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
            <img src="/logo.png" alt="logo" className="w-8 h-8" />
            <span className="hidden sm:block">EmmaEstate</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <Link to="/" className="hover:text-[#fece51] transition">Home</Link>
            <Link to="/about" className="hover:text-[#fece51] transition">About</Link>
            <Link to="/contact" className="hover:text-[#fece51] transition">Contact</Link>
            <Link to="/agents" className="hover:text-[#fece51] transition">Agents</Link>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-5">
          {user ? (
            <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-3">
                <img
                  src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="font-semibold text-sm">John Doe</span>
              </div>
              <Link to="/profile" className="relative bg-[#fece51] px-6 py-2.5 rounded-md font-bold text-sm shadow-sm">
                Profile
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6 font-bold text-sm">
              <Link to="/login" className="hover:text-gray-600 transition">Sign In</Link>
              <Link to="/register" className="bg-[#fece51] px-6 py-2.5 rounded-md hover:bg-yellow-400 transition-all">
                Register
              </Link>
            </div>
          )}
          
          {/* Mobile Menu Icon */}
          <div className="md:hidden z-[1001]">
            <img src="/menu.png" alt="" className="w-8 h-8 cursor-pointer" onClick={() => setOpen(!open)} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;