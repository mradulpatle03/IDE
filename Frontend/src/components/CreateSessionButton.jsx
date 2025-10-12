import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, X, Loader2 } from "lucide-react";

const CreateSessionButton = () => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
  });

  // --- Handle Input ---
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // --- API Function ---
  const createSessionApi = async () => {
    const res = await axios.post(
      "http://localhost:8000/api/v1/session/createSession",
      formData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  // --- Mutation ---
  const mutation = useMutation({
    mutationFn: createSessionApi,
    onSuccess: () => {
      toast.success("Session Created ✅");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setFormData({ role: "", experience: "", topicsToFocus: "" });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create session ❌");
    },
  });

  // --- Submit ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus } = formData;
    if (!role || !experience || !topicsToFocus) {
      toast.error("Please fill all fields ❌");
      return;
    }
    mutation.mutate();
  };

  return (
    <>
      {/* --- Create Session Button --- */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 px-6 py-3 rounded-xl
                   bg-gradient-to-r from-[#b53dff] to-[#ff3db5]
                   text-white font-semibold tracking-wide
                   shadow-[0_0_25px_rgba(181,61,255,0.4)]
                   hover:shadow-[0_0_40px_rgba(181,61,255,0.6)]
                   transition-all duration-300 active:scale-95"
      >
        <PlusCircle size={22} className="animate-pulse" />
        Create Session
      </button>

      {/* --- Modal --- */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[90%] sm:w-[420px] bg-[#120421]/80 border border-[#b53dff50]
                       rounded-2xl p-8 shadow-2xl backdrop-blur-xl
                       text-white animate-scaleIn"
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-extrabold text-center mb-6 text-[#ff3db5] tracking-wide drop-shadow-[0_0_20px_rgba(181,61,255,0.4)]">
              New Session
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-sm text-[#b53dff]/80 mb-1 block">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Enter your role"
                  className="w-full px-4 py-2 bg-[#1e0e33] text-white rounded-lg 
                             border border-[#2c1a47] focus:border-[#b53dff] 
                             outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="text-sm text-[#b53dff]/80 mb-1 block">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Enter your experience"
                  className="w-full px-4 py-2 bg-[#1e0e33] text-white rounded-lg 
                             border border-[#2c1a47] focus:border-[#b53dff] 
                             outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="text-sm text-[#b53dff]/80 mb-1 block">
                  Topics to Focus
                </label>
                <input
                  type="text"
                  name="topicsToFocus"
                  value={formData.topicsToFocus}
                  onChange={handleChange}
                  placeholder="Enter key topics"
                  className="w-full px-4 py-2 bg-[#1e0e33] text-white rounded-lg 
                             border border-[#2c1a47] focus:border-[#b53dff] 
                             outline-none transition-all duration-300"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="mt-4 w-full py-3 rounded-xl font-semibold text-lg
                           bg-gradient-to-r from-[#b53dff] to-[#ff3db5]
                           shadow-[0_0_25px_rgba(181,61,255,0.3)]
                           hover:shadow-[0_0_40px_rgba(181,61,255,0.6)]
                           transition-all duration-300 active:scale-95 
                           disabled:opacity-70 flex items-center justify-center"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Session"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-xs text-gray-400 mt-6 text-center">
              Please ensure all details are accurate before creating.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateSessionButton;
