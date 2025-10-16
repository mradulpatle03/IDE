import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CreateSessionButton from "../components/CreateSessionButton";
import { useState } from "react";

const Session = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // ---- Fetch Sessions ----
  const getSession = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}`+"/api/v1/session/getMySession",
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });

  // ---- Delete Session ----
  const deleteSessionApi = async (id) => {
    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}`+`/api/v1/session/deleteMySession/${id}`,
      { withCredentials: true }
    );
    return res.data;
  };

  const deleteMutation = useMutation({
    mutationFn: deleteSessionApi,
    onSuccess: () => {
      toast.success("Session deleted successfully ✅");
      queryClient.invalidateQueries(["session"]);
      setSessionToDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete session ❌");
      setSessionToDelete(null);
    },
  });

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setSessionToDelete(id);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      deleteMutation.mutate(sessionToDelete);
    }
  };

  const navigateSession = (id) => navigate(`/session/${id}`);

  const isRefreshing = isLoading || isFetching;

  return (
    <div className="mt-[64px] sm:mt-[72px] lg:mt-[80px] relative w-full min-h-screen p-6 md:p-12 bg-gradient-to-b from-[#080011] via-[#10041b] to-[#080011] overflow-hidden">
      {/* Background glow animation */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#b53dff20] via-transparent to-transparent blur-3xl"></div>

      {/* Header Section */}
      <div className="flex justify-between items-center max-w-[1400px] mx-auto mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(181,61,255,0.2)]">
            My <span className="text-[#b53dff]">Sessions</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Manage and review your interview practice sessions.
          </p>
        </div>

        <div className="relative">
          <CreateSessionButton />
          {isRefreshing && (
            <Loader2 className="absolute -right-7 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b53dff] animate-spin" />
          )}
        </div>
      </div>

      {/* Session Grid */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#ff3db5] animate-spin mb-4" />
            <p className="text-lg text-gray-300">Loading your sessions...</p>
          </div>
        ) : data?.session?.length > 0 ? (
          data.session.map((item, index) => (
            <div
              key={item._id}
              onClick={() => navigateSession(item._id)}
              style={{ animationDelay: `${index * 0.08}s` }}
              className="group relative bg-[#140a24] border 
                        rounded-2xl shadow-lg  overflow-hidden cursor-pointer
                        transform transition-all duration-500 ease-out hover:scale-[1.05]
                        shadow-[#b53dff]/30 border-[#b53dff80]
                        animate-fadeIn"
            >
              {/* Glowing top accent */}
              <div className="absolute top-0 left-0 w-full h-1/5 bg-gradient-to-b from-[#b53dff20] to-transparent"></div>

              {/* Delete button */}
              <button
                onClick={(e) => handleDeleteClick(e, item._id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-red-500/10 text-red-400 
                           opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition"
              >
                {deleteMutation.isPending && sessionToDelete === item._id ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>

              {/* Card Content */}
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-sm font-semibold text-[#ff3db5]/80 uppercase tracking-widest mb-2">
                    Role
                  </h3>
                  <h2 className="text-2xl font-bold text-white leading-snug line-clamp-2">
                    {item.role}
                  </h2>
                </div>

                <div className="mt-6 border-t border-[#b53dff30] pt-3 space-y-2">
                  <div className="text-gray-300 text-sm">
                    <span className="font-medium text-[#b53dff]/90">
                      Experience:
                    </span>{" "}
                    <span>{item.experience} years</span>
                  </div>
                  <div className="text-gray-300 text-sm truncate">
                    <span className="font-medium text-[#b53dff]/90">
                      Topics:
                    </span>{" "}
                    {item.topicsToFocus || "General"}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-24">
            <div className="text-[#b53dff] mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              No Sessions Found
            </h2>
            <p className="text-gray-400">
              Create a new session to get started!
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSessionToDelete(null)}
        >
          <div
            className="bg-[#1e0e33] p-6 rounded-lg shadow-2xl max-w-sm w-full border border-red-500/50"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-3">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to permanently delete this session?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 text-sm bg-[#331e4d] text-gray-200 rounded-md hover:bg-[#472a6b] transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Session;
