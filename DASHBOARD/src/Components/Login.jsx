import  { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
const Login = () => {
  // Estados para armazenar email e senha do usuário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Contexto para verificar se o usuário está autenticado e para atualizar o estado de autenticação
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  // Hook para navegação
  const navigateTo = useNavigate();

  // Função para lidar com o login do usuário
  const handleLogin = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    try {
      await axios
        .post(
          "http://localhost:4000/api/v1/user/login",
          { email, password, role: "Admin" }, // Envia os dados do formulário para o backend
          {
            withCredentials: true, // Inclui cookies com a requisição
            headers: { "Content-Type": "application/json" }, // Define o tipo de conteúdo como JSON
          }
        )
        .then((res) => {
          toast.success(res.data.message); // Exibe mensagem de sucesso
          setIsAuthenticated(true); // Atualiza o estado de autenticação
          navigateTo("/"); // Redireciona para a página principal
          setEmail(""); // Limpa o campo de email
          setPassword(""); // Limpa o campo de senha
        });
    } catch (error) {
      toast.error(error.response.data.message); // Exibe mensagem de erro se a autenticação falhar
    }
  };

  // Se o usuário já estiver autenticado, redireciona para a página principal
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }



  return (
    <>
      <section className="container form-component">
      <img src="/src/assets/logo.png" alt="logo" className="logo" style={{ width: '200px', height: 'auto' }} />
      <h1 className="form-title">BEM VINDO A PETPALS</h1>
        <p>Somente administradores têm permissão para acessar esses recursos!</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <input
            type="password"
            placeholder="Confirme Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          /> */}
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Login</button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
