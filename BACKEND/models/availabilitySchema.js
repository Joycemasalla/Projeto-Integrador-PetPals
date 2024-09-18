import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true, // Garante que o campo date seja sempre fornecido
  },
  times: {
    type: [String],
    required: true, // Garante que o campo times seja sempre fornecido
    validate: [arrayLimit, 'O array de horários deve ter pelo menos um horário'] // Validação personalizada
  },
});

// Função de validação para o array de horários
function arrayLimit(val) {
  return val.length > 0;
}

// Adiciona um índice para o campo date para melhorar a performance das consultas
availabilitySchema.index({ date: 1 });

export default mongoose.model('Availability', availabilitySchema);
