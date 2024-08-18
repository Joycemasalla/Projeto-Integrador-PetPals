import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle, AiFillDelete } from "react-icons/ai";
import './Agendamentos.css';

const Agendamentos = () => {
  const [appointments, setAppointments] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchUserAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/user",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error(error.response?.data?.message || "Failed to fetch appointments.");
      }
    };

    fetchUserAppointments();
  }, []);

  const handleDeleteAppointment = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/v1/appointment/delete/${id}`, { withCredentials: true });
      console.log("Resposta da exclusão:", response.data);
      setAppointments(appointments.filter(appointment => appointment._id !== id));
      toast.success("Agendamento excluído com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      toast.error(error.response?.data?.message || "Erro ao excluir agendamento.");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="appointments page">
      <h1>Meus Agendamentos</h1>
      <div className="banner">
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Data</th>
              <th>Doutor</th>
              <th>Departamento</th>
              <th>Status</th>
              <th>Visitado</th>
              <th>Ações</th> {/* Coluna para ações como exclusão */}
            </tr>
          </thead>
          <tbody>
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment) => {
                const date = appointment.appointment_date.date;
                const time = appointment.appointment_date.time;
                const formattedDateTime = `${date} ${time}`;

                return (
                  <tr key={appointment._id}>
                    <td>{`${appointment.nomePet}`}</td>
                    <td>{formattedDateTime}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>
                      <select
                        id="valores"
                        className={
                          appointment.status === "Pendente"
                            ? "value-pending"
                            : appointment.status === "Aceito"
                              ? "value-accepted"
                              : "value-rejected"
                        }
                        value={appointment.status}
                        disabled
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


                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7">Nenhum agendamento encontrado!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Agendamentos;
