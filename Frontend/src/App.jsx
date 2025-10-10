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
    
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/user/getUser",
          { withCredentials: true }
        );
        dispatch(addUser(res.data.user)); // set global Redux state
      } catch (err) {
        console.log("No valid session, keeping persisted state intact");
        // clear state if no user/cookie
      }
    };

    fetchUser();
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
