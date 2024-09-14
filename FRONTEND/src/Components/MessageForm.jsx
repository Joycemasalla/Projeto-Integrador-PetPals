import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import StarRatings from 'react-star-ratings';
import { Link } from "react-router-dom";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/paciente/me", { 
          withCredentials: true, 
          timeout: 10000
        });
        if (data.user) {
          setFirstName(data.user.firstName || "");
          setLastName(data.user.lastName || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          setIsLoggedIn(true);
        } else {
          toast.error("Dados do usuário não encontrados");
          setIsLoggedIn(false);
        }
      } catch (error) {
        if (error.response) {
          console.error("Erro ao buscar dados do usuário:", error.response.data);
          if (isLoggedIn) {
            toast.error(`Erro ao buscar dados do usuário: ${error.response.data.message || error.message}`);
          }
          setIsLoggedIn(false);
        } else if (error.code === 'ECONNABORTED') {
          console.error("Tempo de timeout excedido");
          toast.error("Tempo de timeout excedido ao buscar dados do usuário");
        } else {
          console.error("Erro desconhecido:", error);
          toast.error("Erro desconhecido ao buscar dados do usuário");
        }
      }
    };

    fetchUserData(); // Remover o `if (isLoggedIn)` para garantir que sempre busque os dados do usuário
  }, []); // Deixar as dependências vazias para chamar uma vez quando o componente é montado

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/message/send",
        { firstName, lastName, email, phone, message, rating },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setRating(0);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error.response ? error.response.data : error);
      toast.error(error.response?.data?.message || "Erro ao enviar mensagem");
    }
  };

  return (
    <div className="container form-component message-form">
      <h2>Entre em Contato</h2>
      <form onSubmit={handleMessage}>
        <div>
          <input
            type="text"
            placeholder="Nome *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Sobrenome *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Telefone *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <textarea
          rows={7}
          placeholder="Mensagem *"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <div>
          <h4>Avalie nosso serviço: *</h4>
          <StarRatings
            rating={rating}
            starRatedColor="#FFCC01"
            starEmptyColor="gray"
            starHoverColor="#009A8E"
            changeRating={setRating}
            numberOfStars={5}
            name="rating"
          />
        </div>
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
      
  );
};

export default MessageForm;
