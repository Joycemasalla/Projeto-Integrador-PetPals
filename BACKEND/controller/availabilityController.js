// controllers/availabilityController.js
import Availability from '../models/availabilitySchema.js';

// Função para adicionar disponibilidade
export const addAvailability = async (req, res) => {
    try {
        const { date, times } = req.body;
        console.log('Recebendo dados:', { date, times });
        const newAvailability = new Availability({ date, times });
        await newAvailability.save();
        console.log('Disponibilidade salva:', newAvailability);
        res.status(200).json({ message: 'Horários adicionados com sucesso' });
    } catch (error) {
        console.error('Erro ao adicionar horários:', error);
        res.status(500).json({ message: 'Erro ao adicionar horários', error });
    }
};

// Função para buscar todas as disponibilidades
export const getAvailabilityByDate = async (req, res) => {
    try {
        const { date } = req.query;
        console.log('Buscando disponibilidades para a data:', date);
        const availability = await Availability.find({ date });
        console.log('Disponibilidades encontradas:', availability);
        res.status(200).json(availability);
    } catch (error) {
        console.error('Erro ao buscar horários adicionados:', error);
        res.status(500).json({ message: 'Erro ao buscar horários adicionados', error });
    }
};

// Função para buscar todas as disponibilidades
export const getAllAvailability = async (req, res) => {
    try {
        const availability = await Availability.find();
        res.status(200).json(availability);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar horários', error });
    }
};

// Função para atualizar disponibilidade
export const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, times } = req.body;

        const updatedAvailability = await Availability.findByIdAndUpdate(
            id,
            { date, times },
            { new: true, runValidators: true }
        );

        if (!updatedAvailability) {
            return res.status(404).json({ message: 'Disponibilidade não encontrada' });
        }

        res.status(200).json(updatedAvailability);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar disponibilidade', error });
    }
};

// Função para excluir disponibilidade
export const deleteAvailability = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAvailability = await Availability.findByIdAndDelete(id);

        if (!deletedAvailability) {
            return res.status(404).json({ message: 'Disponibilidade não encontrada' });
        }

        res.status(200).json({ message: 'Disponibilidade excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir disponibilidade', error });
    }
};

// Função para atualizar horários disponíveis
export const updateAvailableTimes = async (req, res) => {
    const { date, time } = req.body;

    try {
        const availability = await Availability.findOne({ date: date });

        if (!availability) {
            return res.status(404).json({ message: 'Data não encontrada' });
        }

        if (!availability.times.includes(time)) {
            return res.status(400).json({ message: 'Horário não encontrado na disponibilidade' });
        }

        availability.times = availability.times.filter(t => t !== time);
        await availability.save();

        return res.status(200).json({ message: 'Horário atualizado com sucesso', times: availability.times });
    } catch (error) {
        console.error('Erro ao atualizar horário:', error);
        return res.status(500).json({ message: 'Erro ao atualizar horário', error });
    }
};

// Exemplo em Express.js

export const removeAvailable = async (req, res) => {
    const { id } = req.params;
    const { timeToRemove, date } = req.body;

    try {
        const disponibilidade = await Disponibilidade.findById(id);

        if (!disponibilidade) {
            return res.status(404).json({ message: 'Disponibilidade não encontrada' });
        }

        disponibilidade.times = disponibilidade.times.filter(time => time !== timeToRemove);

        await disponibilidade.save();
        res.status(200).json(disponibilidade);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar disponibilidade' });
    }
}
