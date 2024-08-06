import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

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
        toast.error(error.response?.data?.message || "Falha ao buscar doutores.");
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
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }


  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/src/assets/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Olá ,</p>
                <h5>
                  {admin &&
                    `${admin.firstName} ${admin.lastName}`}
                </h5>
              </div>
              <p>
                Acompanhe os agendamentos, a disponibilidade dos doutores e o status das consultas.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total de Agendamentos</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Doutores Registrados</p>
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
                      <td>{time || 'N/A'}</td> {/* Exiba o horário aqui */}
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <select
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
    </>
  );
};

export default Dashboard;
