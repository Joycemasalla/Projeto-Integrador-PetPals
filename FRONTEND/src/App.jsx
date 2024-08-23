import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login";
import Consultas from "./Pages/Consultas";
import NossosServicos from "./Pages/NossosServicos";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) { // Verifica se o usuário está autenticado antes de tentar buscar os dados
        try {
          const response = await axios.get(
            "http://localhost:4000/api/v1/user/paciente/me",
            { withCredentials: true }
          );
          setUser(response.data.user);
        } catch (error) {
          if (error.response) {
            console.error("Erro ao buscar dados do usuário:", error.response.data);
            toast.error(`Erro ao buscar dados do usuário: ${error.response.data.message || 'Erro desconhecido'}`);
          } else if (error.request) {
            console.error("Erro na solicitação ao buscar dados do usuário:", error.request);
            toast.error("Erro na solicitação ao buscar dados do usuário");
          } else {
            console.error("Erro ao configurar solicitação ao buscar dados do usuário:", error.message);
            toast.error("Erro ao configurar solicitação ao buscar dados do usuário");
          }
          setIsAuthenticated(false);
          setUser({});
        }
      } else {
        // Se não estiver autenticado, redefina o estado do usuário
        setUser({});
      }
    };

    fetchUser();
  }, [isAuthenticated, setIsAuthenticated, setUser]); // Adiciona dependências para evitar problemas

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agendamentos" element={<Consultas />} />
          <Route path="/servicos" element={<NossosServicos />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
