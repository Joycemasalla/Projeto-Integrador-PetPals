import { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const AddNewAdmin = () => {
  // Pega o valor do contexto de autenticação, que diz se o usuário está logado
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  // Estados para armazenar as informações do novo admin que será cadastrado
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [nic, setNic] = useState(""); 
  const [dob, setDob] = useState(""); 
  const [gender, setGender] = useState(""); 
  const [password, setPassword] = useState(""); 

  // Hook para redirecionar o usuário para outra página depois de uma ação
  const navigateTo = useNavigate();

  // Função que será executada quando o formulário for enviado
  const handleAddNewAdmin = async (e) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    try {
      // Faz a requisição para o backend criando um novo admin
      await axios
        .post(
          "http://localhost:4000/api/v1/user/admin/addnew", 
          { firstName, lastName, email, phone, nic, dob, gender, password }, // Dados enviados para o servidor
          {
            withCredentials: true, // Envia os cookies junto com a requisição
            headers: { "Content-Type": "application/json" }, // Define o tipo do conteúdo como JSON
          }
        )
        .then((res) => {
          // Se a requisição for bem-sucedida, mostra uma mensagem de sucesso
          toast.success(res.data.message);
          // Define o estado de autenticação como verdadeiro (admin logado)
          setIsAuthenticated(true);
          // Redireciona o usuário para a página inicial
          navigateTo("/");
          // Limpa os campos do formulário depois do sucesso
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setNic("");
          setDob("");
          setGender("");
          setPassword("");
        });
    } catch (error) {
      // Se a requisição falhar, mostra uma mensagem de erro com o motivo
      toast.error(error.response.data.message);
    }
  };

  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // Renderiza o formulário de cadastro de um novo admin



  return (
    <section className="page">
      <section className="container form-component add-admin-form">
      <h1 className="form-title">ADD NOVO ADMIN</h1>
        <form onSubmit={handleAddNewAdmin}>
          <div>
            <input
              type="text"
              placeholder="Nome *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Sobrenome *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Telefone *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="string"
              placeholder="CPF *"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
            <input
              type={"date"}
              placeholder="Data de Nascimento *"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Selecione seu gênero</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
            <input
              type="password"
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Adicionar</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewAdmin;
