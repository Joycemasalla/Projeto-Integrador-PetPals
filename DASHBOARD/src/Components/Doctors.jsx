import React, { useState, useEffect } from 'react'; // Importa React, useState e useEffect para gerenciar o estado e efeitos colaterais do componente
import axios from 'axios'; // Importa axios para fazer requisições HTTP
import { toast } from 'react-toastify'; // Importa toast do react-toastify para notificações
import { logo } from '../../../FRONTEND/src/assets'; // Importa o logo da pasta de assets
import 'react-toastify/dist/ReactToastify.css'; // Importa os estilos do react-toastify

const AddAvailability = () => {
    // Inicializa os estados para data, horários e horários adicionados
    const [date, setDate] = useState('');  // Estado para armazenar a data, inicializado como string vazia
    const [times, setTimes] = useState(''); // Estado para armazenar os horários, inicializado como string vazia
    const [addedTimes, setAddedTimes] = useState([]); // Estado para armazenar os horários já adicionados

    // Função que lida com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página ao enviar o formulário
        try {
            // Separa os horários em um array, removendo espaços em branco
            const timesArray = times.split(',').map(time => time.trim());
            // Envia os dados para o backend usando axios
            await axios.post('http://localhost:4000/api/v1/admin/disponibilidade', {
                date,
                times: timesArray
            });
            // Exibe uma notificação de sucesso
            toast.success('Horários adicionados com sucesso');
            // Reseta os estados após o envio
            setDate('');
            setTimes('');
            // Atualiza a lista de horários adicionados
            fetchAddedTimes();
        } catch (error) {
            // Exibe uma notificação de erro caso ocorra algum problema
            console.error('Erro ao adicionar horários:', error); // Exibe o erro no console
            toast.error('Erro ao adicionar horários');
        }
    };

    // Função para buscar os horários adicionados
    const fetchAddedTimes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/v1/admin/disponibilidade');
            console.log('Dados recebidos:', response.data); // Exibe os dados recebidos no console
            setAddedTimes(response.data);
        } catch (error) {
            console.error('Erro ao buscar horários adicionados:', error); // Exibe o erro no console
            toast.error('Erro ao buscar horários adicionados');
        }
    };

    // Usa useEffect para buscar os horários adicionados quando o componente é montado
    useEffect(() => {
        fetchAddedTimes();
    }, []);

    return (
        <div className="add-availability">
            <div className="container add-doctor-form">
                <img src={logo} alt="logo" className="logo" style={{ width: "400px" }} /> {/* Exibe o logo */}
                <h1 className="form-title">ADICIONAR HORÁRIOS DISPONÍVEIS</h1> {/* Título do formulário */}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Input para selecionar a data */}
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)} // Atualiza o estado da data quando o valor do input muda
                    required // Torna o campo obrigatório
                />
                {/* Textarea para inserir os horários */}
                <textarea
                    placeholder="Digite os horários disponíveis, separados por vírgula"
                    value={times}
                    onChange={(e) => setTimes(e.target.value)} // Atualiza o estado dos horários quando o valor do textarea muda
                    required // Torna o campo obrigatório
                />
                <button type="submit">Adicionar Horários</button> {/* Botão para enviar o formulário */}
            </form>

            {/* Renderiza a lista de horários já adicionados */}
            <div className="added-times">
                <h2>Horários Adicionados</h2>
                <ul>
                    {addedTimes.length > 0 ? (
                        addedTimes.map((item, index) => (
                            <li key={index}>
                                Data: {item.date} - Horários: {item.times.join(', ')}
                            </li>
                        ))
                    ) : (
                        <li>Nenhum horário adicionado ainda.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AddAvailability; // Exporta o componente para ser usado em outras partes da aplicação
