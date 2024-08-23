import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    // Validação de campos obrigatórios
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/paciente/register",
        { firstName, lastName, email, phone, nic, dob, gender, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      // Limpar campos após sucesso
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setPassword("");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error(error.response?.data?.message || "Erro ao registrar");
    }
  };
  
  

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="container form-component register-form">
      <h2>Registro</h2>
      <p>Registre-se para continuar.</p>
      
      <form onSubmit={handleRegistration}>
        <div>
          <input
            type="text"
            placeholder="Primeiro Nome"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Sobrenome"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="CPF"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
          />
          <input
            type="date"
            placeholder="Data de Nascimento"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        <div>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Selecione o seu gênero</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div
          style={{
            gap: "10px",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <p style={{ marginBottom: 0 }}>Já tem registro?</p>
          <Link
            to={"/login"}
            style={{ textDecoration: "none" }}
          >
            Login 
          </Link>
        </div>
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
