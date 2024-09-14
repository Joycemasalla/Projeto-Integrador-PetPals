import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle, AiFillDelete } from "react-icons/ai";
import { format } from "date-fns";
import { FaInfo } from "react-icons/fa";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };

    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Falha ao buscar doutores."
        );
      }
    };

    fetchAppointments();
    fetchDoctors();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );

      if (status === "Aceito") {
        const appointment = appointments.find((a) => a._id === appointmentId);

        if (appointment) {
          const { disponibilityId } = appointment;

          if (disponibilityId) {
            await axios.delete(
              `http://localhost:4000/api/v1/admin/disponibilidade/${disponibilityId}`,
              { withCredentials: true }
            );

            toast.success("Horário excluído com sucesso.");

         
          }
        }
      }

      toast.success(data.message);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar status.");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/appointment/delete/${appointmentId}`,
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Falha ao deletar agendamento.");
    }
  };

  const handleDetailsClick = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return format(parsedDate, 'dd/MM/yyyy HH:mm:ss');
    }
    return "Data inválida";
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <img src="/src/assets/doc.png" alt="docImg" />
          <div className="content">
            <div>
              <p>Olá ,</p>
              <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
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
                          Pendente
                        </option>
                        <option value="Aceito" className="value-accepted">
                          Aceito
                        </option>
                        <option value="Recusado" className="value-rejected">
                          Rejeitado
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
