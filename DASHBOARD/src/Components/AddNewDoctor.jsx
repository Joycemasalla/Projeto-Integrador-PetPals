import  { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import { avatar } from "../assets";

const AddNewDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartments, setDoctorDepartments] = useState([]);
  const [doctorAvatar, setDoctorAvatar] = useState("");
  const [doctorAvatarPreview, setDoctorAvatarPreview] = useState("");

  const navigateTo = useNavigate();

  const departmentsArray = [
    "Clínica", "Cirurgia", "Dermatologia", "Odontologia", "Cardiologia", "Neurologia", "Oncologia", "Endocrinologia", "Comportamento Animal", "Nutrição",
  ];

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDoctorAvatarPreview(reader.result);
      setDoctorAvatar(file);
    };
  };

  // const handleDepartmentClick = (department) => {
  //   setDoctorDepartments((prevDepartments) =>
  //     prevDepartments.includes(department)
  //       ? prevDepartments.filter(dep => dep !== department)
  //       : [...prevDepartments, department]
  //   );
  // };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("nic", nic);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartments", JSON.stringify(doctorDepartments));
      formData.append("doctorAvatar", doctorAvatar);

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/doutor/addnew",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setPassword("");
      setDoctorDepartments([]);
      setDoctorAvatar("");
      setDoctorAvatarPreview("");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar o doutor');
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container add-doctor-form">
        <h1 className="form-title">REGISTRAR UM NOVO DOUTOR</h1>
        <form onSubmit={handleAddNewDoctor}>
          <div className="first-wrapper">
            <div>
              <img
                src={doctorAvatarPreview || avatar}
                alt="Doutor Avatar"
              />
              <input type="file" onChange={handleAvatar} />
            </div>
            <div>
              <input
                type="text"
                placeholder="Nome *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Sobrenome *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Telefone *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="CRMV *"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                required
              />
              <input
                type="date"
                placeholder="Data de Nascimento *"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Selecione o Gênero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
              <div className="tags-input">
                <p>Selecione os Departamentos: *</p>
                <div className="tags-container">
                  {doctorDepartments.map((depart, index) => (
                    <span key={index} className="tag">
                      {depart}
                      <span
                        className="cloe"


                        onClick={() =>
                          setDoctorDepartments((prevDepartments) =>
                            prevDepartments.filter((d) => d !== depart)
                          )
                        }
                      >
                        &times;
                      
                      </span>                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && !doctorDepartments.includes(value)) {
                      setDoctorDepartments((prevDepartments) => [...prevDepartments, value]);
                    }
                    e.target.value = ""; // Limpa o dropdown após a seleção
                  }}
                >
                  <option value="" disabled>
                    Adicionar Departamento
                  </option>
                  {departmentsArray.map((depart, index) => (
                    <option key={index} value={depart}>
                      {depart}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="password"
                placeholder="Password Admin *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Registrar novo Doutor</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewDoctor;
