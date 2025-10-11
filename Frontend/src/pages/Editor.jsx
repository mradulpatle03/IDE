import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Editor2 from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { api_base_url } from "../helper";
import { toast } from "react-toastify";

const Editor = () => {
  const [code, setCode] = useState("");
  const { id } = useParams();
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);

  const [data, setData] = useState(null);

  // Fetch project data on mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${api_base_url}/api/v1/projects/getProject`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId: id }),
        });

        const data = await res.json();

        if (data.success) {
          setCode(data.project.code);
          setData(data.project);
        } else {
          toast.error(data.msg || "Failed to fetch project");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        toast.error("Failed to load project.");
      }
    };

    if (id) fetchProject();
  }, [id]);

  // Save project function
  const saveProject = async () => {
    const trimmedCode = code?.toString().trim();
    console.log("Saving code:", trimmedCode);

    try {
      const res = await fetch(`${api_base_url}/api/v1/projects/saveProject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: id,
          code: trimmedCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.msg || "Project saved successfully");
      } else {
        toast.error(data.msg || "Failed to save project");
      }
    } catch (err) {
      console.error("Error saving project:", err);
      toast.error("Something went wrong while saving the project");
    }
  };

  // Shortcut handler for saving with Ctrl+S
  const handleSaveShortcut = (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault(); // Prevent browser's default save behavior
      saveProject(); // Call the save function
    }
  };

  // Add and clean up keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleSaveShortcut);
    return () => {
      window.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [code]); // Reattach when `code` changes

  const runProject = () => {
    fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: data.projLanguage,
        version: data.version,
        files: [
          {
            filename:
              data.name + data.projLanguage === "python"
                ? ".py"
                : data.projLanguage === "java"
                ? ".java"
                : data.projLanguage === "javascript"
                ? ".js"
                : data.projLanguage === "c"
                ? ".c"
                : data.projLanguage === "cpp"
                ? ".cpp"
                : data.projLanguage === "bash"
                ? ".sh"
                : "",
            content: code,
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOutput(data.run.output);
        setError(data.run.code === 1 ? true : false);
      });
  };

  return (
    <>
      <div
        className="flex items-center justify-between"
        style={{ height: "calc(100vh - 90px)" }}
      >
        <div className="left w-[50%] h-full">
          <Editor2
            onChange={(newCode) => {
              console.log("New Code:", newCode); // Debug: Log changes
              setCode(newCode || ""); // Update state
            }}
            theme="vs-dark"
            height="100%"
            width="100%"
            language="python"
            value={code} // Bind editor to state
          />
        </div>
        <div className="right p-[15px] w-[50%] h-full bg-[#27272a]">
          <div className="flex pb-3 border-b-[1px] border-b-[#1e1e1f] items-center justify-between px-[30px]">
            <p className="p-0 m-0">Output</p>
            <button
              className="btnNormal !w-fit !px-[20px] bg-blue-500 transition-all hover:bg-blue-600"
              onClick={runProject} // Save when clicking the button
            >
              run
            </button>
          </div>
          <pre
            className={`w-full h-[75vh] ${error ? "text-red-500" : ""}`}
            style={{ textWrap: "nowrap" }}
          >
            {output}
          </pre>
        </div>
      </div>
    </>
  );
};

export default Editor;
