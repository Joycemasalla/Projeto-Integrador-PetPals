import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { avatar } from "../assets";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importa o ícone de lixeira

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorAvatarPreview, setDoctorAvatarPreview] = useState("");
  const { isAuthenticated } = useContext(Context);
  const departmentsArray = [
    "Clínica", "Cirurgia", "Dermatologia", "Odontologia", "Cardiologia", "Neurologia", "Oncologia", "Endocrinologia", "Comportamento Animal", "Nutrição",
  ];

  // Busca médicos da API ao montar o componente
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        console.error("Erro ao buscar médicos:", error);
        toast.error(error.response?.data?.message || 'Falha ao buscar médicos');
      }
    };
    fetchDoctors();
  }, []);

  // Redireciona para o login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // Calcula a idade com base na data de nascimento
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentYear = new Date().getFullYear();
    let age = currentYear - birthDate.getFullYear();
    const monthDifference = new Date().getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && new Date().getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Define o médico a ser editado e a visualização do avatar
  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorAvatarPreview(doctor.doctorAvatar?.url || avatar);
  };

  // Lida com a atualização do médico
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingDoctor || !editingDoctor._id) {
      toast.error('ID do médico não encontrado');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", editingDoctor.firstName || '');
      formData.append("lastName", editingDoctor.lastName || '');
      formData.append("email", editingDoctor.email || '');
      formData.append("phone", editingDoctor.phone || '');
      formData.append("dob", editingDoctor.dob || '');
      formData.append("nic", editingDoctor.nic || '');
      formData.append("doctorDepartment", editingDoctor.doctorDepartment || '');

      if (editingDoctor.newAvatar) {
        formData.append("doctorAvatar", editingDoctor.newAvatar);
      }

      const { data } = await axios.put(
        `http://localhost:4000/api/v1/user/doutor/${editingDoctor._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );

      if (data && data.doctor) {
        toast.success('Médico atualizado com sucesso');
        setDoctors((prevDoctors) =>
          prevDoctors.map((doc) => (doc._id === data.doctor._id ? data.doctor : doc))
        );
      } else {
        toast.error('Resposta inesperada do servidor');
        console.error('Resposta do servidor:', data);
      }

      setEditingDoctor(null);
      setDoctorAvatarPreview("");

    } catch (error) {
      console.error('Erro ao atualizar médico:', error.response || error);
      toast.error(error.response?.data?.message || 'Falha ao atualizar médico');
    }
  };

  // Lida com mudanças de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingDoctor((prevDoctor) => ({ ...prevDoctor, [name]: value }));
  };

  // Lida com mudanças no arquivo do avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDoctorAvatarPreview(reader.result);
      setEditingDoctor((prevDoctor) => ({ ...prevDoctor, newAvatar: file }));
    };
  };

  // Lida com a exclusão de um médico
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/user/doutor/${id}`, { withCredentials: true });
      setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== id));
      toast.success('Médico excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir médico:', error.response || error);
      toast.error(error.response?.data?.message || 'Falha ao excluir médico');
    }
  };

  return (
    <section className="page doctors">
      <h1>VETERINÁRIOS</h1>
      <div className="banner">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div className="card" key={doctor._id}>
              <img
                src={doctor.doctorAvatar?.url || avatar}
                alt="Avatar do médico"
              />
              <div className="info">
                <h4>{`${doctor.firstName} ${doctor.lastName}`}</h4>
                <p>Email: <span>{doctor.email}</span></p>
                <p>Telefone: <span>{doctor.phone}</span></p>
                <p>Idade: <span>{calculateAge(doctor.dob)}</span></p>
                <p>CPF: <span>{doctor.nic}</span></p>
                <p>Departamento: <span>{doctor.doctorDepartment}</span></p>
                <button className="btn-edit" onClick={() => handleEdit(doctor)}>
                  <FaEdit />
                </button>
                <button className="btn-delete" onClick={() => handleDelete(doctor._id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1>Nenhum médico encontrado!</h1>
        )}
      </div>
      {editingDoctor && (
        <div className="edit-form">
          <h2>Editar Médico</h2>
          <form onSubmit={handleUpdate}>
            <img src={doctorAvatarPreview} alt="Prévia do avatar do médico" />
            <input type="file" onChange={handleAvatarChange} />
            <input
              type="text"
              name="firstName"
              value={editingDoctor.firstName || ''}
              onChange={handleChange}
              placeholder="Primeiro Nome"
            />
            <input
              type="text"
              name="lastName"
              value={editingDoctor.lastName || ''}
              onChange={handleChange}
              placeholder="Sobrenome"
            />
            <input
              type="email"
              name="email"
              value={editingDoctor.email || ''}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={editingDoctor.phone || ''}
              onChange={handleChange}
              placeholder="Telefone"
            />
            <input
              type="date"
              name="dob"
              value={new Date(editingDoctor.dob).toISOString().split('T')[0] || ''}
              onChange={handleChange}
              placeholder="Data de Nascimento"
            />
            <input
              type="text"
              name="nic"
              value={editingDoctor.nic || ''}
              onChange={handleChange}
              placeholder="CPF"
            />
            <select
              name="doctorDepartment"
              value={editingDoctor.doctorDepartment || ''}
              onChange={handleChange}
              placeholder="Departamento"
            >
              <option value="">Selecione o Departamento</option>
              {departmentsArray.map((depart, index) => (
                <option value={depart} key={index}>
                  {depart}
                </option>
              ))}
            </select>

            <button type="button" onClick={() => setEditingDoctor(null)}>Cancelar</button>
            <button type="submit">Atualizar</button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Doctors;
