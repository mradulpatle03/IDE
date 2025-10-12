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
    <div className="fixed top-0 left-0 w-full z-[100] bg-[#0d0b1a] border-b border-[#2b1f3a] shadow-md shadow-black/30">
      <div className="flex items-center justify-between h-[64px] sm:h-[72px] lg:h-[80px] max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* --- Logo Section --- */}
        <div className="flex items-center gap-2 sm:gap-3">
          {" "}
          <img
            src={logo}
            className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] object-cover rounded-full border-2 border-[#ff3db5] shadow-lg shadow-[#ff3db5]/50 transition-all duration-500 hover:scale-[1.05] hover:rotate-2"
            alt="Ai Interview Prep Logo"
          />{" "}
          <h1 className="text-white font-black text-lg sm:text-xl lg:text-2xl tracking-wider select-none">
            {" "}
            Prep
            <span className="text-[#b53dff] transition-colors duration-300">
              
              Pilot{" "}
            </span>{" "}
          </h1>{" "}
        </div>

        {/* --- Buttons / Profile --- */}
        <div className="flex items-center gap-3">
          {isAuthenticate ? (
            <Profile />
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={LoginRoute}
                className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-semibold text-white text-sm
              bg-[#7f00ff] hover:bg-[#6500cc]
              border border-[#9c40ff]/50
              shadow-[0_0_10px_rgba(124,0,255,0.2)]
              hover:shadow-[0_0_12px_rgba(124,0,255,0.4)]
              active:scale-95 transition-all duration-200"
              >
                Login
              </button>

              <button
                onClick={RegisterRoute}
                className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-semibold text-sm 
              text-[#ff3db5] border border-[#ff3db5]/70
              hover:bg-[#ff3db5] hover:text-white
              active:scale-95 transition-all duration-200"
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
