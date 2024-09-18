// Importa o módulo mongoose para gerenciar a conexão com o banco de dados MongoDB
import mongoose from "mongoose";

// Importa o módulo validator para validação de dados
import validator from "validator";

// Define o esquema para a coleção de mensagens no MongoDB
const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "O nome deve conter pelo menos 3 caracteres"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "O nome deve conter pelo menos 3 caracteres"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "O endereço de email é inválido"]
    },
    phone: {
        type: String,
        required: true,
        minLength: [11, "O número deve conter pelo menos 11 digitos"],
        maxLength: [11, "O número deve conter 11 digitos"]
    },
    message: {
        type: String,
        required: true,
        minLength: [10, "A mensagem deve conter pelo menos 10 caracteres"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 0,
    }
}, { timestamps: true }); // Adiciona os campos createdAt e updatedAt

export const Message = mongoose.model('Message', messageSchema);
