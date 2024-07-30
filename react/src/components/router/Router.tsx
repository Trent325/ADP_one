import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../login/Login";
import AppNavbar from "../nav/NavBar";
import RegionSelector from "../regionSelect/Selector";

function AppRouter() {
    return (
      <Router>
        <div className="min-h-screen bg-white">
            <AppNavbar/>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Region" element={<RegionSelector />} />
          </Routes>
        </div>
     
      </Router>
    );
  }
  
  export default AppRouter;