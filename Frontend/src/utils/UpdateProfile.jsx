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
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800"
      >
        Update Profile
      </button>

      {/* Dialog Overlay */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-[90%] max-w-md rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-1">Update Profile</h2>
            <p className="text-gray-500 text-sm mb-4">
              Please fill out the form below to update your profile information.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name Input */}
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter Full Name (optional)"
                className="border border-gray-400 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Profile Photo Input */}
              <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-400 rounded-lg px-3 py-2 outline-none file:cursor-pointer"
              />

              {/* Buttons */}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 border border-gray-400 rounded-lg py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-zinc-900 text-white py-2 rounded-lg ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:bg-zinc-800"
                  }`}
                >
                  {loading ? "Updating..." : "Update"}
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
