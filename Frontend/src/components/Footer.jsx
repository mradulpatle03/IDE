import { Brain, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 text-gray-300 py-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-7 h-7 text-[#b53dff]" />
            <h2 className="text-xl font-semibold text-white">AI Interview Prep</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your all-in-one AI-powered platform to master DSA, generate personalized roadmaps, 
            solve company-wise questions, and clear your coding interviews with confidence.
          </p>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
          <Link to="/roadmap" className="hover:text-[#b53dff] transition">AI Roadmap Generator</Link>
          <Link to="/session" className="hover:text-[#b53dff] transition">Topic-wise Practice</Link>
          <Link to="/dsa-prep" className="hover:text-[#b53dff] transition">Company-wise Questions</Link>
          <Link to="/doubt-solver" className="hover:text-[#b53dff] transition">AI Doubt Solver</Link>
          <Link to="/projects" className="hover:text-[#b53dff] transition">Built-in IDE</Link>
        </div>

        {/* Right Section */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Connect</h3>
          <div className="flex items-center gap-4 mt-3">
            <a
              href="https://github.com/mradulpatle03"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-800 hover:bg-[#b53dff] hover:text-white transition"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/mradul-patle-5207b52a7/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-800 hover:bg-[#b53dff] hover:text-white transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:mradulwork1316@gmail.com"
              className="p-2 rounded-full bg-gray-800 hover:bg-[#b53dff] hover:text-white transition"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-800 pt-5 text-center text-sm text-gray-500">
        © {year} AI Interview Prep
      </div>
    </footer>
  );
}
