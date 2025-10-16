import React, { useState } from "react";
import logo from "../images/logos/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api_base_url } from "../helper";
import { useDispatch } from "react-redux";
import { addUser } from "../Store/user.Reducer";
const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitForm = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_BACKEND_URL}`+"/api/v1/user/login", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        pwd: pwd,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(addUser(data.user));
          navigate("/");
        } else {
          toast.error(data.msg);
        }
      });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0d0d0d] overflow-hidden">
      {/* Subtler Background - Less Shiny, Retaining Original Colors */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Pulsing red/blue gradient - Reduced opacity */}
        <div className="absolute inset-0 bg-gradient-to-tr from-red-900/10 via-transparent to-blue-900/10 animate-pulse-slow"></div>

        {/* Rotating conic gradient - Reduced opacity and blur */}
        <div
          className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-spin-slow opacity-5 
      bg-[conic-gradient(at_top,_#ff0044,_#111122,_#0088ff,_#111122,_#ff0044)] rounded-full blur-2xl"
        ></div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] 
      bg-[size:40px_40px] opacity-5"
        ></div>
      </div>

      {/* Glassmorphic Login Card - Responsive and Refined */}
      <form
        onSubmit={submitForm}
        // Highly responsive width for mobile and desktop
        className="relative z-10 w-[90%] max-w-sm sm:max-w-md flex flex-col items-center 
    bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/10
    p-6 sm:p-10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/10 
    border-t-white/30 border-l-white/30"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-2 border-[#0077ff] 
        shadow-[0_0_15px_#0077ff]/60 transition-all duration-300 hover:scale-[1.02]"
          />
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 font-mono 
    drop-shadow-[0_0_5px_#ff0044] tracking-wide"
        >
          Welcome Back!
        </h2>

        {/* Email */}
        <div className="w-full mb-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#1b1b2b] text-white placeholder-gray-500 font-mono
        focus:outline-none focus:ring-2 focus:ring-[#0077ff] transition-all duration-300
        shadow-[inset_0_0_8px_#000] hover:shadow-[0_0_5px_#0077ff]/30"
          />
        </div>

        {/* Password */}
        <div className="w-full mb-6">
          <input
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#1b1b2b] text-white placeholder-gray-500 font-mono
        focus:outline-none focus:ring-2 focus:ring-[#ff0044] transition-all duration-300
        shadow-[inset_0_0_8px_#000] hover:shadow-[0_0_5px_#ff0044]/30"
          />
        </div>

        {/* Signup Link */}
        <p className="text-gray-400 text-sm sm:text-base mt-2 self-start">
          Don&apos;t have an account?{" "}
          <Link
            to="/signUp"
            className="text-[#0077ff] hover:text-[#ff0044] hover:underline transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>

        {/* Login Button */}
        <button
          type="submit"
          className="mt-8 w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-blue-500 
      hover:from-red-600 hover:to-blue-600 text-white font-bold font-mono 
      shadow-[0_0_10px_#ff0044] hover:shadow-[0_0_15px_#0088ff] 
      transition-all duration-300 transform active:scale-[0.98] tracking-widest"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
