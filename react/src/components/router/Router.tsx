import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../login/Login";
import AppNavbar from "../nav/NavBar";
import RegionSelector from "../regionSelect/Selector";
import { AuthProvider } from "../../contexts/AuthContext";
import ProtectedRoute from "../auth/ProtectedRoute";

function AppRouter() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <AppNavbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/Region"
              element={<ProtectedRoute element={<RegionSelector />} />}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default AppRouter;
