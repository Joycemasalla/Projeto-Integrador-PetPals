//permite que o admin adicione horários disponíveis
import React, { useState } from 'react';
import axios from 'axios';
import './AddAvailability.css';

const AddAvailability = () => {
  const [date, setDate] = useState('');
  const [times, setTimes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/v1/admin/disponibilidade', {
        date,
        times: times.split(',').map(time => time.trim()) // Converte o string em array
      });
      alert('Horários disponíveis adicionados com sucesso');
      setDate('');
      setTimes('');
    } catch (error) {
      alert('Erro ao adicionar horários disponíveis');
    }
  };

  return (
    <div className="add-availability">
      <h2>Adicionar Horários Disponíveis</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Horários (ex: 08:00, 09:00, 10:00)"
          value={times}
          onChange={(e) => setTimes(e.target.value)}
          required
        />
        <button type="submit">Adicionar Horários</button>
      </form>
    </div>
  );
};

export default AddAvailability;
