//validações para garantir a integridade dos dados e utiliza middlewares para pré-processamento antes de salvar os dados no banco de dados.

// Importa o módulo mongoose para gerenciar a conexão com o banco de dados MongoDB
import mongoose from "mongoose";

// Importa o módulo validator para validação de dados
import validator from "validator";

// Importa o módulo bcrypt para hashing de senhas
import bcrypt from "bcrypt";

// Importa o módulo jsonwebtoken para criar e verificar tokens JWT
import jwt from "jsonwebtoken";

// Define o esquema para a coleção de usuários no MongoDB
const userSchema = new mongoose.Schema({
    // Campo para o primeiro nome do usuário
    firstName: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [3, "O nome deve conter pelo menos 3 caracteres"]  // Validação para garantir que o comprimento mínimo seja 3 caracteres
    },
    // Campo para o sobrenome do usuário
    lastName: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [3, "O nome deve conter pelo menos 3 caracteres"]  // Validação para garantir que o comprimento mínimo seja 3 caracteres
    },
    // Campo para o endereço de email do usuário
    email: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        validate: [validator.isEmail, "O endereço de email é inválido"]  // Validação para garantir que seja um endereço de email válido
    },
    // Campo para o número de telefone do usuário
    phone: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [11, "O número deve conter pelo menos 11 dígitos"],  // Validação para garantir que o comprimento mínimo seja 11 caracteres
        maxLength: [11, "O número deve conter 11 dígitos"]  // Validação para garantir que o comprimento máximo seja 11 caracteres
    },
    // Campo para o NIC (Número de Identificação Nacional) do usuário
    nic: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [11, "O Número de Identificaçã deve conter pelo menos 11 dígitos"],  // Validação para garantir que o comprimento mínimo seja 13 caracteres
        maxLength: [11, "O Número de Identificaçã deve conter 11 dígitos"]  // Validação para garantir que o comprimento máximo seja 13 caracteres
    },
    // Campo para a data de nascimento do usuário
    dob: {
        type: Date,  // Tipo de dado do campo é Date
        required: [true, "A data de nascimento é obrigatória"],  // O campo é obrigatório
    },
    // Campo para o gênero do usuário
    gender: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        enum: ["Masculino", "Feminino", "Outro"]  // Validação para garantir que seja uma das opções fornecidas
    },
    // Campo para a senha do usuário
    password: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [8, "A senha deve conter pelo menos 8 caracteres"],  // Validação para garantir que o comprimento mínimo seja 8 caracteres
        select: false  // O campo não será retornado ao serializar o documento
    },
    // Campo para o papel ou função do usuário
    role: {
        type: String,  // Tipo de dado do campo é String
        default: "Paciente",
        enum: ["Admin", "Paciente", "Doutor"]  // Validação para garantir que seja uma das opções fornecidas
    },
    // Campo opcional para o departamento do médico (aplicável apenas se o usuário for um doutor)
    doctorDepartment: [{
        type: String

    }], // Array para armazenar múltiplos departamentos

    // Campo opcional para o avatar do médico (imagem do perfil do médico)
    doctorAvatar: {
        public_id: String,  // ID público da imagem
        url: String,  // URL da imagem
    }
});

// Middleware de pré-salvamento para criptografar a senha antes de salvar o usuário
userSchema.pre("save", async function (next) {
    // Verifica se a senha foi modificada antes de criptografar
    if (!this.isModified("password")) {
        next();
    }
    // Criptografa a senha com bcrypt antes de salvar no banco de dados
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Método para comparar uma senha fornecida com a senha criptografada no banco de dados
userSchema.methods.comparePassword = async function (enteredPassword) {
    // Usa bcrypt para comparar a senha fornecida com a senha criptografada
    return await bcrypt.compare(enteredPassword, this.password);
};

// Método para gerar um token JWT para o usuário
userSchema.methods.generateJsonWebToken = function () {
    // Cria um token JWT assinado com o ID do usuário e com uma chave secreta
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,  // Define o tempo de expiração do token
    });
};

export const User = mongoose.model('User', userSchema);
