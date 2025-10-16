import React, { useState } from "react";
import logo from "../images/logos/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X, ChevronDown } from "lucide-react";
import { Brain, Code, Bot, ListChecks, Building2 } from "lucide-react";
import Profile from "../utils/Profile";

const features = [
  {
    title: "AI Roadmap Generator",
    desc: "Get a personalized roadmap crafted by AI based on your target role, level, and time availability.",
    icon: <Brain className="w-5 h-5 text-[#b53dff]" />,
    link: "/roadmap",
  },
  {
    title: "Topic-wise Practice",
    desc: "Master each DSA concept with focused topic-based questions and progress tracking.",
    icon: <ListChecks className="w-5 h-5 text-[#ff3db5]" />,
    link: "/session",
  },
  {
    title: "Company-wise Questions",
    desc: "Solve real interview questions asked at top tech companies like Google, Amazon, and Meta.",
    icon: <Building2 className="w-5 h-5 text-[#b53dff]" />,
    link: "/dsa-prep",
  },
  {
    title: "AI Doubt Solver Chatbot",
    desc: "Stuck on a question? Instantly clarify your doubts through our intelligent AI chatbot.",
    icon: <Bot className="w-5 h-5 text-[#ff3db5]" />,
    link: "/doubt-solver",
  },
  {
    title: "Built-in IDE",
    desc: "Write, run, and test your code seamlessly within your browser using our integrated IDE.",
    icon: <Code className="w-5 h-5 text-[#b53dff]" />,
    link: "/projects",
  },
];

const Navbar = () => {
  const { isAuthenticate } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const LoginRoute = () => navigate("/login");
  const RegisterRoute = () => navigate("/signup");

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0d0b1a]/95 backdrop-blur-md border-b border-[#2b1f3a] shadow-md shadow-black/30">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 h-[64px] sm:h-[72px] lg:h-[80px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] object-cover rounded-full border-2 border-[#ff3db5] shadow-lg shadow-[#ff3db5]/50 hover:scale-[1.05] transition-all duration-300"
            alt="Prep Pilot Logo"
          />
          <h1 className="text-white font-extrabold text-xl sm:text-2xl tracking-wide select-none">
            Prep<span className="text-[#b53dff]">Pilot</span>
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-200">
          <Link to="/" className="hover:text-[#b53dff] transition-colors duration-200">
            Home
          </Link>

          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#b53dff] transition-colors duration-200">
              Tools <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-2 bg-[#1a1428] border border-[#2b1f3a] rounded-xl shadow-lg py-2 min-w-[260px] animate-fadeIn">
                {features.map((f) => (
                  <Link
                    key={f.title}
                    to={f.link}
                    className="flex items-start gap-3 px-4 py-2 text-gray-300 hover:bg-[#2b1f3a] hover:text-white transition-colors duration-150"
                  >
                    <span className="mt-0.5">{f.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-semibold">{f.title}</div>
                      <div className="text-xs text-gray-400 leading-snug">{f.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className="hover:text-[#b53dff] transition-colors duration-200">
            About
          </Link>

          <Link to="/contact" className="hover:text-[#b53dff] transition-colors duration-200">
            Contact
          </Link>
        </div>

        {/* Auth / Profile */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticate ? (
            <Profile />
          ) : (
            <>
              <button
                onClick={LoginRoute}
                className="px-5 py-2 rounded-full font-semibold text-white text-sm bg-[#7f00ff] hover:bg-[#6500cc] border border-[#9c40ff]/50 shadow-[0_0_10px_rgba(124,0,255,0.2)] hover:shadow-[0_0_12px_rgba(124,0,255,0.4)] active:scale-95 transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={RegisterRoute}
                className="px-5 py-2 rounded-full font-semibold text-sm text-[#ff3db5] border border-[#ff3db5]/70 hover:bg-[#ff3db5] hover:text-white active:scale-95 transition-all duration-200"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white hover:text-[#b53dff] transition" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d0b1a] border-t border-[#2b1f3a] shadow-inner animate-slideDown">
          <div className="flex flex-col px-6 py-4 space-y-3 text-gray-200 font-medium">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-[#b53dff]">
              Home
            </Link>

            <details className="group">
              <summary className="cursor-pointer flex items-center justify-between hover:text-[#b53dff]">
                Tools
                <ChevronDown size={16} className="group-open:rotate-180 transition-transform duration-200" />
              </summary>

              <div className="pl-4 mt-2 space-y-2">
                {features.map((f) => (
                  <Link
                    key={f.title}
                    to={f.link}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#ff3db5] py-1"
                  >
                    <span>{f.icon}</span>
                    <span>{f.title}</span>
                  </Link>
                ))}
              </div>
            </details>

            <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#b53dff]">
              About
            </Link>

            <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-[#b53dff]">
              Contact
            </Link>

            {isAuthenticate ? (
              <Profile />
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <button onClick={LoginRoute} className="w-full py-2 rounded-full text-white font-semibold bg-[#7f00ff] hover:bg-[#6500cc] active:scale-95 transition-all">
                  Login
                </button>
                <button onClick={RegisterRoute} className="w-full py-2 rounded-full font-semibold text-[#ff3db5] border border-[#ff3db5]/70 hover:bg-[#ff3db5] hover:text-white active:scale-95 transition-all">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
