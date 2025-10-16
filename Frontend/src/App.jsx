import { useLocation } from "react-router-dom";
import MainRoutes from "./Routes/MainRoutes";
import Navbar from "./components/Navbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addUser, removeUser } from "./Store/user.Reducer";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}`+`/api/v1/auth/checkToken`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(addUser({user: data.user}));
        } else {
          dispatch(removeUser());
          localStorage.removeItem("persist:root");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        dispatch(removeUser());
        localStorage.removeItem("persist:root");
      } finally {
        // setAuthChecked(true);
      }
    }

    checkAuth();
  }, [dispatch]);
  // Hide navbar on specific routes
  const hiddenRoutes = ["/register", "/login"];

  return (
    <div className="w-full">
      {!hiddenRoutes.includes(location.pathname) && <Navbar />}
      <MainRoutes />
    </div>
  );
};

export default App;
