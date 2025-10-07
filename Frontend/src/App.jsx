import { useLocation } from "react-router-dom";
import MainRoutes from "./Routes/MainRoutes";
import Navbar from "./components/Navbar";

const App = () => {
  const location = useLocation();

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
