// src/pages/ProjectsPage.jsx
import { useEffect, useState } from "react";
import Select from "react-select";
import { api_base_url } from "../helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search, Edit, Trash2 } from "lucide-react";

const ProjectsPage = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [isEditModelShow, setIsEditModelShow] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editProjId, setEditProjId] = useState("");
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#130026",
      borderColor: "#2d0f52",
      color: "#fff",
      boxShadow: "none",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1a0033",
      color: "#fff",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#6d28d9" : "#1a0033",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (base) => ({ ...base, color: "#fff" }),
  };

  const getRunTimes = async () => {
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/runtimes");
      const data = await res.json();
      const filtered = ["python", "javascript", "c", "c++", "java", "bash"];
      const opts = data
        .filter((r) => filtered.includes(r.language))
        .map((r) => ({
          label: `${r.language} (${r.version})`,
          value: r.language === "c++" ? "cpp" : r.language,
          version: r.version,
        }));
      setLanguageOptions(opts);
    } catch {
      toast.error("Failed to load languages");
    }
  };

  const getProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api_base_url}/api/v1/projects/getProjects`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) setProjects(data.projects);
      else toast.error(data.msg || "Failed to fetch projects");
    } catch {
      toast.error("Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
    getRunTimes();
  }, []);

  const createProj = async () => {
    if (!name.trim()) return toast.error("Enter a project name");
    if (!selectedLanguage) return toast.error("Select a language");

    try {
      const res = await fetch(`${api_base_url}/api/v1/projects/createProj`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          projLanguage: selectedLanguage.value,
          version: selectedLanguage.version,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCreateModelShow(false);
        setName("");
        navigate(`/editor/${data.projectId}`);
      } else toast.error(data.msg);
    } catch {
      toast.error("Error creating project");
    }
  };

  const updateProj = async () => {
    if (!name.trim()) return toast.error("Project name cannot be empty");

    try {
      const res = await fetch(`${api_base_url}/api/v1/projects/editProject`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: editProjId, name }),
      });
      const data = await res.json();
      if (data.success) toast.success("Project updated");
      else toast.error(data.msg);
      getProjects();
      setIsEditModelShow(false);
    } catch {
      toast.error("Error updating project");
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`${api_base_url}/api/v1/projects/deleteProject`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id }),
      });
      const data = await res.json();
      if (data.success) toast.success("Project deleted");
      else toast.error(data.msg);
      getProjects();
    } catch {
      toast.error("Error deleting project");
    }
  };

  const filteredProjects = projects?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0a0014] min-h-screen text-white pt-[80px]">
      {/* Header */}
      <header className="flex items-center justify-between px-12 py-6 backdrop-blur-md ">
        <h1 className="text-3xl font-bold text-[#c084fc] tracking-wide drop-shadow-[0_0_10px_#a855f7]">
          My Projects
        </h1>
        <button
          onClick={() => setIsCreateModelShow(true)}
          className="px-6 py-2 bg-gradient-to-r from-[#7e22ce] to-[#a855f7] hover:from-[#a855f7] hover:to-[#7e22ce] rounded-lg font-semibold shadow-lg hover:shadow-[0_0_15px_#a855f7] transition-all"
        >
          + New Project
        </button>
      </header>

      {/* Search Bar */}
      <div className="px-12 py-6 flex items-center gap-3">
        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#130026] border border-[#2d0f52] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition-all"
          />
        </div>
      </div>

      {/* Projects */}
      <main className="px-12 pb-12">
        {loading ? (
          <div className="flex justify-center mt-20">
            <Loader2 className="animate-spin text-[#8b5cf6]" size={32} />
          </div>
        ) : filteredProjects?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                whileHover={{ scale: 1.03 }}
                className="bg-[#130026] border border-[#2d0f52] p-5 rounded-lg shadow-md shadow-[#7e22ce]/30 transition-all hover:shadow-[#a855f7]/40 flex flex-col justify-between"
              >
                <div
                  onClick={() => navigate(`/editor/${project._id}`)}
                  className="cursor-pointer"
                >
                  <h2 className="text-xl font-semibold text-[#f3f3f3]">
                    {project.name}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(project.date).toDateString()}
                  </p>
                  <p className="text-xs mt-2 uppercase text-[#a855f7]">
                    {project.projLanguage}
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={() => {
                      setIsEditModelShow(true);
                      setEditProjId(project._id);
                      setName(project.name);
                    }}
                    className="p-2 rounded-md bg-[#7e22ce]/20 hover:bg-[#7e22ce]/40 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="p-2 rounded-md bg-[#ef4444]/20 hover:bg-[#ef4444]/40 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-20">
            No Projects Found. Start by creating one!
          </p>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isCreateModelShow && (
          <Modal
            title="Create New Project"
            name={name}
            setName={setName}
            setShow={setIsCreateModelShow}
            action={createProj}
            selectOptions={languageOptions}
            setSelectedLanguage={setSelectedLanguage}
            customStyles={customStyles}
          />
        )}
        {isEditModelShow && (
          <Modal
            title="Edit Project"
            name={name}
            setName={setName}
            setShow={setIsEditModelShow}
            action={updateProj}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Modal = ({
  title,
  name,
  setName,
  setShow,
  action,
  selectOptions,
  setSelectedLanguage,
  customStyles,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50"
    onClick={(e) => e.target.classList.contains("fixed") && setShow(false)}
  >
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      className="bg-[#130026] p-6 rounded-xl border border-[#2d0f52] w-96 shadow-[0_0_20px_#7e22ce50]"
    >
      <h3 className="text-2xl font-bold mb-5 text-[#c084fc]">{title}</h3>
      <input
        type="text"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded-md bg-[#0a0014] border border-[#2d0f52] text-white focus:ring-2 focus:ring-[#8b5cf6]"
      />
      {selectOptions && (
        <Select
          placeholder="Select Language"
          options={selectOptions}
          styles={customStyles}
          onChange={setSelectedLanguage}
        />
      )}
      <button
        onClick={action}
        className="mt-5 w-full py-2 bg-gradient-to-r from-[#7e22ce] to-[#a855f7] hover:from-[#a855f7] hover:to-[#7e22ce] rounded-md font-semibold shadow-lg hover:shadow-[0_0_15px_#a855f7] transition-all"
      >
        Confirm
      </button>
    </motion.div>
  </motion.div>
);

export default ProjectsPage;
