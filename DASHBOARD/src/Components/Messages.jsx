import axios from "axios";
import  { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';


const Messages = () => {
  // Estado para armazenar a lista de mensagens
  const [messages, setMessages] = useState([]);
  // Contexto para verificar se o usuário está autenticado
  const { isAuthenticated } = useContext(Context);

  // Função para renderizar estrelas com base na avaliação
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i}>{i <= rating ? '★' : '☆'}</span>); // Adiciona estrela preenchida ou vazia
    }
    return stars;
  };

  // Hook useEffect para buscar mensagens quando o componente é montado
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Requisição para buscar todas as mensagens
        const { data } = await axios.get("http://localhost:4000/api/v1/message/getall", { withCredentials: true });
        setMessages(data.messages); // Atualiza o estado com as mensagens recebidas
      } catch (error) {
        // Exibe mensagem de erro se a requisição falhar
        toast.error(error.response?.data?.message || 'Falha ao buscar mensagens');
      }
    };
    fetchMessages(); // Chama a função para buscar mensagens
  }, []); // Dependência vazia para garantir que a busca ocorra apenas uma vez quando o componente é montado

  // Função para excluir uma mensagem com base no ID
  const deleteMessage = async (id) => {
    try {
      // Requisição para excluir a mensagem
      await axios.delete(`http://localhost:4000/api/v1/message/delete/${id}`, { withCredentials: true });
      // Atualiza o estado removendo a mensagem excluída
      setMessages(messages.filter((message) => message._id !== id));
      toast.success("Mensagem excluída com sucesso"); // Exibe mensagem de sucesso
    } catch (error) {
      // Exibe mensagem de erro se a exclusão falhar
      toast.error(error.response?.data?.message || 'Erro ao excluir a mensagem');
    }
  };

  // Se o usuário não estiver autenticado, redireciona para a página de login
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
