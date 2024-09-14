import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { avatar } from "../assets";
import { FaEdit, FaTrash } from "react-icons/fa";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorAvatarPreview, setDoctorAvatarPreview] = useState("");
  const { isAuthenticated } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [newDepartment, setNewDepartment] = useState("");

  const departmentsArray = [
    "Clínica", "Cirurgia", "Dermatologia", "Odontologia", "Cardiologia", "Neurologia", "Oncologia", "Endocrinologia", "Comportamento Animal", "Nutrição",
  ];

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

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

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

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return phoneNumber;
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const handleEdit = (doctor) => {
    setEditingDoctor({
      ...doctor,
      doctorDepartment: doctor.doctorDepartment || []
    });
    setDoctorAvatarPreview(doctor.doctorAvatar?.url || avatar);
    setIsModalOpen(true);
  };

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
      formData.append("doctorDepartment", JSON.stringify(editingDoctor.doctorDepartment)); // Envie o array como uma string JSON

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
      setIsModalOpen(false);

    } catch (error) {
      console.error('Erro ao atualizar médico:', error.response || error);
      toast.error(error.response?.data?.message || 'Falha ao atualizar médico');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "doctorDepartment") {
      setEditingDoctor((prevDoctor) => ({
        ...prevDoctor,
        doctorDepartment: value,
      }));
    } else {
      setEditingDoctor((prevDoctor) => ({ ...prevDoctor, [name]: value }));
    }
  };

  const handleAddDepartment = () => {
    if (newDepartment && !editingDoctor.doctorDepartment.includes(newDepartment)) {
      setEditingDoctor((prevDoctor) => ({
        ...prevDoctor,
        doctorDepartment: [...prevDoctor.doctorDepartment, newDepartment],
      }));
      setNewDepartment("");
    }
  };

  const handleRemoveDepartment = (departmentToRemove) => {
    setEditingDoctor((prevDoctor) => ({
      ...prevDoctor,
      doctorDepartment: prevDoctor.doctorDepartment.filter(department => department !== departmentToRemove),
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDoctorAvatarPreview(reader.result);
      setEditingDoctor((prevDoctor) => ({ ...prevDoctor, newAvatar: file }));
    };
  };

  const showDeleteConfirmation = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await axios.delete(`http://localhost:4000/api/v1/user/doutor/${confirmDeleteId}`, { withCredentials: true });
      setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== confirmDeleteId));
      toast.success('Médico excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir médico:', error.response || error);
      toast.error(error.response?.data?.message || 'Falha ao excluir médico');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
    setNewDepartment("");
  };

  const closeConfirmationModal = () => {
    setConfirmDeleteId(null);
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
                <p>Telefone: <span>{formatPhoneNumber(doctor.phone)}</span></p>
                <p>Idade: <span>{calculateAge(doctor.dob)} anos</span></p>
                <p>CPF: <span>{doctor.nic}</span></p>
                <p>Departamentos: <span>{doctor.doctorDepartment.join(', ')}</span></p>
                <button className="btn-edit" onClick={() => handleEdit(doctor)}>
                  <FaEdit />
                </button>
                <button className="btn-delete" onClick={() => showDeleteConfirmation(doctor._id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1>Nenhum médico encontrado!</h1>
        )}
      </div>
      {isModalOpen && editingDoctor && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Editar Médico</h2>
            <form className="edit-form" onSubmit={handleUpdate}>
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
                value={editingDoctor.dob ? editingDoctor.dob.split("T")[0] : ''}
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
              <div className="department-section">
                <select
                  name="departmentOptions"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                >
                  <option value="">Selecione um Departamento</option>
                  {departmentsArray.map((depart, index) => (
                    <option value={depart} key={index}>
                      {depart}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddDepartment}>
                  Add
                </button>
              </div>
              <div className="added-departments">
                {editingDoctor.doctorDepartment.map((dept, index) => (
                  <div key={index} className="department-item">
                    <span>{dept}</span>
                    <span
                      className="remove-department-button"
                      onClick={() => handleRemoveDepartment(dept)}
                    >
                      x
                    </span>
                  </div>
                ))}
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={closeModal}>Cancelar</button>
                <button type="submit">Salvar</button>
              </div>

            </form>
          </div>
        </div>
      )}
      {confirmDeleteId && (
        <div className="confirmation-modal">
          <div className="confirmation-modal-content">
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza de que deseja excluir este médico?</p>
            <button onClick={handleDelete}>Sim</button>
            <button onClick={closeConfirmationModal}>Não</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Doctors;
