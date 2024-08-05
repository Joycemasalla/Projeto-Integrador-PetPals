import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import './AppointmentForm.css'

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nomePet, setNomePet] = useState("");
  const [especiePet, setEspeciePet] = useState("");
  const [racaPet, setRacaPet] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  const departmentsArray = [
    "Clínica", "Cirurgia", "Dermatologia", "Odontologia", "Cardiologia", "Neurologia", "Oncologia", "Endocrinologia", "Comportamento Animal", "Nutricao",
  ];

  

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error("Erro ao buscar médicos");
      }
    };
    fetchDoctors();
  }, []);

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          firstName,
          lastName,
          nomePet,
          especiePet,
          racaPet,
          email,
          phone,
          nic,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      // Limpar o formulário após o envio
      setFirstName("");
      setLastName("");
      setNomePet("");
      setEspeciePet("");
      setRacaPet("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDepartment("");
      setDoctorFirstName("");
      setDoctorLastName("");
      setAddress("");
      setHasVisited(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao agendar");
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Agendamento de Consulta</h2>
      <form onSubmit={handleAppointment} >
        <div className="primeira">
          <input
            type="text"
            rows="2"
            placeholder="Nome do Pet"
            value={nomePet}
            onChange={(e) => setNomePet(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Espécie do Pet"
            value={especiePet}
            onChange={(e) => setEspeciePet(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Raça do Pet"
            value={racaPet}
            onChange={(e) => setRacaPet(e.target.value)}
            required
          />


          <input
            type="text"
            placeholder="NIC do Pet"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Gênero do Pet</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
          <input
            type="date"
            placeholder="Data de Nascimento do Pet"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />


        </div>
        <div>
          <input
            type="text"
            placeholder="Nome do Tutor"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Sobrenome do Tutor"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Número de Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="date"
            placeholder="Data da Consulta"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setDoctorFirstName("");
              setDoctorLastName("");
            }}
            required
          >
            <option value="">Selecionar Departamento</option>
            {departmentsArray.map((depart, index) => (
              <option value={depart} key={index}>
                {depart}
              </option>
            ))}
          </select>
          <select
            value={`${doctorFirstName} ${doctorLastName}`}
            onChange={(e) => {
              const [firstName, lastName] = e.target.value.split(" ");
              setDoctorFirstName(firstName || "");
              setDoctorLastName(lastName || "");
            }}
            disabled={!department}
            required
          >
            <option value="">Selecionar Médico</option>
            {doctors
              .filter((doctor) => doctor.doctorDepartment === department)
              .map((doctor, index) => (
                <option
                  value={`${doctor.firstName} ${doctor.lastName}`}
                  key={index}
                >
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
          </select>
        </div>
        <textarea
          rows="2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Endereço"
          required
        />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
            />
            Já visitou antes?
          </label>
        </div>
        <button type="submit">Agendar Consulta</button>

      </form>
    </div>
  );
};

export default AppointmentForm;
