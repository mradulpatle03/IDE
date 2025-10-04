import React from "react";
import logo from "../images/logos/logo.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="nav flex items-center justify-between h-[80px] px-[100px] bg-gradient-to-r from-[#0f0e0e] via-[#1a1a1a] to-[#0f0e0e] border-b border-[#2b2b2b] shadow-[0_0_20px_rgba(35,181,181,0.2)] backdrop-blur-md">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            className="w-[70px] h-[70px] object-cover rounded-full border-2 border-[#23b5b5] shadow-[0_0_10px_#23b5b5]"
            alt="Logo"
          />
          <h1 className="text-white font-semibold text-xl tracking-wide">
            DevTools
          </h1>
        </div>

        {/* Links Section */}
        <div className="links flex items-center gap-[30px] text-gray-300 font-medium">
          {["Home", "About", "Services", "Contact"].map((link, i) => (
            <Link
              to={`/${link.toLowerCase()}`}
              key={i}
              className="relative group text-[16px] tracking-wide transition-all duration-300"
            >
              <span className="group-hover:text-[#23b5b5] transition-colors duration-300">
                {link}
              </span>
              {/* animated underline */}
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-[#23b5b5] rounded-full transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("isLoggedIn");
              window.location.reload();
            }}
            className="ml-[20px] bg-gradient-to-r from-[#23b5b5] to-[#13a1a1] hover:from-[#18c0c0] hover:to-[#0f9d9d] text-black font-semibold px-[22px] py-[9px] rounded-md shadow-[0_0_15px_rgba(35,181,181,0.5)] hover:shadow-[0_0_25px_rgba(35,181,181,0.8)] transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
