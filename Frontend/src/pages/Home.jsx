import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
  // Simple mount reveal without Framer Motion
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full min-h-[calc(100vh-80px)] mt-[64px] sm:mt-[72px] lg:mt-[80px] bg-gradient-to-b from-[#0a0016] via-[#120225] to-[#0a0016] text-white overflow-hidden px-6 md:px-12">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#b53dff1a] via-[#100022] to-transparent blur-3xl"></div>

      {/* Floating particles (subtle animated dots) */}
      <div className="absolute inset-0 -z-10 animate-pulse opacity-20 bg-[radial-gradient(circle_at_10%_20%,_#b53dff1a,_transparent_30%),_radial-gradient(circle_at_90%_80%,_#ff3db520,_transparent_30%)]"></div>

      {/* Main Card */}
      <div
        className={[
          "relative max-w-3xl w-full rounded-3xl overflow-hidden border border-[#b53dff30]",
          "bg-[#16072c]/90 backdrop-blur-xl shadow-[0_0_40px_-10px_#b53dff30]",
          "transition-all duration-700 ease-out",
          mounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0",
        ].join(" ")}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-[#b53dff] via-[#ff3db5] to-[#b53dff]" />

        <div className="px-8 md:px-12 py-14 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-[0_0_20px_rgba(181,61,255,0.15)]">
            Prepare for Your Next Interview with Your Personal
          </h1>

          <h2 className="mt-4 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#b53dff] via-[#ff3db5] to-[#b53dff] animate-gradient-x">
            AI Assistant
          </h2>

          <p className="mt-6 text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
            Level up your career with AI-powered interview practice,
            personalized questions, and instant feedback designed for your role,
            skills, and experience.
          </p>

          <div className="mt-10">
            <Link
              to="/session"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-base md:text-lg font-semibold
            bg-gradient-to-r from-[#b53dff] to-[#ff3db5] hover:from-[#9e2be8] hover:to-[#e935a3]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b53dff]
            shadow-[0_0_20px_-5px_#b53dff80] transition-all duration-300"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
