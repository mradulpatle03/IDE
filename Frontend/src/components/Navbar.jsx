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
        {/* Links Section */}
        <div className="flex items-center gap-4">
          {isAuthenticate ? (
            <Profile />
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={LoginRoute}
                className="relative px-5 py-2.5 rounded-xl text-white font-semibold transition-all duration-300 
        bg-gradient-to-r from-[#0066ff] to-[#0044cc]
        hover:from-[#0044cc] hover:to-[#002b80]
        hover:shadow-[0_0_15px_rgba(0,102,255,0.5)]
        active:scale-95"
              >
                Login
              </button>

              <button
                onClick={RegisterRoute}
                className="relative px-5 py-2.5 rounded-xl font-semibold text-[#0044cc] border border-[#0044cc] 
        hover:bg-[#0044cc] hover:text-white transition-all duration-300
        active:scale-95"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
