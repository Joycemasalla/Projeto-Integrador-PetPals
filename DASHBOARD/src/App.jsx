import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import AddNewDoctor from "./Components/AddNewDoctor";
import Messages from "./Components/Messages";
import Doctors from "./Components/Doctors";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Components/Sidebar";
import AddNewAdmin from "./Components/AddNewAdmin";
import "./App.css";
import AddAvailability from "./Components/AddAvailability";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/admin/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  }, [setIsAuthenticated, setAdmin]);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/addnew" element={isAuthenticated ? <AddNewDoctor /> : <Navigate to="/login" />} />
        <Route path="/admin/addnew" element={isAuthenticated ? <AddNewAdmin /> : <Navigate to="/login" />} />
        <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/doctors" element={isAuthenticated ? <Doctors /> : <Navigate to="/login" />} />
        <Route path="/admin/disponibilidade" element={isAuthenticated ? <AddAvailability /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
