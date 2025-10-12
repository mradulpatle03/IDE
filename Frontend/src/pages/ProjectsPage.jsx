import { useEffect, useState } from "react";
import Select from "react-select";
import { api_base_url } from "../helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null); // State to store selected language

  const [isEditModelShow, setIsEditModelShow] = useState(false);

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#000",
      borderColor: "#555",
      color: "#fff",
      padding: "5px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#000",
      color: "#fff",
      width: "100%",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#333" : "#000",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#aaa",
    }),
  };

  const getRunTimes = async () => {
    let res = await fetch("https://emkc.org/api/v2/piston/runtimes");
    let data = await res.json();

    // Filter only the required languages
    const filteredLanguages = [
      "python",
      "javascript",
      "c",
      "c++",
      "java",
      "bash",
    ];

    const options = data
      .filter((runtime) => filteredLanguages.includes(runtime.language))
      .map((runtime) => ({
        label: `${runtime.language} (${runtime.version})`,
        value: runtime.language === "c++" ? "cpp" : runtime.language,
        version: runtime.version,
      }));

    setLanguageOptions(options);
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption); // Update selected language state
    console.log("Selected language:", selectedOption);
  };

  const [projects, setProjects] = useState(null);

  const getProjects = async () => {
    try {
      
      const res = await fetch(`${api_base_url}/api/v1/projects/getProjects`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setProjects(data.projects);
      } else {
        toast.error(data.msg || "Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Something went wrong while fetching projects");
    }
  };

  useEffect(() => {
    getProjects();
    getRunTimes();
  }, []);

  const createProj = async () => {
    try {
      const res = await fetch(`${api_base_url}/api/v1/projects/createProj`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          projLanguage: selectedLanguage.value,
          version: selectedLanguage.version,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setName("");
        navigate(`/editor/${data.projectId}`);
      } else {
        toast.error(data.msg || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Something went wrong while creating the project");
    }
  };

  const deleteProject = async (id) => {
    const conf = confirm("Are you sure you want to delete this project?");
    if (!conf) return;

    try {
      const res = await fetch(`${api_base_url}/api/v1/projects/deleteProject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: id }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Project deleted successfully");
        getProjects();
      } else {
        toast.error(data.msg || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Something went wrong while deleting the project");
    }
  };

  const [editProjId, setEditProjId] = useState("");

  const updateProj = async () => {
    try {
      const res = await fetch(`${api_base_url}/api/v1/projects/editProject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: editProjId,
          name: name,
        }),
      });

      const data = await res.json();

      setIsEditModelShow(false);
      setName("");
      setEditProjId("");

      if (data.success) {
        toast.success("Project updated successfully");
        getProjects();
      } else {
        toast.error(data.msg || "Failed to update project");
        getProjects();
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Something went wrong while updating the project");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between px-16 py-6 bg-[#0d1117] mt-[64px] sm:mt-[72px] lg:mt-[80px]">
        <h1 className="text-3xl font-bold text-[#58a6ff] tracking-tight">
          Dev Dashboard
        </h1>
        <button
          onClick={() => setIsCreateModelShow(true)}
          className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold rounded-md shadow-sm transition-all duration-200"
        >
          + New Project
        </button>
      </header>

      {/* Projects Section */}
      <main className="px-16 py-10 bg-[#0d1117] min-h-screen">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-[#161b22] border border-[#21262d] rounded-lg p-5 flex flex-col justify-between hover:shadow-lg hover:border-[#58a6ff] transition-all duration-200"
              >
                <div
                  onClick={() => navigate("/editor/" + project._id)}
                  className="cursor-pointer flex items-start gap-4"
                >
                  <img
                    src={
                      project.projLanguage === "python"
                        ? "https://images.ctfassets.net/em6l9zw4tzag/oVfiswjNH7DuCb7qGEBPK/b391db3a1d0d3290b96ce7f6aacb32b0/python.png"
                        : project.projLanguage === "javascript"
                        ? "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
                        : project.projLanguage === "cpp"
                        ? "https://upload.wikimedia.org/wikipedia/commons/3/32/C%2B%2B_logo.png"
                        : project.projLanguage === "c"
                        ? "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png"
                        : project.projLanguage === "java"
                        ? "https://static-00.iconduck.com/assets.00/java-icon-1511x2048-6ikx8301.png"
                        : project.projLanguage === "bash"
                        ? "https://upload.wikimedia.org/wikipedia/commons/8/82/Gnu-bash-logo.svg"
                        : ""
                    }
                    alt={project.projLanguage}
                    className="w-20 h-20 object-contain rounded-md border border-[#30363d]"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {project.name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(project.date).toDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setIsEditModelShow(true);
                      setEditProjId(project._id);
                      setName(project.name);
                    }}
                    className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md font-medium transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-20 text-lg">
            No Projects Found. Start by creating one!
          </p>
        )}
      </main>

      {/* Create Project Modal */}
      {isCreateModelShow && (
        <div
          onClick={(e) =>
            e.target.classList.contains("modelCon") &&
            setIsCreateModelShow(false)
          }
          className="modelCon fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.75)] backdrop-blur-md z-50"
        >
          <div className="bg-[#161b22] rounded-lg p-6 w-96 border border-[#30363d] shadow-md flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[#58a6ff]">
              Create New Project
            </h3>
            <input
              type="text"
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#0d1117] border border-[#30363d] text-white focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
            />
            <Select
              placeholder="Select Language"
              options={languageOptions}
              styles={customStyles}
              onChange={handleLanguageChange}
            />
            {selectedLanguage && (
              <>
                <p className="text-sm text-green-400">
                  Selected Language: {selectedLanguage.label}
                </p>
                <button
                  onClick={createProj}
                  className="mt-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md font-semibold transition-all duration-200"
                >
                  Create Project
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModelShow && (
        <div
          onClick={(e) =>
            e.target.classList.contains("modelCon") && setIsEditModelShow(false)
          }
          className="modelCon fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.75)] backdrop-blur-md z-50"
        >
          <div className="bg-[#161b22] rounded-lg p-6 w-96 border border-[#30363d] shadow-md flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[#58a6ff]">Update Project</h3>
            <input
              type="text"
              placeholder="New Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#0d1117] border border-[#30363d] text-white focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
            />
            <button
              onClick={updateProj}
              className="mt-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md font-semibold transition-all duration-200"
            >
              Update Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
