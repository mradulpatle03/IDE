import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Target, Clock, Sparkles, Layers, Wand2, CheckCircle2 } from "lucide-react";

const API_BASE = "http://localhost:8000/api/v1/roadmap";

const levels = ["Beginner", "Intermediate", "Advanced"];
const durations = ["1 month", "3 months", "6 months"];
const styles = ["Theory-first", "Practice-first", "Balanced"];

function Segmented({ value, onChange, options, name }) {
  return (
    <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-lg border border-white/10">
      {options.map(opt => {
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
                : "text-gray-300 hover:bg-white/10"
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
        <label className="text-sm sm:text-base text-gray-200 font-medium truncate">{label}</label>
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    .map(s => s.trim())
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
            backgroundImage: "linear-gradient(90deg, #fff, #c084fc, #60a5fa, #fff)",
            backgroundSize: "300% 100%",
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          AI Career Roadmap Generator
        </motion.h1>
        <p className="mt-3 text-gray-300 text-sm sm:text-base">
          Structured, personalized learning path tailored to your goals and schedule.
        </p>
      </motion.div>

      {/* MAIN LAYOUT */}
      <div className="mx-auto max-w-6xl mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* FORM CARD */}
        <div className="md:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-6 shadow-lg">
          <Field label="Target Role" hint="e.g., SDE, Frontend Engineer, Data Scientist" icon={Target}>
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
              <Segmented name="level" value={form.level} onChange={handleChange} options={levels} />
            </Field>
            <Field label="Duration" icon={Clock}>
              <Segmented name="duration" value={form.duration} onChange={handleChange} options={durations} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Daily Hours" hint="Time you can commit per day" icon={Clock}>
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
              <Segmented name="style" value={form.style} onChange={handleChange} options={styles} />
            </Field>
          </div>

          <Field label="Known Tools" hint="Comma-separated. e.g., React, Python" icon={Sparkles}>
            <input
              name="knownTools"
              value={form.knownTools}
              onChange={handleChange}
              placeholder="e.g., React, Python"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/60 transition"
            />
            {chipList.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {chipList.map(chip => (
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
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Tips</h3>
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
            className="mx-auto max-w-6xl mt-10 space-y-6"
          >
            <motion.h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              {roadmap.summary}
            </motion.h2>

            {roadmap.plan?.map((week) => (
              <motion.div
                key={week.week}
                className="relative overflow-hidden group bg-white/5 border border-white/10 p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                whileHover={{ y: -2 }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(140,103,255,0.10), transparent 40%)",
                  }}
                />
                <div className="flex items-center justify-between mb-2 gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-purple-300 min-w-0 truncate">
                    Week {week.week}: {week.focus}
                  </h3>
                  <CheckCircle2 className="w-5 h-5 text-green-300/80 shrink-0" />
                </div>

                <ul className="list-disc ml-5 sm:ml-6 text-gray-200 mb-3 space-y-1.5">
                  {week.details?.map((d, i) => (
                    <li key={i} className="break-words">
                      <span className="text-gray-400">Day {d.day}:</span>{" "}
                      <span className="text-white">{d.topic}</span>{" "}
                      <span className="text-gray-400">({d.time})</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-sm text-gray-300 italic break-words">🎯 {week.checkpoint}</p>
                  <p className="text-sm text-green-300 break-words">💬 {week.motivation}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
