import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Code, Bot, ListChecks, Building2 } from "lucide-react";
import Footer from "../components/Footer";

const features = [
  {
    title: "AI Roadmap Generator",
    desc: "Get a personalized roadmap crafted by AI based on your target role, level, and time availability.",
    icon: <Brain className="w-8 h-8 text-[#b53dff]" />,
    link: "/roadmap",
  },
  {
    title: "Topic-wise Practice",
    desc: "Master each DSA concept with focused topic-based questions and progress tracking.",
    icon: <ListChecks className="w-8 h-8 text-[#ff3db5]" />,
    link: "/session",
  },
  {
    title: "Company-wise Questions",
    desc: "Solve real interview questions asked at top tech companies like Google, Amazon, and Meta.",
    icon: <Building2 className="w-8 h-8 text-[#b53dff]" />,
    link: "/dsa-prep",
  },
  {
    title: "AI Doubt Solver Chatbot",
    desc: "Stuck on a question? Instantly clarify your doubts through our intelligent AI chatbot.",
    icon: <Bot className="w-8 h-8 text-[#ff3db5]" />,
    link: "/doubt-solver",
  },
  {
    title: "Built-in IDE",
    desc: "Write, run, and test your code seamlessly within your browser using our integrated IDE.",
    icon: <Code className="w-8 h-8 text-[#b53dff]" />,
    link: "/projects",
  },
];

const MainPage = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[calc(100vh-80px)] mt-[64px] sm:mt-[72px] lg:mt-[80px] bg-gradient-to-b from-[#0a0016] via-[#120225] to-[#0a0016] text-white overflow-hidden px-6 md:px-12">
      {/* Background Effects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#b53dff1a] via-[#100022] to-transparent blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute inset-0 -z-10 animate-pulse bg-[radial-gradient(circle_at_10%_20%,_#b53dff1a,_transparent_30%),_radial-gradient(circle_at_90%_80%,_#ff3db520,_transparent_30%)]"
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative max-w-4xl w-full rounded-3xl overflow-hidden border border-[#b53dff30]
        bg-[#16072c]/90 backdrop-blur-xl shadow-[0_0_40px_-10px_#b53dff30]"
      >
        {/* Accent Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-0 left-0 origin-left w-full h-[5px] bg-gradient-to-r from-[#b53dff] via-[#ff3db5] to-[#b53dff]"
        />

        <div className="px-8 md:px-12 py-14 flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-[0_0_20px_rgba(181,61,255,0.15)]"
          >
            Prepare for Your Next Interview with Your Personal
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-4 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#b53dff] via-[#ff3db5] to-[#b53dff] animate-gradient-x"
          >
            AI Assistant
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-6 text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed"
          >
            Elevate your preparation with AI-driven roadmaps, company-wise DSA
            questions, instant doubt solving, and a built-in coding workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-10"
          >
            <Link
              to="/session"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-base md:text-lg font-semibold
              bg-gradient-to-r from-[#b53dff] to-[#ff3db5] hover:from-[#9e2be8] hover:to-[#e935a3]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b53dff]
              shadow-[0_0_20px_-5px_#b53dff80] transition-all duration-300 hover:scale-[1.03]"
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
          </motion.div>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        variants={{
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.15 },
          },
          hidden: { opacity: 0, y: 30 },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 max-w-6xl"
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{
              scale: 1.05,
              rotate: 0.5,
              boxShadow: "0 0 40px -10px rgba(255,61,181,0.5)",
            }}
            transition={{ type: "spring", stiffness: 150, damping: 12 }}
            onClick={() => navigate(f.link)}
            className="cursor-pointer group relative flex flex-col items-center text-center border border-[#b53dff20]
            bg-[#16072c]/80 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_25px_-10px_#b53dff50]
            hover:shadow-[0_0_40px_-10px_#ff3db560] transition-all duration-500"
          >
            <div className="mb-3">{f.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      <Footer />
    </div>
      

  );
};

export default MainPage;
