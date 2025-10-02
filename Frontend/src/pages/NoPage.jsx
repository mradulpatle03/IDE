import React from "react";
import { Link } from "react-router-dom";

const NoPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-10"></div>

      {/* 404 Heading */}
      <h1 className="text-[110px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 drop-shadow-[0_0_15px_rgba(192,132,252,0.6)]">
        404
      </h1>

      {/* Subtext */}
      <p className="text-lg text-gray-300 font-mono mb-6">
        Looks like you wandered off into the void.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="relative z-10 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 
  hover:from-pink-600 hover:to-purple-700 text-white font-semibold font-mono 
  shadow-md hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all"
      >
        Take Me Home
      </Link>
    </div>
  );
};

export default NoPage;
