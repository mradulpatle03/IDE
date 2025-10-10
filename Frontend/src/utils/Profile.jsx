import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import Logout from "./Logout";
import UpdateProfile from "./UpdateProfile";

// --- Popover Component (Thematic Background) ---
const Popover = ({ trigger, children }) => {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer select-none"
      >
        {trigger}
      </div>

      {open && (
        <div
          className="absolute right-0 mt-3 w-52 sm:w-64 
          bg-black/90 backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,191,0.4)] 
          rounded-xl border border-white/10 z-50 p-3 animate-fade-in"
        >
          {children}
        </div>
      )}
    </div>
  );
};

// --- Profile Component ---
const Profile = () => {
  // Get user from Redux store
  const user = useSelector((state) => state?.userReducer?.user);

  // Render loading state if user is not yet loaded
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-zinc-700 animate-pulse"></div>
        <div className="h-4 w-20 bg-zinc-700 rounded animate-pulse hidden sm:block"></div>
      </div>
    );
  }

  return (
    <Popover
      trigger={
        <div
          className="h-10 px-2 py-1 sm:px-4 flex items-center gap-2 sm:gap-3 
             rounded-full border border-transparent hover:border-teal-400/50 
             bg-zinc-800/50 hover:bg-zinc-700/70 transition-all duration-300"
        >
          {user?.profilPhoto ? (
            <img
              src={user.profilPhoto}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border border-teal-400"
            />
          ) : (
            <User className="text-teal-400 w-6 h-6 sm:w-7 sm:h-7" />
          )}

          <h1 className="text-sm text-white font-medium truncate hidden sm:block max-w-[100px]">
            {user?.fullName || "User"}
          </h1>

          <ChevronDown className="text-zinc-400 w-4 h-4 transition-transform duration-300" />
        </div>
      }
    >
      <div className="capitalize flex flex-col gap-2">
        {/* User Info */}
        <div className="p-2 border-b border-white/10 mb-2">
          <p className="text-white font-semibold text-sm truncate">
            {user?.fullName || "Guest"}
          </p>
          <p className="text-gray-400 text-xs truncate">
            {user?.email || "N/A"}
          </p>
        </div>

        {/* Update Profile */}
        <div
          className="group flex items-center gap-3 cursor-pointer text-white p-2 rounded-lg 
             hover:bg-teal-600/50 transition-colors duration-200"
        >
          <Settings
            size={20}
            className="text-teal-400 group-hover:text-white transition-colors"
          />
          <UpdateProfile />
        </div>

        {/* Logout */}
        <div
          className="group flex items-center gap-3 cursor-pointer text-white p-2 rounded-lg 
             hover:bg-red-600/50 transition-colors duration-200"
        >
          <LogOut
            size={20}
            className="text-red-400 group-hover:text-white transition-colors"
          />
          <Logout />
        </div>
      </div>
    </Popover>
  );
};

export default Profile;
