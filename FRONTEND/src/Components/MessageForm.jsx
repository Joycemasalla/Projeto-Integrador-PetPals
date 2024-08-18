import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import StarRatings from 'react-star-ratings'; // Importar a biblioteca de estrelas

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0); // Estado para a avaliação

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/paciente/me", { 
          withCredentials: true, 
          timeout: 10000
        });
        setFirstName(data.user.firstName || "");
        setLastName(data.user.lastName || "");
        setEmail(data.user.email || "");
        setPhone(data.user.phone || ""); // Ajuste conforme o nome do campo para telefone
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          console.error("Tempo de timeout excedido");
          toast.error("Tempo de timeout excedido ao buscar dados do usuário");
        } else {
          console.error("Erro ao buscar dados do usuário:", error);
          toast.error("Erro ao buscar dados do usuário");
        }
      }
    };

    fetchUserData();
  }, []);

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:4000/api/v1/message/send",
          { firstName, lastName, email, phone, message, rating }, // Incluindo a avaliação no corpo da requisição
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setMessage("");
          setRating(0); // Resetando a avaliação
          window.location.reload(); // Recarrega a página após o envio bem-sucedido
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="container form-component message-form">
        <h2>Envie-nos uma Mensagem</h2>
        <form onSubmit={handleMessage}>
          <div>
            <input
              type="text"
              placeholder="Nome"
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
              type="tel"
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <textarea
            rows={7}
            placeholder="Mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div>
            <h4>Avalie nosso serviço:</h4>
            <StarRatings
              rating={rating}
              starRatedColor="#FFCC01"
              starEmptyColor="gray" // Cor das estrelas não classificadas
              starHoverColor="#009A8E" // Cor das estrelas ao passar o mouse
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
    </>
  );
};

export default MessageForm;
