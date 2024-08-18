//exibe os horários disponíveis para uma data específica
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailabilityTimes = ({ selectedDate }) => {
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/admin/disponibilidade', {
          params: { date: selectedDate }
        });
        setTimes(response.data.times);
      } catch (error) {
        console.error('Erro ao buscar horários disponíveis');
      }
    };

    if (selectedDate) {
      fetchTimes();
    }
  }, [selectedDate]);

  return (
    <div className="available-times">
      <h2>Horários Disponíveis</h2>
      <ul>
        {times.length > 0 ? (
          times.map((time, index) => <li key={index}>{time}</li>)
        ) : (
          <li>Sem horários disponíveis</li>
        )}
      </ul>
    </div>
  );
};

export default AvailabilityTimes;
