import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { avatar } from "../assets";
import { FaEdit, FaTrash } from "react-icons/fa";
const Doctors = () => {
  // Estados para armazenar a lista de médicos, médico em edição, pré-visualização do avatar e outros controles
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorAvatarPreview, setDoctorAvatarPreview] = useState("");
  const { isAuthenticated } = useContext(Context);  // Verifica se o usuário está autenticado
  const [isModalOpen, setIsModalOpen] = useState(false);  // Controla o estado do modal de edição
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);  // Armazena o ID do médico a ser excluído
  const [newDepartment, setNewDepartment] = useState("");  // Armazena o novo departamento que será adicionado

  // Lista de departamentos disponíveis para seleção
  const departmentsArray = [
    "Clínica", "Cirurgia", "Dermatologia", "Odontologia", "Cardiologia", "Neurologia", "Oncologia", "Endocrinologia", "Comportamento Animal", "Nutrição",
  ];

  // Função para buscar médicos da API quando o componente é carregado
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);  // Define os médicos buscados no estado
      } catch (error) {
        console.error("Erro ao buscar médicos:", error);
        toast.error(error.response?.data?.message || 'Falha ao buscar médicos');
      }
    };
    fetchDoctors();
  }, []);

  // Redireciona o usuário para a página de login se ele não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // Função para calcular a idade de um médico a partir da data de nascimento
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

  // Função para formatar o número de telefone em um formato mais legível
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return phoneNumber;
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  // Inicia o processo de edição, definindo o médico selecionado e abrindo o modal de edição
  const handleEdit = (doctor) => {
    setEditingDoctor({
      ...doctor,
      doctorDepartment: doctor.doctorDepartment || []
    });
    setDoctorAvatarPreview(doctor.doctorAvatar?.url || avatar);  // Prepara a pré-visualização do avatar
    setIsModalOpen(true);  // Abre o modal
  };

  // Atualiza as informações do médico no backend
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
      formData.append("doctorDepartment", JSON.stringify(editingDoctor.doctorDepartment));  // Adiciona o departamento como JSON

      if (editingDoctor.newAvatar) {
        formData.append("doctorAvatar", editingDoctor.newAvatar);  // Se houver um novo avatar, ele será enviado
      }

      // Faz a requisição para atualizar o médico na API
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/user/doutor/${editingDoctor._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );

      // Atualiza o estado local com os dados retornados pela API
      if (data && data.doctor) {
        toast.success('Médico atualizado com sucesso');
        setDoctors((prevDoctors) =>
          prevDoctors.map((doc) => (doc._id === data.doctor._id ? data.doctor : doc))
        );
      } else {
        toast.error('Resposta inesperada do servidor');
        console.error('Resposta do servidor:', data);
      }

      // Reseta os estados após a edição
      setEditingDoctor(null);
      setDoctorAvatarPreview("");
      setIsModalOpen(false);

    } catch (error) {
      console.error('Erro ao atualizar médico:', error.response || error);
      toast.error(error.response?.data?.message || 'Falha ao atualizar médico');
    }
  };

  // Função que captura mudanças nos inputs do formulário de edição
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

  // Função para adicionar um novo departamento à lista de departamentos do médico
  const handleAddDepartment = () => {
    if (newDepartment && !editingDoctor.doctorDepartment.includes(newDepartment)) {
      setEditingDoctor((prevDoctor) => ({
        ...prevDoctor,
        doctorDepartment: [...prevDoctor.doctorDepartment, newDepartment],
      }));
      setNewDepartment("");  // Reseta o campo de novo departamento
    }
  };

  // Remove um departamento da lista de departamentos do médico
  const handleRemoveDepartment = (departmentToRemove) => {
    setEditingDoctor((prevDoctor) => ({
      ...prevDoctor,
      doctorDepartment: prevDoctor.doctorDepartment.filter(department => department !== departmentToRemove),
    }));
  };

  // Carrega a imagem do avatar do médico e atualiza a pré-visualização
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDoctorAvatarPreview(reader.result);  // Exibe a imagem selecionada
      setEditingDoctor((prevDoctor) => ({ ...prevDoctor, newAvatar: file }));  // Atualiza o estado com o novo arquivo
    };
  };

  // Mostra o modal de confirmação para exclusão de um médico
  const showDeleteConfirmation = (id) => {
    setConfirmDeleteId(id);
  };

  // Função para deletar um médico
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

  // Fecha o modal de edição
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
    setNewDepartment("");
  };

  // Fecha o modal de confirmação de exclusão
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
