import { useContext, useEffect, useState } from "react"; 
import { Context } from "../main"; 
import { Navigate } from "react-router-dom"; 
import axios from "axios"; 
import { toast } from "react-toastify"; // Biblioteca para exibir notificações
import { GoCheckCircleFill } from "react-icons/go"; // Ícones para status de sucesso
import { AiFillCloseCircle, AiFillDelete } from "react-icons/ai"; // Ícones de fechar e deletar
import { format } from "date-fns"; // Biblioteca para formatar datas
import { FaInfo } from "react-icons/fa"; // Ícone para exibir informações

const Dashboard = () => {
  // Estados para armazenar as listas de agendamentos e doutores
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Estado para armazenar o agendamento selecionado e controlar a exibição do modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // useEffect é usado para buscar agendamentos e doutores assim que o componente é montado
  useEffect(() => {
    // Função assíncrona para buscar os agendamentos
    const fetchAppointments = async () => {
      try {
        // Faz uma requisição GET para buscar todos os agendamentos
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true } // Inclui os cookies para autenticação
        );
        setAppointments(data.appointments); // Atualiza o estado com os agendamentos
      } catch (error) {
        setAppointments([]); // Caso dê erro, define agendamentos como uma lista vazia
      }
    };

    // Função assíncrona para buscar a lista de doutores
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors); // Atualiza o estado com a lista de doutores
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Falha ao buscar doutores."
        );
      }
    };

    fetchAppointments(); // Chama a função para buscar agendamentos
    fetchDoctors(); // Chama a função para buscar doutores
  }, []); // O array vazio indica que essa lógica executa uma vez quando o componente é montado

  // Função para atualizar o status de um agendamento
  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      // Faz uma requisição PUT para atualizar o status do agendamento
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status }, // O status que será atualizado
        { withCredentials: true }
      );

      // Atualiza o estado dos agendamentos com o novo status
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );

      // Se o status for "Aceito", remove a disponibilidade associada
      if (status === "Aceito") {
        const appointment = appointments.find((a) => a._id === appointmentId);

        if (appointment) {
          const { disponibilityId } = appointment; // ID da disponibilidade

          if (disponibilityId) {
            // Faz uma requisição DELETE para remover a disponibilidade
            await axios.delete(
              `http://localhost:4000/api/v1/admin/disponibilidade/${disponibilityId}`,
              { withCredentials: true }
            );

            toast.success("Horário excluído com sucesso.");
          }
        }
      }

      toast.success(data.message); // Exibe uma mensagem de sucesso
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar status.");
    }
  };

  // Função para deletar um agendamento
  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/appointment/delete/${appointmentId}`,
        { withCredentials: true }
      );
      // Remove o agendamento deletado da lista de agendamentos
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      toast.success(data.message); // Exibe mensagem de sucesso
    } catch (error) {
      toast.error(error.response?.data?.message || "Falha ao deletar agendamento.");
    }
  };

  // Função para exibir os detalhes de um agendamento em um modal
  const handleDetailsClick = (appointment) => {
    setSelectedAppointment(appointment); // Define o agendamento selecionado
    setModalOpen(true); // Abre o modal
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalOpen(false); // Fecha o modal
    setSelectedAppointment(null); // Limpa o agendamento selecionado
  };

  // Função para formatar a data de um agendamento
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return format(parsedDate, 'dd/MM/yyyy HH:mm:ss'); // Formata a data
    }
    return "Data inválida"; // Retorna uma mensagem de erro se a data for inválida
  };

  // Verifica se o usuário está autenticado e é administrador
  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />; // Se não estiver autenticado, redireciona para login
  }



  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <img src="/src/assets/doc.png" alt="docImg" />
          <div className="content">
            <div>
              <p>Olá,</p>
              <h5>{admin && `${admin.firstName} ${admin.lastName}`}!</h5>
            </div>
            <p>
              Acompanhe os agendamentos, a disponibilidade dos doutores e o status
              das consultas.
            </p>
          </div>
        </div>
        <div className="secondBox">
          <p>Total de Agendamentos</p>
          <h3>{appointments.length}</h3>
        </div>
        <div className="thirdBox">
          <p>Veterinários Registrados</p>
          <h3>{doctors.length}</h3>
        </div>
      </div>
      <div className="banner">
        <h5>Agendamentos</h5>
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Doutor</th>
              <th>Departamento</th>
              <th>Status</th>
              <th>Visitado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => {
                const { date, time } = appointment.appointment_date;

                return (
                  <tr key={appointment._id}>
                    <td>{appointment.nomePet}</td>
                    <td>{date}</td>
                    <td>{time || "N/A"}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>
                      <select id="status"
                        className={
                          appointment.status === "Pendente"
                            ? "value-pending"
                            : appointment.status === "Aceito"
                              ? "value-accepted"
                              : "value-rejected"
                        }
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pendente" className="value-pending">
                          Pendente.
                        </option>
                        <option value="Aceito" className="value-accepted">
                          Aceito.
                        </option>
                        <option value="Recusado" className="value-rejected">
                          Recusado.
                        </option>
                      </select>
                    </td>
                    <td>
                      {appointment.hasVisited ? (
                        <GoCheckCircleFill className="green" />
                      ) : (
                        <AiFillCloseCircle className="red" />
                      )}
                    </td>
                    <td>
                      <AiFillDelete
                        className="delete-icon"
                        onClick={() => handleDeleteAppointment(appointment._id)}
                      />
                    </td>
                    <td>
                      <button className="infodetalhes"
                        onClick={() => handleDetailsClick(appointment)} >
                        <FaInfo />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">Nenhum agendamento encontrado!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span onClick={closeModal} className="close">×</span>
            <h3>Detalhes do Agendamento</h3>
            <p><strong>Nome do Tutor:</strong> {selectedAppointment.firstName} {selectedAppointment.lastName}</p>
            <p><strong>Email:</strong> {selectedAppointment.email}</p>
            <p><strong>Telefone:</strong> {selectedAppointment.phone}</p>
            <p><strong>Data de Nascimento:</strong> {format(new Date(selectedAppointment.dob), 'dd/MM/yyyy')}</p>
            <p><strong>Gênero:</strong> {selectedAppointment.gender}</p>
            <p><strong>Data da Consulta:</strong> {selectedAppointment.appointment_date.date}</p>
            <p><strong>Hora da Consulta:</strong> {selectedAppointment.appointment_date.time}</p>
            <p><strong>Departamento:</strong> {selectedAppointment.department}</p>
            <p><strong>Doutor:</strong> {selectedAppointment.doctor.firstName} {selectedAppointment.doctor.lastName}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Visitado:</strong> {selectedAppointment.hasVisited ? "Sim" : "Não"}</p>
            <p><strong>Nome do Pet:</strong> {selectedAppointment.nomePet}</p>
            <p><strong>Espécie do Pet:</strong> {selectedAppointment.especiePet}</p>
            <p><strong>Raça do Pet:</strong> {selectedAppointment.racaPet}</p>
            <p><strong>Data do Agendamento:</strong> {formatDate(selectedAppointment.createdAt)}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
