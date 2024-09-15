import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { UserContext } from "../Components/UserContext";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { saveUserData } = useContext(UserContext);
  const navigateTo = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(response.data.message);
      setIsAuthenticated(true);
      saveUserData(response.data.user); // Armazena os dados do usuário
      navigateTo("/");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="container form-component login-form">
      <h2>Login</h2>
      <p>Faça login para continuar.</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ gap: "10px", justifyContent: "flex-end", flexDirection: "row" }}>
          <p style={{ marginBottom: 0 }}>Não tem registro?</p>
          <Link to={"/register"} style={{ textDecoration: "none" }}>
            Registrar
          </Link>
        </div>
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
