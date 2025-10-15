import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Target,
  Clock,
  Sparkles,
  Layers,
  Wand2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const API_BASE = "http://localhost:8000/api/v1/roadmap";

const levels = ["Beginner", "Intermediate", "Advanced"];
const durations = ["1 month", "3 months", "6 months"];
const styles = ["Theory-first", "Practice-first", "Balanced"];

function Segmented({ value, onChange, options, name }) {
  return (
    <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-lg border border-white/10">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange({ target: { name, value: opt } })}
            className={[
              "px-4 py-2 rounded-lg text-sm font-medium transition min-w-[100px] text-center",
              active
                ? "bg-white/10 text-white shadow-lg"
                : "text-gray-300 hover:bg-white/10",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, hint, children, icon: Icon }) {
  return (
    <div className="space-y-2 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        {Icon && <Icon className="w-5 h-5 text-purple-400 shrink-0" />}
        <label className="text-sm sm:text-base text-gray-200 font-medium truncate">
          {label}
        </label>
      </div>
      {children}
      {hint && <p className="text-xs sm:text-sm text-gray-400">{hint}</p>}
    </div>
  );
}

export default function RoadmapPage() {
  const [form, setForm] = useState({
    role: "",
    level: "Beginner",
    duration: "3 months",
    dailyHours: "2",
    style: "Balanced",
    knownTools: "",
  });

  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generate = async () => {
    setLoading(true);
    setRoadmap(null);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/generate`, form);
      setRoadmap(res.data);
    } catch (err) {
      console.error(err);
      setError("Could not generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chipList = form.knownTools
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);

  return (
    <motion.div
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-[#0b0b12] via-[#1a1033] to-[#0e0b16] text-white mt-[64px] sm:mt-[72px] lg:mt-[80px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
      <motion.div className="mx-auto max-w-6xl text-center">
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #fff, #c084fc, #60a5fa, #fff)",
            backgroundSize: "300% 100%",
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          AI Career Roadmap Generator
        </motion.h1>
        <p className="mt-3 text-gray-300 text-sm sm:text-base">
          Structured, personalized learning path tailored to your goals and
          schedule.
        </p>
      </motion.div>

      {/* MAIN LAYOUT */}
      <div className="mx-auto max-w-6xl mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* FORM CARD */}
        <div className="md:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-6 shadow-lg">
          <Field
            label="Target Role"
            hint="e.g., SDE, Frontend Engineer, Data Scientist"
            icon={Target}
          >
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g., SDE"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/60 transition"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Skill Level" icon={Layers}>
              <Segmented
                name="level"
                value={form.level}
                onChange={handleChange}
                options={levels}
              />
            </Field>
            <Field label="Duration" icon={Clock}>
              <Segmented
                name="duration"
                value={form.duration}
                onChange={handleChange}
                options={durations}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Daily Hours"
              hint="Time you can commit per day"
              icon={Clock}
            >
              <input
                name="dailyHours"
                value={form.dailyHours}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\d.]/g, "");
                  handleChange({ target: { name: "dailyHours", value: v } });
                }}
                inputMode="decimal"
                placeholder="2"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/60 transition"
              />
            </Field>
            <Field label="Learning Style" icon={Wand2}>
              <Segmented
                name="style"
                value={form.style}
                onChange={handleChange}
                options={styles}
              />
            </Field>
          </div>

          <Field
            label="Known Tools"
            hint="Comma-separated. e.g., React, Python"
            icon={Sparkles}
          >
            <input
              name="knownTools"
              value={form.knownTools}
              onChange={handleChange}
              placeholder="e.g., React, Python"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/60 transition"
            />
            {chipList.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {chipList.map((chip) => (
                  <span
                    key={chip}
                    className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-200 border border-purple-400/25"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </Field>

          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <motion.button
            onClick={generate}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="mt-2 w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-60 shadow-xl transition"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" /> Generating…
              </span>
            ) : (
              "Generate My Roadmap"
            )}
          </motion.button>

          <p className="text-[12px] text-gray-400 text-center mt-1">
            Your inputs are private and used only to craft your roadmap.
          </p>
        </div>

        {/* SIDE TIPS PANEL */}
        <div className="md:col-span-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 px-5 py-5 space-y-4 shadow-inner">
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
            Tips
          </h3>
          <ul className="text-sm text-gray-300 space-y-2 list-disc ml-5">
            <li>Be specific with your role for tailored weekly focus areas.</li>
            <li>Set realistic daily hours to maintain momentum.</li>
            <li>List tools you already know to skip basics.</li>
          </ul>
        </div>
      </div>

      {/* EMPTY STATE */}
      <AnimatePresence>
        {!loading && !roadmap && !error && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-6xl mt-8 text-center text-gray-400 px-2 sm:px-0"
          >
            Ready when you are. Fill in details and hit generate.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ROADMAP DISPLAY */}
      <AnimatePresence>
        {roadmap && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-6xl mt-14"
          >
            {/* Summary Header */}
            <div className="text-center mb-10">
              <motion.h2
                className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {roadmap.summary}
              </motion.h2>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Expand each week to see your detailed learning journey 
              </p>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Central vertical line */}
              <div className="absolute left-1/2 top-0 w-[3px] h-full bg-gradient-to-b from-purple-600/40 via-indigo-500/40 to-transparent transform -translate-x-1/2 pointer-events-none" />

              {roadmap.plan?.map((week, i) => (
                <ExpandableWeekCard key={week.week} week={week} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ExpandableWeekCard({ week, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 mb-12 ${
        index % 2 === 0 ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Connector Dot */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 w-5 h-5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full shadow-lg border border-white/20" />

      {/* Week Card */}
      <div className="md:w-[47%] w-full bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:shadow-xl hover:bg-white/15 transition-all duration-300">
        {/* Header Row */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-purple-300">
            Week {week.week}
          </h3>
          <button
            onClick={() => setOpen(!open)}
            className="text-sm px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 text-purple-200 flex items-center gap-2 transition"
          >
            {open ? (
              <>
                <span>Hide</span>{" "}
                <span className="text-xs">
                  <ChevronUp size={16} />
                </span>
              </>
            ) : (
              <>
                <span>Expand</span>{" "}
                <span className="text-xs">
                  <ChevronDown size={16} />
                </span>
              </>
            )}
          </button>
        </div>

        {/* Focus Area */}
        <p className="text-white text-base font-medium mb-4">{week.focus}</p>

        {/* Expanded Content */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden space-y-8"
            >
              {/* Day-wise Breakdown */}
              <div className="bg-gradient-to-br from-black/40 to-zinc-900/60 rounded-2xl border border-white/10 p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2 tracking-wide">
                  Weekly Schedule
                </h3>
                <ul className="space-y-4 text-gray-300 text-sm sm:text-base">
                  {week.details?.map((d, j) => (
                    <li
                      key={j}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-3 border border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-semibold">
                          Day {d.day}
                        </span>
                        <span className="text-gray-400 text-xs sm:text-sm">
                          •
                        </span>
                        <span className="text-white font-medium">
                          {d.topic}
                        </span>
                      </div>
                      {/* <span className="text-gray-400 text-xs italic sm:text-sm whitespace-nowrap">
                        ⏱ {d.time}
                      </span> */}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkpoint & Motivation */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="text-sm sm:text-base text-gray-200 bg-gradient-to-r from-purple-900/40 to-purple-800/20 px-6 py-5 rounded-2xl border border-purple-500/20 shadow-md shadow-purple-900/10 backdrop-blur-sm leading-relaxed">
                  <h4 className="text-purple-300 font-semibold mb-2 text-base">
                    Weekly Checkpoint
                  </h4>
                  <p className="italic text-gray-300">{week.checkpoint}</p>
                </div>

                <div className="text-sm sm:text-base text-gray-200 bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 px-6 py-5 rounded-2xl border border-indigo-500/20 shadow-md shadow-indigo-900/10 backdrop-blur-sm leading-relaxed">
                  <h4 className="text-indigo-300 font-semibold mb-2 text-base">
                    Motivation
                  </h4>
                  <p className="text-gray-300">{week.motivation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
