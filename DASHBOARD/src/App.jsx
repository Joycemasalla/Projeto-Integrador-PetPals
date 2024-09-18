//define as rotas e gerencia a autenticação do usuário.

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
  // Obtém o estado de autenticação e funções do contexto
  const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);

  // Efeito colateral para verificar o estado do usuário autenticado ao carregar o aplicativo
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Faz uma requisição para obter informações do usuário autenticado
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/admin/me",
          { withCredentials: true }
        );
        // Define o usuário como autenticado e atualiza o estado do administrador
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        // Se houver um erro, define o usuário como não autenticado e limpa o estado do administrador
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  }, [setIsAuthenticated, setAdmin]);

  return (
    <Router>

      <Sidebar /> {/* Barra lateral de navegação */}

      <Routes>

        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />  {/* Rota para a página inicial, redireciona para login se não autenticado */}
        <Route path="/login" element={<Login />} />    {/* Rota para a página de login */}
        <Route path="/doctor/addnew" element={isAuthenticated ? <AddNewDoctor /> : <Navigate to="/login" />} />          {/* Rota para adicionar um novo médico, redireciona para login se não autenticado */}
        <Route path="/admin/addnew" element={isAuthenticated ? <AddNewAdmin /> : <Navigate to="/login" />} />          {/* Rota para adicionar um novo administrador, redireciona para login se não autenticado */}
        <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/login" />} />          {/* Rota para a página de mensagens, redireciona para login se não autenticado */}
        <Route path="/doctors" element={isAuthenticated ? <Doctors /> : <Navigate to="/login" />} />          {/* Rota para a página de médicos, redireciona para login se não autenticado */}
        <Route path="/admin/disponibilidade" element={isAuthenticated ? <AddAvailability /> : <Navigate to="/login" />} />          {/* Rota para adicionar disponibilidade, redireciona para login se não autenticado */}

      </Routes>
      <ToastContainer position="top-center" />        {/* Componente para exibir notificações globais */}

    </Router>
  );
};

export default App;
