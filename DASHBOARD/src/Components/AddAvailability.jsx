import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AddAvailability = () => {
    const [date, setDate] = useState('');
    const [times, setTimes] = useState('');
    const [addedTimes, setAddedTimes] = useState([]);
    const [editing, setEditing] = useState(null);
    const [availableTimeId, setAvailableTimeId] = useState(null);
    const [openDates, setOpenDates] = useState({});
    const [isLoading, setIsLoading] = useState(false); // Indicador de carregamento

    useEffect(() => {
        fetchAddedTimes();
    }, []);

    const fetchAddedTimes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/v1/admin/disponibilidades');
            setAddedTimes(response.data);
        } catch (error) {
            console.error('Erro ao buscar horários adicionados:', error);
            toast.error('Erro ao buscar horários adicionados');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const timesArray = times.split(',').map(time => time.trim());
            if (availableTimeId) {
                await axios.put(`http://localhost:4000/api/v1/admin/disponibilidade/${availableTimeId}`, {
                    date,
                    times: timesArray
                });
                toast.success('Horários atualizados com sucesso');
                setAvailableTimeId(null);
            } else {
                await axios.post('http://localhost:4000/api/v1/admin/disponibilidade', {
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
            toast.success('Horário excluído com sucesso');
            fetchAddedTimes();
        } catch (error) {
            console.error('Erro ao excluir horários:', error);
            toast.error('Erro ao excluir horários');
        }
    };

    const handleEdit = (availability) => {
        setDate(availability.date);
        setTimes(availability.times.join(', '));
        setAvailableTimeId(availability._id);
    };

    const toggleDateVisibility = (date) => {
        setOpenDates(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    const isToday = (date) => {
        const today = new Date().toISOString().split('T')[0];
        return date === today;
    };

    const groupedTimes = Object.entries(addedTimes.reduce((acc, item) => {
        if (!acc[item.date]) {
            acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
    }, {})).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB));

    return (
        <section className="page">
            <div className="add-availability">
                <div className="form-container">
                    <h1>Adicionar/Editar Horários Disponíveis</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Digite os horários disponíveis, separados por vírgula ( , )"
                            value={times}
                            onChange={(e) => setTimes(e.target.value)}
                            required
                        />
                        <button type="submit">{availableTimeId ? 'Atualizar Horários' : 'Adicionar Horários'}</button>
                    </form>
                </div>

                <div className="added-times">
                    <h2>Horários Adicionados</h2>
                    {isLoading ? (
                        <div className="loading"></div>
                    ) : groupedTimes.length > 0 ? (
                        groupedTimes.map(([date, timesArray]) => (
                            <div key={date} className="availability-group">
                                <div className={`availability-header ${isToday(date) ? 'today' : ''}`} onClick={() => toggleDateVisibility(date)}>
                                    <h3>{date}</h3>
                                    {openDates[date] ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                                {openDates[date] && (
                                    <div className="availability-items open">
                                        {timesArray.map((availability) => (
                                            <div key={availability._id} className="availability-item">
                                                <p>{availability.times.join(', ')}</p>
                                                <div>
                                                    <button className="edit-btn" onClick={() => handleEdit(availability)}>
                                                        <FaEdit />
                                                    </button>
                                                    <button className="delete-btn" onClick={() => handleDelete(availability._id)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Nenhum horário adicionado ainda.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AddAvailability;
