import React from "react";
import logo from "../images/logos/logo.jpg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Profile from "../utils/Profile";

const Navbar = () => {
  const { isAuthenticate } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const LoginRoute = () => {
    navigate("/login");
  };
  const RegisterRoute = () => {
    navigate("/signup");
  };

  return (
    <div className="nav top-0 left-0 w-full z-50 px-3 sm:px-6 lg:px-12 py-3 border-b border-[#3a1f47] backdrop-blur-lg bg-[#0a0014]/80 shadow-2xl shadow-[#b53dff]/30 transition-all duration-300">
      <div className="flex items-center justify-between h-[56px] sm:h-[64px] lg:h-[72px] max-w-[1500px] mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={logo}
            className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] object-cover rounded-full border-2 border-[#ff3db5] shadow-lg shadow-[#ff3db5]/50 transition-all duration-500 hover:scale-[1.05] hover:rotate-2"
            alt="DevTools Logo"
          />
          <h1 className="text-white font-black text-lg sm:text-xl lg:text-2xl tracking-wider select-none">
            Dev
            <span className="text-[#b53dff] transition-colors duration-300">
              Tools
            </span>
          </h1>
        </div>

        {/* Links Section - Tighter spacing for mobile */}
        <div className="flex items-center gap-2">
          {isAuthenticate ? (
            <Profile />
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={LoginRoute}
                className="relative px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm rounded-full text-white font-semibold transition-all duration-300 ease-in-out
            bg-gradient-to-r from-[#b53dff] to-[#7f00ff]
            hover:from-[#7f00ff] hover:to-[#5500aa]
            shadow-md shadow-[#b53dff]/40
            hover:shadow-lg hover:shadow-[#b53dff]/60
            active:scale-90 whitespace-nowrap overflow-hidden group"
              >
                {/* Adding a subtle glow effect on hover */}
                <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-10 mix-blend-overlay"></span>
                Login
              </button>

              <button
                onClick={RegisterRoute}
                className="relative px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm rounded-full font-semibold text-[#ff3db5] border border-[#ff3db5] 
            hover:bg-[#ff3db5] hover:text-white hover:border-[#ff3db5] transition-all duration-300 ease-in-out
            active:scale-90 whitespace-nowrap"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
