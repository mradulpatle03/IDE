import { useMemo, useState } from "react";
import axios from "axios";
import {
  Loader2,
  Code,
  AlertTriangle,
  SlidersHorizontal,
  Search,
  Link2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const topicPresets = [
  "array",
  "string",
  "dp",
  "graph",
  "tree",
  "stack",
  "queue",
  "greedy",
];

const companies = ["Google", "Amazon", "Microsoft", "Meta", "Uber", "Adobe"];

const difficulties = ["easy", "medium", "hard"];

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const LeetCodeQuestionUI = () => {
  const [topic, setTopic] = useState("array");
  const [difficulty, setDifficulty] = useState("easy");
  const [company, setCompany] = useState("Google");
  const [limit, setLimit] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const url = `http://localhost:8000/api/v1/dsa/leetcode-questions?topic=${topic}&difficulty=${difficulty}&company=${company}&limit=${limit}`;
      const res = await axios.post(url);

      let data = res.data;
      if (!Array.isArray(data) && data?.raw) {
        try {
          data = JSON.parse(data.raw);
        } catch {
          data = [];
        }
      }
      if (!Array.isArray(data)) data = [];
      setQuestions(data);
    } catch (err) {
      setError("Failed to fetch questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const difficultyBadge = (d) => {
    const map = {
      Easy: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20",
      Medium: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20",
      Hard: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20",
      easy: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20",
      medium: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20",
      hard: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20",
    };
    return map[d] || "bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/20";
  };

  const queryText = useMemo(() => {
    return `${company} • ${difficulty} • ${topic} • ${limit}`;
  }, [company, difficulty, topic, limit]);

  return (
    <div className="h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] relative bg-[#0b0e13] text-white overflow-hidden mt-[64px] sm:mt-[72px] lg:mt-[80px]">
      {/* Gradient mesh backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Hero */}
        <div className="text-center space-y-3">
          
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            AI LeetCode <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-300">Generator</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Pick topic, difficulty, and company filters to get curated practice links with summaries and quick access, rendered with a clean developer‑first UI.
          </p>
        </div>

        {/* Filter Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-7 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-slate-300">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm">Filters</span>
            </div>
            <div className="hidden md:flex text-xs text-slate-400">
              Press Enter to run
            </div>
          </div>

          {/* Inputs */}
          <div className="grid md:grid-cols-4 gap-4">
            {/* Topic with chips */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Topic</label>
              <div className="flex gap-2 flex-wrap">
                {topicPresets.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm ring-1 transition ${
                      topic === t
                        ? "bg-indigo-500/20 text-indigo-200 ring-indigo-400/30"
                        : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg bg-[#131823]/80 border border-white/10 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
                placeholder="Custom topic"
              />
            </div>

            {/* Difficulty segmented */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-2 rounded-lg text-sm ring-1 transition ${
                      difficulty === d
                        ? "bg-white/10 text-white ring-white/20"
                        : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Company select with search-like UI */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Company</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  list="company-list"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#131823]/80 border border-white/10 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
                  placeholder="Google, Amazon, …"
                />
                <datalist id="company-list">
                  {companies.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Limit stepper */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Limit</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={limit}
                  min={1}
                  max={10}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#131823]/80 border border-white/10 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
                />
                <div className="shrink-0 text-xs text-slate-400">1-10</div>
              </div>
            </div>
          </div>

          {/* Query bar */}
          <div className="mt-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white/5 text-slate-300 text-xs ring-1 ring-white/10">
                {company}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 text-slate-300 text-xs ring-1 ring-white/10">
                {difficulty}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 text-slate-300 text-xs ring-1 ring-white/10">
                {topic}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 text-slate-300 text-xs ring-1 ring-white/10">
                Limit {limit}
              </span>
            </div>

            <button
              onClick={fetchQuestions}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 disabled:opacity-60 px-5 py-2.5 rounded-xl font-medium ring-1 ring-white/10 transition-shadow shadow-[0_8px_24px_-12px_rgba(99,102,241,0.6)]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Generating
                </>
              ) : (
                <>
                  <Code className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <div className="mt-10">
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center justify-center gap-2 text-rose-300 bg-rose-500/10 border border-rose-400/20 rounded-xl py-3 px-4"
              >
                <AlertTriangle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {Array.from({ length: Math.min(6, limit) }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5 bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                  <div className="h-4 w-2/3 bg-white/10 rounded mb-3 animate-pulse" />
                  <div className="h-3 w-full bg-white/10 rounded mb-2 animate-pulse" />
                  <div className="h-3 w-5/6 bg-white/10 rounded mb-4 animate-pulse" />
                  <div className="h-8 w-28 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && questions.length === 0 && (
            <div className="mt-10 text-center text-slate-400">
              Use the filters above and click Generate to fetch curated questions, or choose from presets for a quick start.
            </div>
          )}

          {/* Grid */}
          {!loading && !error && questions.length > 0 && (
            <motion.div
              variants={gridVariants}
              initial="hidden"
              animate="show"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            >
              {questions.map((q, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="group relative rounded-xl p-5 bg-white/5 border border-white/10 backdrop-blur-xl transition
                             hover:bg-white/7.5 hover:border-indigo-400/30"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: 1000,
                  }}
                >
                  {/* Accent ring */}
                  <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold leading-snug text-white">
                      {q.title}
                    </h3>
                    <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${difficultyBadge(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {q.summary}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <a
                      href={q.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 text-sm"
                    >
                      <Link2 className="w-4 h-4" />
                      View problem
                    </a>

                    <div className="h-6 px-2 rounded bg-gradient-to-r from-indigo-500/15 to-fuchsia-500/15 text-[11px] text-slate-300 flex items-center ring-1 ring-white/10">
                      Company match
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-10 text-center text-xs text-slate-500">
          Tip: Switch topics quickly with the chips and run again for variety.
        </div>
      </div>
    </div>
  );
};

export default LeetCodeQuestionUI;
