// Importa o módulo mongoose para gerenciar a conexão com o banco de dados MongoDB
import mongoose from "mongoose";

// Importa o módulo validator para validação de dados
import validator from "validator";

// Define o esquema para a coleção de mensagens no MongoDB
const messageSchema = new mongoose.Schema({
    // Campo para o primeiro nome do remetente
    firstName: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [3, "O nome deve conter pelo menos 3 caracteres"]  // Validação para garantir que o comprimento mínimo seja 3 caracteres
    },
    lastName: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [3, "O nome deve conter pelo menos 3 caracteres"]  // Validação para garantir que o comprimento mínimo seja 3 caracteres
    },
    email: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        validate: [validator.isEmail, "O endereço de email é inválido"]  // Validação para garantir que seja um endereço de email válido
    },
    phone: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [11, "O número deve conter pelo menos 11 digitos"],  // Validação para garantir que o comprimento mínimo seja 11 caracteres
        maxLength: [11, "O número deve conter 11 digitos"]  // Validação para garantir que o comprimento mínimo seja 11 caracteres

    },
    message: { 
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [10, "A mensagem deve conter pelo menos 10 caracteres"]  // Validação para garantir que o comprimento mínimo seja 10 caracteres
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 0, // Define 0 como valor padrão caso não seja especificado
    }

});

// Exporta o modelo baseado no esquema definido
export const Message= mongoose.model('Message', messageSchema);
