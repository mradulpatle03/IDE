import { Route, Routes, Navigate } from "react-router-dom";
import { ProtecRoutes } from "./ProtecRoutes";

// Existing pages
import Home from "../pages/Home";
import NoPage from "../pages/NoPage";
import SignUp from "../pages/Signup";
import Login from "../pages/Login";
import Editor from "../pages/Editor";
import ProjectsPage from "../pages/ProjectsPage";
import Session from "../pages/Session";
import SessionDetails from "../pages/SessionDetails";

const MainRoutes = () => {

  return (
    <Routes>
      {/* Existing routes */}
      <Route path="/" element={<Home />} />
      <Route
        path="/projects"
        element={<ProtecRoutes>
            <ProjectsPage />
          </ProtecRoutes>}
      />
      <Route 
        path="/session"
        element={<ProtecRoutes>
            <Session />
          </ProtecRoutes>}
      />
      <Route 
        path="/session/:id"
        element={<ProtecRoutes>
            <SessionDetails />
          </ProtecRoutes>}
      />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/editor/:id"
        element={<ProtecRoutes>
            <Editor />
          </ProtecRoutes>}
      />
      <Route path="*" element={<NoPage />} />
    </Routes>
  );
};

export default MainRoutes;
