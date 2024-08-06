import express from 'express';
const router = express.Router();
import { 
    getAvailabilityByDate, 
    addAvailability, 
    getAllAvailability, 
    updateAvailability, 
    deleteAvailability, 
    updateAvailableTimes
} from '../controller/availabilityController.js';

// Adiciona nova disponibilidade
router.post('/disponibilidade', addAvailability);

// Busca disponibilidade por data
router.get('/disponibilidade', getAvailabilityByDate);

// Busca todas as disponibilidades
router.get('/disponibilidades', getAllAvailability);

// Atualiza uma disponibilidade existente
router.put('/disponibilidade/:id', updateAvailability);

// Exclui uma disponibilidade existente
router.delete('/disponibilidade/:id', deleteAvailability);

// Atualiza horários disponíveis específicos
router.patch('/disponibilidade/update', updateAvailableTimes); // Usar PATCH se a atualização for parcial



export default router;
