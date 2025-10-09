import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const UpdateProfile = () => {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (fullName.trim()) {
      formData.append("fullName", fullName);
    }

    if (profilePhoto) {
      formData.append("profilPhoto", profilePhoto);
    }

    if (!formData.has("fullName") && !formData.has("profilPhoto")) {
      toast.error("Please provide at least one field to update.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "https://localhost:8000/api/v1/user/updateProfile",
        formData,
        { withCredentials: true }
      );
      toast.success("Profile updated successfully!");
      setOpen(false);
      setFullName("");
      setProfilePhoto(null);
    } catch (error) {
      console.error(error.response);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trigger Button - Enhanced Teal/Green Theme */}
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left font-medium cursor-pointer" // Added for integration into the popover menu
      >
        {/* Inner content for the button (adjust as needed for placement) */}
        Update Profile
      </button>

      {/* Dialog Overlay - Dark, Subtle Overlay */}
      {open && (
        <div className="fixed top-24 inset-0 flex items-center justify-center bg-black backdrop-blur-sm z-50 p-4 transition-opacity duration-300">
          {/* Modal/Dialog Card - Glassmorphic & Thematic */}
          <div className="relative w-full max-w-lg bg-black backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,255,191,0.3)] border border-white/10 animate-scale-in">
            {/* Header */}
            <h2 className="text-2xl font-bold text-teal-400 mb-1 tracking-wider">
              Update Profile
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Refine your digital identity below.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name Input - Darker background, Teal focus ring */}
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter Full Name (optional)"
                className="border border-white/20 rounded-xl px-4 py-3 bg-[#13171f] text-white 
            placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200"
              />

              {/* Profile Photo Input - Thematic file input styling */}
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 
            file:rounded-xl file:border-0 file:text-sm file:font-semibold
            file:bg-teal-700/50 file:text-teal-200 hover:file:bg-teal-600/70
            transition-all duration-200 file:cursor-pointer"
              />

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  // Cancel Button - Outline style for secondary action
                  className="flex-1 px-2 py-3 rounded-xl font-semibold text-gray-400 border border-gray-600 
              hover:bg-gray-700/50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  // Update Button - Teal Gradient for primary action
                  className={`flex-1 px-2 py-3 rounded-xl font-bold tracking-wider text-white 
                bg-gradient-to-r from-teal-500 to-green-500 
                shadow-[0_0_15px_rgba(0,255,191,0.5)] transition-all duration-300 transform active:scale-[0.98] ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-teal-600 hover:to-green-600 hover:shadow-[0_0_20px_rgba(0,255,191,0.7)]"
                }`}
                >
                  {loading ? "PROCESSING..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
