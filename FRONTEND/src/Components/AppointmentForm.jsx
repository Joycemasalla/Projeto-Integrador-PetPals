import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const AppointmentForm = () => {
  const navigate = useNavigate();
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
  // const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const { isAuthenticated } = useContext(Context);

  const departmentsArray = [
    "Clínica", "Cirurgia", "Dermatologia", "Odontologia", "Cardiologia",
    "Neurologia", "Oncologia", "Endocrinologia", "Comportamento Animal", "Nutrição"
  ];

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors", {
          withCredentials: true
        });
        setDoctors(data.doctors);
      } catch (error) {
        toast.error("Erro ao buscar médicos");
      }
    };
    fetchDoctors();
  }, []);

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
            setAvailableTimes(times);
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

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const { data } = await axios.get("http://localhost:4000/api/v1/user/paciente/me", {
            withCredentials: true,
            timeout: 10000
          });
          setFirstName(data.user.firstName || "");
          setLastName(data.user.lastName || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          // setAddress(data.user.address || "");
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
    }
  }, [isAuthenticated]);

  const handleAppointment = async (e) => {
    e.preventDefault();

    // Verifica se o usuário está autenticado
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para agendar uma consulta. Por favor, faça login.");
      navigate("/login"); // Redireciona para a página de login
      return;
    }

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
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

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

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Agendamento de Consulta</h2>
      {!isAuthenticated && (
        <div style={{
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "#f8f9fa",
          color: "#333"
        }}>
          <p style={{ fontSize: "16px", margin: 0 }}>
            Para agendar uma consulta, você precisa estar logado. Se ainda não tem uma conta, 
            <a
              href="/register"
              style={{ color: "#00947C", textDecoration: "none" }}
            >
               registre-se  
            </a>
            ou faça  
            <a
              href="/login"
              style={{ color: "#00947C", textDecoration: "none" }}
            >
                login
            </a>.
          </p>
        </div>
      )}
      <form onSubmit={handleAppointment}>
        <div className="primeira">
          <input
            type="text"
            placeholder="Nome do Pet *"
            value={nomePet}
            onChange={(e) => setNomePet(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Espécie do Pet *"
            value={especiePet}
            onChange={(e) => setEspeciePet(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Raça do Pet *"
            value={racaPet}
            onChange={(e) => setRacaPet(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="NIC / Identificação"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Gênero do Pet *</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
          <input
            type="date"
            placeholder="Data de Nascimento do Pet *"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Nome do Tutor *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Sobrenome do Tutor *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email do Tutor *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Telefone do Tutor *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="date"
            placeholder="Data da Consulta *"
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
            <option value="">Selecionar Departamento *</option>
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
            <option value="">Selecionar Médico *</option>
            {doctors
              .filter((doctor) => Array.isArray(doctor.doctorDepartment) && doctor.doctorDepartment.includes(department))
              .map((doctor, index) => (
                <option key={index} value={`${doctor.firstName} ${doctor.lastName}`}>
                  Dr(a) {doctor.firstName} {doctor.lastName}
                </option>
              ))}
          </select>

          <select
            value={selectedTime}
            onChange={handleTimeChange}
            required
          >
            <option value="">Selecionar Horário *</option>
            {availableTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
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
