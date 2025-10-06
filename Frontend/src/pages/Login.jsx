import React, { useState } from "react";
import logo from "../images/logos/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api_base_url } from "../helper";
import { useDispatch } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitForm = (e) => {
    e.preventDefault();
    fetch(api_base_url + "/login", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        pwd: pwd,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // localStorage.setItem("token", data.token);
          // localStorage.setItem("isLoggedIn", true);
          dispatch(addUser());
          navigate("/");
        } else {
          toast.error(data.msg);
        }
      });
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0d0d0d] overflow-hidden">
        {/* Neon Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Pulsing red/blue gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-red-900/40 via-transparent to-blue-900/40 animate-pulse-slow"></div>

          {/* Rotating conic gradient */}
          <div
            className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-spin-slow opacity-20 
      bg-[conic-gradient(at_top,_#ff0044,_#111122,_#0088ff,_#111122,_#ff0044)] rounded-full blur-3xl"
          ></div>

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] 
      bg-[size:40px_40px] opacity-10"
          ></div>
        </div>

        {/* Glassmorphic Login Card */}
        <form
          onSubmit={submitForm}
          className="relative z-10 w-[25vw] flex flex-col items-center bg-white/5 backdrop-blur-xl 
    p-8 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.6)] border border-white/10"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="Logo"
              className="w-28 h-28 object-cover rounded-full border-2 border-blue-500 shadow-[0_0_20px_#0077ff]"
            />
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-6 font-mono drop-shadow-[0_0_10px_#ff0044]">
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
              className="w-full px-4 py-3 rounded-lg bg-[#1b1b2b] text-white placeholder-gray-400 font-mono
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-[0_0_8px_#000] hover:shadow-[0_0_12px_#0088ff]"
            />
          </div>

          {/* Password */}
          <div className="w-full mb-4">
            <input
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#1b1b2b] text-white placeholder-gray-400 font-mono
        focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-[0_0_8px_#000] hover:shadow-[0_0_12px_#ff0044]"
            />
          </div>

          {/* Signup Link */}
          <p className="text-gray-400 text-sm mt-2 self-start">
            Don&apos;t have an account?{" "}
            <Link to="/signUp" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Login Button */}
          <button
            type="submit"
            className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-blue-500 
      hover:from-red-600 hover:to-blue-600 text-white font-bold font-mono shadow-[0_0_15px_#ff0044] 
      hover:shadow-[0_0_25px_#0088ff] transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
