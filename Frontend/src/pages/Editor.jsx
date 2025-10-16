// src/pages/Editor.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import Editor2 from "@monaco-editor/react";
import { api_base_url } from "../helper";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Loader2, Play, Save, Trash2 } from "lucide-react";

const Editor = () => {
  const { id } = useParams();
  const [data, setData] = useState(null); // project metadata from backend
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState(false);
  const [stdin, setStdin] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
  const autoSaveTimer = useRef(null);
  const isMounted = useRef(true);

  // Load project
  useEffect(() => {
    isMounted.current = true;
    const fetchProject = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}`+`/api/v1/projects/getProject`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: id }),
        });
        const resJson = await res.json();
        if (resJson.success) {
          setData(resJson.project);
          setCode(resJson.project.code || "");
        } else {
          toast.error(resJson.msg || "Failed to fetch project");
        }
      } catch (err) {
        console.error("fetchProject error:", err);
        toast.error("Failed to load project.");
      }
    };

    if (id) fetchProject();
    return () => {
      isMounted.current = false;
      clearTimeout(autoSaveTimer.current);
    };
  }, [id]);

  // Map project language to Monaco language & file extension
  const languageToMonaco = (lang) => {
    if (!lang) return "plaintext";
    switch (lang) {
      case "cpp":
      case "c++":
        return "cpp";
      case "c":
        return "c";
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "python":
        return "python";
      case "bash":
        return "shell";
      default:
        return lang;
    }
  };

  const extForLanguage = (lang) => {
    switch (lang) {
      case "python":
        return ".py";
      case "javascript":
        return ".js";
      case "java":
        return ".java";
      case "cpp":
      case "c++":
        return ".cpp";
      case "c":
        return ".c";
      case "bash":
        return ".sh";
      default:
        return "";
    }
  };

  // Save project to backend
  const saveProject = useCallback(
    async (showToast = true) => {
      if (!id) return;
      setSaveStatus("saving");
      try {
        const trimmedCode = (code || "").toString();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}`+`/api/v1/projects/saveProject`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: id, code: trimmedCode }),
        });
        const data = await res.json();
        if (data.success) {
          setSaveStatus("saved");
          if (showToast) toast.success(data.msg || "Project saved");
          // reset saved indicator after a short delay
          setTimeout(() => {
            if (isMounted.current) setSaveStatus("idle");
          }, 1200);
        } else {
          setSaveStatus("error");
          toast.error(data.msg || "Failed to save project");
        }
      } catch (err) {
        console.error("saveProject error:", err);
        setSaveStatus("error");
        toast.error("Something went wrong while saving the project");
      }
    },
    [code, id]
  );

  // Auto-save (debounced)
  useEffect(() => {
    // don't auto-save before project is loaded
    if (!data) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      saveProject(false); // auto-save silently (no toast)
    }, 1500); // 1.5s debounce
    return () => clearTimeout(autoSaveTimer.current);
  }, [code, data, saveProject]);

  // Keyboard shortcuts: Ctrl+S save, Ctrl+Enter run
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveProject(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runProject();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [saveProject, code, data, stdin]);

  // Run project using Piston
  const runProject = async () => {
    if (!data) {
      toast.error("Project data not loaded yet.");
      return;
    }

    setIsRunning(true);
    setRunError(false);
    setOutput(""); // clear previous

    // Determine extension and filename correctly
    const ext = extForLanguage(data.projLanguage);
    const filename = `${(data.name || "main")}${ext}`;

    const body = {
      language: data.projLanguage === "cpp" ? "cpp" : data.projLanguage,
      version: data.version || "*",
      files: [
        {
          name: filename,
          content: code || "",
        },
      ],
      stdin: stdin || "",
      args: [],
      compile_timeout: 10000,
      run_timeout: 10000,
      // request more detailed output if available — Piston returns run info
    };

    const start = Date.now();
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const resJson = await res.json();
      const tookMs = Date.now() - start;

      // Basic safety: Piston may return either "run" or top-level error
      if (resJson && resJson.run) {
        const runData = resJson.run;
        const combinedOutput = [
          runData.stdout || "",
          runData.stderr ? `\n[stderr]\n${runData.stderr}` : "",
          `\n\n[exit code] ${runData.code}`,
          `\n[time] ${tookMs}ms`,
        ].join("");

        setOutput(combinedOutput);
        setRunError(runData.code !== 0);
      } else if (resJson.message) {
        setOutput(resJson.message);
        setRunError(true);
      } else {
        setOutput(JSON.stringify(resJson, null, 2));
        setRunError(true);
      }
    } catch (err) {
      console.error("runProject error:", err);
      setOutput("Failed to run project. Check network or runtime settings.");
      setRunError(true);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
    setRunError(false);
  };

  // Editor change
  const onEditorChange = (newValue) => {
    setCode(newValue || "");
  };

  return (
    <div className="min-h-screen pt-[72px] bg-[#0d1117]">
      <div className="flex h-[calc(100vh-72px)] gap-4 px-6">
        {/* Left: Editor */}
        <div className="w-1/2 h-full rounded-lg overflow-hidden border border-[#23262a] bg-[#0b0b0c]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#0b0b0c] border-b border-[#17181a]">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-300">
                {data ? data.name : "Loading..."}
              </div>
              <div className="text-xs text-gray-400 px-2 py-0.5 bg-[#111214] rounded">
                {data ? (data.projLanguage || "plain").toUpperCase() : "—"}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-400">
                {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved ✓" : ""}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => saveProject(true)}
                className="flex items-center gap-2 px-3 py-1 rounded bg-[#212327] hover:bg-[#2a2d31]"
              >
                <Save size={14} /> Save
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={runProject}
                className="flex items-center gap-2 px-3 py-1 rounded bg-[#238636] hover:bg-[#2ea043]"
              >
                {isRunning ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />} Run
              </motion.button>
            </div>
          </div>

          <Editor2
            height="calc(100% - 40px)"
            defaultLanguage={languageToMonaco(data?.projLanguage)}
            language={languageToMonaco(data?.projLanguage)}
            theme="vs-dark"
            value={code}
            onChange={onEditorChange}
            options={{
              minimap: { enabled: false },
              wordWrap: "off",
              fontSize: 14,
            }}
          />
        </div>

        {/* Right: Console + Controls */}
        <div className="w-1/2 h-full flex flex-col gap-4">
          <div className="rounded-lg border border-[#23262a] bg-[#0b0b0c] flex-1 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#17181a]">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-gray-200">Console</div>
                <div className="text-xs text-gray-400">
                  {isRunning ? "Running..." : runError ? "Error" : "Ready"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearOutput}
                  className="px-2 py-1 rounded bg-[#212327] hover:bg-[#2a2d31] flex items-center gap-2 text-sm"
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </div>

            <div className="p-4 h-[55%] overflow-auto text-sm">
              <pre className={`whitespace-pre-wrap ${runError ? "text-red-400" : "text-gray-200"}`}>
                {output || (isRunning ? "Running... please wait" : "No output yet.")}
              </pre>
            </div>

            <div className="p-4 border-t border-[#17181a]">
              <label className="block text-xs text-gray-300 mb-1">stdin (optional)</label>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                className="w-full min-h-[64px] max-h-[160px] bg-[#0d0d0e] border border-[#1a1b1c] rounded p-2 text-sm outline-none"
                placeholder="Provide input for programs that read from stdin..."
              />
              <div className="flex justify-end mt-3 gap-2">
                <button
                  onClick={() => {
                    setStdin("");
                    toast.info("stdin cleared");
                  }}
                  className="px-3 py-1 rounded bg-[#212327] hover:bg-[#2a2d31] text-sm"
                >
                  Clear stdin
                </button>
                <button
                  onClick={runProject}
                  className="px-3 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-sm flex items-center gap-2"
                >
                  {isRunning ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />} Run
                </button>
              </div>
            </div>
          </div>

          {/* Footer: Helpful tips */}
          <div className="text-xs text-gray-400 p-2">
            <div className="flex justify-between">
              <div>
                Shortcuts: <span className="text-gray-200">Ctrl/Cmd + S</span> to save •{" "}
                <span className="text-gray-200">Ctrl/Cmd + Enter</span> to run
              </div>
              <div>Runtime: <span className="text-gray-200">{data?.projLanguage || "—"}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
