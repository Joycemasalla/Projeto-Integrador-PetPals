import { useState, useEffect } from "react"; 
import axios from "axios"; 
import { toast } from "react-toastify"; // Importando biblioteca de notificações
import 'react-toastify/dist/ReactToastify.css'; // Importando CSS da biblioteca de notificações
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Ícones da lib react-icons

// Componente principal que gerencia adição e edição de horários disponíveis
const AddAvailability = () => {
    // Estados para controlar os valores de data, horários, horários adicionados, etc.
    const [date, setDate] = useState(''); // data selecionada
    const [times, setTimes] = useState(''); //horários (em string, separados por vírgula)
    const [addedTimes, setAddedTimes] = useState([]); //horários já adicionados
    const [availableTimeId, setAvailableTimeId] = useState(null); //  ID do horário a ser editado (se houver)
    const [openDates, setOpenDates] = useState({}); //  estado de expansão/colapso das datas
    const [isLoading, setIsLoading] = useState(false); // Indicador de carregamento (se está buscando dados)

    // Hook para buscar os horários adicionados assim que o componente for montado
    useEffect(() => {
        fetchAddedTimes();
    }, []);

    // Função para buscar os horários já adicionados no backend
    const fetchAddedTimes = async () => {
        setIsLoading(true); // Inicia o indicador de carregamento
        try {
            // Faz uma requisição GET para pegar os horários
            const response = await axios.get('http://localhost:4000/api/v1/admin/disponibilidades');
            setAddedTimes(response.data); // Salva os horários buscados no estado
        } catch (error) {
            console.error('Erro ao buscar horários adicionados:', error);
            toast.error('Erro ao buscar horários adicionados'); // Exibe notificação de erro
        } finally {
            setIsLoading(false); // Para o indicador de carregamento
        }
    };

    // Função para adicionar ou atualizar horários
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita recarregar a página no submit do form
        try {
            // Divide a string dos horários em um array
            const timesArray = times.split(',').map(time => time.trim());
            if (availableTimeId) { // Se estiver editando um horário já existente
                await axios.put(`http://localhost:4000/api/v1/admin/disponibilidade/${availableTimeId}`, {
                    date,
                    times: timesArray
                });
                toast.success('Horários atualizados com sucesso'); // Exibe notificação de sucesso
                setAvailableTimeId(null); // Reseta o ID do horário que estava sendo editado
            } else { // Se estiver adicionando um novo horário
                await axios.post('http://localhost:4000/api/v1/admin/disponibilidade', {
                    date,
                    times: timesArray
                });
                toast.success('Horários adicionados com sucesso'); // Exibe notificação de sucesso
            }
            // Reseta os campos de data e horários
            setDate('');
            setTimes('');
            fetchAddedTimes(); // Atualiza a lista de horários
        } catch (error) {
            console.error('Erro ao adicionar/atualizar horários:', error);
            toast.error('Erro ao adicionar/atualizar horários'); // Exibe notificação de erro
        }
    };

    // Função para deletar um horário
    const handleDelete = async (id) => {
        try {
            // Faz uma requisição DELETE para remover o horário
            await axios.delete(`http://localhost:4000/api/v1/admin/disponibilidade/${id}`);
            toast.success('Horário excluído com sucesso'); // Exibe notificação de sucesso
            fetchAddedTimes(); // Atualiza a lista de horários
        } catch (error) {
            console.error('Erro ao excluir horários:', error);
            toast.error('Erro ao excluir horários'); // Exibe notificação de erro
        }
    };

    // Função para carregar os dados do horário a ser editado
    const handleEdit = (availability) => {
        setDate(availability.date); // Preenche o campo de data com a data do horário
        setTimes(availability.times.join(', ')); // Preenche o campo de horários com os horários
        setAvailableTimeId(availability._id); // Armazena o ID do horário para futura atualização
    };

    // Função para alternar a visibilidade dos horários de uma data específica
    const toggleDateVisibility = (date) => {
        setOpenDates(prev => ({
            ...prev,
            [date]: !prev[date] // Troca o estado de "aberto" ou "fechado" da data
        }));
    };

    // Função para verificar se a data é a data de hoje
    const isToday = (date) => {
        const today = new Date().toISOString().split('T')[0];
        return date === today;
    };

    // Agrupa os horários por data
    const groupedTimes = Object.entries(addedTimes.reduce((acc, item) => {
        if (!acc[item.date]) {
            acc[item.date] = [];
        }
        acc[item.date].push(item); // Agrupa os horários pela data
        return acc;
    }, {})).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB)); // Ordena por data



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
                                        {timesArray.flatMap((availability) => (
                                            availability.times.map((time, index) => (
                                                <div key={index} className="availability-item">
                                                    <span>{time}</span>
                                                    <div>
                                                        <button className="edit-btn" onClick={() => handleEdit(availability)}>
                                                            <FaEdit />
                                                        </button>
                                                        <button className="delete-btn" onClick={() => handleDelete(availability._id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
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
