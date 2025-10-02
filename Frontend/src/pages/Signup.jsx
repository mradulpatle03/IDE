import React, { useState } from "react";
import logo from "../images/logos/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { api_base_url } from "../helper";
import { toast } from "react-toastify";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    fetch(api_base_url + "/signUp", {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, pwd }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) navigate("/login");
        else toast.error(data.msg);
      });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#0d0d0d] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-transparent to-blue-900/40 animate-pulse-slow"></div>

        <div
          className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-spin-slow opacity-20 
      bg-[conic-gradient(at_top,_#ff0044,_#111122,_#0088ff,_#111122,_#ff0044)] rounded-full blur-3xl"
        ></div>

        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] 
      bg-[size:40px_40px] opacity-10"
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-28 h-28 object-cover rounded-full border-2 border-blue-500 shadow-[0_0_20px_#0077ff]"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-6 font-mono drop-shadow-[0_0_10px_#ff0044]">
          Create Your Developer Account
        </h2>

        {/* Form */}
        <form onSubmit={submitForm} className="flex flex-col gap-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg bg-[#1b1b2b] text-white placeholder-gray-400 font-mono 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-[#1b1b2b] text-white placeholder-gray-400 font-mono 
        focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />

          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-[#1b1b2b] text-white placeholder-gray-400 font-mono 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Login link */}
          <p className="text-gray-400 text-sm mt-2 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-blue-500 
        hover:from-red-600 hover:to-blue-600 text-white font-bold font-mono shadow-[0_0_15px_#ff0044] hover:shadow-[0_0_25px_#0088ff] transition-all"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-700" />
          <span className="px-2 text-gray-500 font-mono">OR</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-[#242424] hover:bg-[#2c2c2c] rounded-lg text-white font-mono 
        transition-shadow shadow-[0_0_10px_#444] hover:shadow-[0_0_20px_#ff0044]"
          >
            GitHub
          </button>
          <button
            className="px-4 py-2 bg-[#242424] hover:bg-[#2c2c2c] rounded-lg text-white font-mono 
        transition-shadow shadow-[0_0_10px_#444] hover:shadow-[0_0_20px_#0088ff]"
          >
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
