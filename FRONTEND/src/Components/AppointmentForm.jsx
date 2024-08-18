import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  // Estados para armazenar os dados do formulário
  const [firstName, setFirstName] = useState(""); // Nome do tutor
  const [lastName, setLastName] = useState(""); // Sobrenome do tutor
  const [nomePet, setNomePet] = useState(""); // Nome do pet
  const [especiePet, setEspeciePet] = useState(""); // Espécie do pet
  const [racaPet, setRacaPet] = useState(""); // Raça do pet
  const [email, setEmail] = useState(""); // Email do tutor
  const [phone, setPhone] = useState(""); // Telefone do tutor
  const [nic, setNic] = useState(""); // NIC do pet
  const [dob, setDob] = useState(""); // Data de nascimento do pet
  const [gender, setGender] = useState(""); // Gênero do pet
  const [appointmentDate, setAppointmentDate] = useState(""); // Data da consulta
  const [department, setDepartment] = useState(""); // Departamento da consulta
  const [doctorFirstName, setDoctorFirstName] = useState(""); // Nome do médico
  const [doctorLastName, setDoctorLastName] = useState(""); // Sobrenome do médico
  const [address, setAddress] = useState(""); // Endereço do tutor
  const [hasVisited, setHasVisited] = useState(false); // Se o tutor já visitou a clínica
  const [availableTimes, setAvailableTimes] = useState([]); // Horários disponíveis
  const [selectedTime, setSelectedTime] = useState(""); // Horário selecionado

  // Array de departamentos
  const departmentsArray = [
    "Clínica", "Cirurgia", "Dermatologia", "Odontologia", "Cardiologia",
    "Neurologia", "Oncologia", "Endocrinologia", "Comportamento Animal", "Nutrição"
  ];

  // Estado para armazenar a lista de médicos
  const [doctors, setDoctors] = useState([]);

  // useEffect para buscar a lista de médicos ao carregar o componente
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors", {
          withCredentials: true
        });
        setDoctors(data.doctors); // Armazena a lista de médicos no estado
      } catch (error) {
        toast.error("Erro ao buscar médicos");
      }
    };
    fetchDoctors();
  }, []);

  // useEffect para buscar horários disponíveis com base na data selecionada
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (appointmentDate) {
        try {
          const { data } = await axios.get("http://localhost:4000/api/v1/admin/disponibilidade", {
            params: { date: appointmentDate },
            withCredentials: true
          });

          const times = data.flatMap(entry => entry.times || []);
          if (Array.isArray(times)) {
            setAvailableTimes(times); // Armazena os horários disponíveis no estado
          } else {
            console.warn('Formato de dados inesperado:', data);
            setAvailableTimes([]);
          }
        } catch (error) {
          console.error('Erro ao buscar horários disponíveis:', error);
          toast.error("Erro ao buscar horários disponíveis");
        }
      }
    };
    fetchAvailableTimes();
  }, [appointmentDate]);

  // useEffect para buscar os dados do usuário ao carregar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/paciente/me", {
          withCredentials: true,
          timeout: 10000 // Tempo de timeout aumentado para 10 segundos
        });
        console.log("Dados recebidos da API:", data);
        setFirstName(data.user.firstName || "");
        setLastName(data.user.lastName || "");
        setEmail(data.user.email || "");
        setPhone(data.user.phone || "");
        setAddress(data.user.address || "");
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

    fetchUserData(); // Chama a função para preencher os campos do formulário
  }, []);

  // Função para lidar com o envio do formulário
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
          appointment_date: {
            date: appointmentDate,
            time: selectedTime
          },
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited
          // address
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      // Atualizar a disponibilidade removendo o horário selecionado
      const { data: disponibilidade } = await axios.get('http://localhost:4000/api/v1/admin/disponibilidade', {
        params: { date: appointmentDate },
        withCredentials: true
      });

      const disponibilidadeId = disponibilidade.find(d => d.date === appointmentDate)._id;

      await axios.put(`http://localhost:4000/api/v1/admin/disponibilidade/${disponibilidadeId}`, {
        timeToRemove: selectedTime,
        date: appointmentDate
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      setAvailableTimes(prevTimes => prevTimes.filter(time => time !== selectedTime));

      toast.success(response.data.message);

      // Limpar o formulário após o envio
      // setFirstName("");
      // setLastName("");
      // setEmail("");
      // setPhone("");
      // setAddress("");
      setAppointmentDate("");
      setDepartment("");
      setDoctorFirstName("");
      setDoctorLastName("");
      setSelectedTime("");
      setEspeciePet("");
      setRacaPet("");
      setNic("");
      setDob("");
      setGender("");
      setNomePet("");
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      toast.error("Erro ao agendar consulta");
    }
  };

  // Função para lidar com mudanças no horário selecionado
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Agendamento de Consulta</h2>
      <form onSubmit={handleAppointment}>
        {/* Primeira seção do formulário: informações do pet */}
        <div className="primeira">
          <input
            type="text"
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
            placeholder="NIC / Identificação "
            value={nic}
            onChange={(e) => setNic(e.target.value)}
          // required
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

        {/* Segunda seção do formulário: informações do tutor */}
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
            placeholder="Email do Tutor"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Telefone do Tutor"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {/* Terceira seção do formulário: data, departamento e médico */}
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
                  key={index} value={`${doctor.firstName} ${doctor.lastName}`}>
                  Dr(a) {doctor.firstName} {doctor.lastName}
                </option>
              ))}
          </select>
          <select
            value={selectedTime}
            onChange={handleTimeChange}
            required
          >
            <option value="">Selecionar Horário</option>
            {availableTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Quarta seção do formulário: outras informações */}
        <div>
          {/* <input
            type="text"
            placeholder="Endereço"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          /> */}
          <label>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
            />
            Já visitou a clínica antes?
          </label>
        </div>
        <button type="submit">Agendar</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
