import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { logo } from "../assets";
import 'react-toastify/dist/ReactToastify.css';

const AddAvailability = () => {
    const [date, setDate] = useState('');
    const [times, setTimes] = useState('');
    const [addedTimes, setAddedTimes] = useState([]);
    const [editing, setEditing] = useState(null); // Para rastrear o item em edição

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const timesArray = times.split(',').map(time => time.trim());
            if (editing) {
                // Atualiza a disponibilidade
                const response = await axios.put(`http://localhost:4000/api/v1/admin/disponibilidade/${editing}`, {
                    date,
                    times: timesArray
                });
                toast.success('Horários atualizados com sucesso');
                setEditing(null); // Limpa o estado de edição
            } else {
                // Adiciona nova disponibilidade
                const response = await axios.post('http://localhost:4000/api/v1/admin/disponibilidade', {
                    date,
                    times: timesArray
                });
                toast.success('Horários adicionados com sucesso');
            }
            setDate('');
            setTimes('');
            fetchAddedTimes();
        } catch (error) {
            console.error('Erro ao adicionar/atualizar horários:', error);
            toast.error('Erro ao adicionar/atualizar horários');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/v1/admin/disponibilidade/${id}`);
            toast.success('Horários excluídos com sucesso');
            fetchAddedTimes(); // Atualiza a lista após exclusão
        } catch (error) {
            console.error('Erro ao excluir horários:', error);
            toast.error('Erro ao excluir horários');
        }
    };

    const fetchAddedTimes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/v1/admin/disponibilidades');
            setAddedTimes(response.data);
        } catch (error) {
            console.error('Erro ao buscar horários adicionados:', error);
            if (error.response) {
                toast.error(`Erro ao buscar horários adicionados: ${error.response.data.message}`);
            } else if (error.request) {
                toast.error('Erro ao buscar horários adicionados: Requisição não recebida');
            } else {
                toast.error(`Erro ao buscar horários adicionados: ${error.message}`);
            }
        }
    };

    const handleEdit = (availability) => {
        setDate(availability.date);
        setTimes(availability.times.join(', '));
        setEditing(availability._id); // Define o ID do item que está sendo editado
    };

    useEffect(() => {
        fetchAddedTimes();
    }, []);

    return (
        <div className="add-availability">
            <div className="container add-doctor-form">
                <img src={logo} alt="logo" className="logo" style={{ width: "400px" }} />
                <h1 className="form-title">ADICIONAR/EDITAR HORÁRIOS DISPONÍVEIS</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Digite os horários disponíveis, separados por vírgula"
                    value={times}
                    onChange={(e) => setTimes(e.target.value)}
                    required
                />
                <button type="submit">{editing ? 'Atualizar Horários' : 'Adicionar Horários'}</button>
            </form>

            <div className="added-times">
                <h2>Horários Adicionados</h2>
                <ul>
                    {addedTimes.length > 0 ? (
                        addedTimes.map((item, index) => (
                            <li key={index}>
                                Data: {item.date} - Horários: {item.times.join(', ')}
                                <button onClick={() => handleEdit(item)}>Editar</button>
                                <button onClick={() => handleDelete(item._id)}>Excluir</button>
                            </li>
                        ))
                    ) : (
                        <p>Nenhum horário adicionado ainda.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AddAvailability;
