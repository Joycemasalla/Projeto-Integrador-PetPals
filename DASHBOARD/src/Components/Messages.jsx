import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i}>{i <= rating ? '★' : '☆'}</span>);
    }
    return stars;
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/message/getall", { withCredentials: true });
        setMessages(data.messages);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Falha ao buscar mensagens');
      }
    };
    fetchMessages();
  }, []);

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/message/delete/${id}`, { withCredentials: true });
      setMessages(messages.filter((message) => message._id !== id));
      toast.success("Mensagem excluída com sucesso");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao excluir a mensagem');
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <ToastContainer />
      <h1>Mensagens</h1>
      <div className="bannermensagem">
        {messages && messages.length > 0 ? (
          messages.map((element) => {
            const createdAt = new Date(element.createdAt);
            const isValidDate = !isNaN(createdAt.getTime());
            const formattedDate = isValidDate ? format(createdAt, 'dd/MM/yyyy HH:mm:ss') : 'Data inválida';

            return (
              <div className="cardmensagem" key={element._id}>
                <div className="delete-container">
                  <button className="delete-buttonmensagem" onClick={() => deleteMessage(element._id)}>
                    <FaTrash />
                  </button>
                </div>
                <div className="detalhesmensagem">
                  <p>Nome: <span>{element.firstName}</span></p>
                  <p>Sobrenome: <span>{element.lastName}</span></p>
                  <p>Email: <span>{element.email}</span></p>
                  <p>Telefone: <span>{element.phone}</span></p>
                  <p>Mensagem: <span>{element.message}</span></p>
                  <p>Avaliação: {renderStars(element.rating)}</p>
                  <span>{formattedDate}</span>
                </div>
              </div>
            );
          })
        ) : (
          <h1>Nenhuma mensagem encontrada!</h1>
        )}
      </div>
    </section>
  );
};

export default Messages;
