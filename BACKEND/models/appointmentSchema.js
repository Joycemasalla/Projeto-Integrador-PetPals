import mongoose from "mongoose";
import validator from "validator";

/**
 * Este módulo define o esquema para a coleção de consultas (appointments) no MongoDB.
 * O esquema é utilizado para armazenar informações relacionadas a consultas médicas, incluindo
 * detalhes do paciente, do médico, e informações sobre a consulta em si. 
 * Inclui validações para garantir que os dados inseridos sejam válidos e completos.
 */

const appointmentSchema = new mongoose.Schema({
    // Campo para o primeiro nome do paciente
    firstName: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [3, "O nome deve conter pelo menos 3 caracteres"]  // Validação para garantir que o comprimento mínimo seja de 3 caracteres
    },
    // Campo para o sobrenome do paciente
    lastName: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [3, "O nome deve conter pelo menos 3 caracteres"]  // Validação para garantir que o comprimento mínimo seja de 3 caracteres
    },
    // Campo para o endereço de email do paciente
    email: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        validate: [validator.isEmail, "O endereço de email é inválido"]  // Validação para garantir que o endereço de email seja válido
    },
    // Campo para o número de telefone do paciente
    phone: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        minLength: [11, "O número deve conter pelo menos 11 dígitos"],  // Validação para garantir que o número tenha pelo menos 11 dígitos
        maxLength: [11, "O número deve conter 11 dígitos"]  // Validação para garantir que o número não tenha mais de 11 dígitos
    },
    // Campo para o NIC (Número de Identificação Nacional) do paciente
    nic: {
        type: String,  // Tipo de dado do campo é String
        default: null, // O campo nao é obrigatorio, se nao for preenchido fica null
        minLength: [11, "O Número de Identificação deve conter pelo menos 11 dígitos"],  // Validação para garantir que o NIC tenha pelo menos 11 dígitos
        maxLength: [11, "O Número de Identificaçã deve conter 11 dígitos"]  // Validação para garantir que o NIC não tenha mais de 11 dígitos
    },
    // Campo para a data de nascimento do paciente
    dob: {
        type: Date,  // Tipo de dado do campo é Date
        required: [true, "A data de nascimento é obrigatória"],  // O campo é obrigatório
    },
    // Campo para o gênero do paciente
    gender: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
        enum: ["Masculino", "Feminino", "Outro"]  // Validação para garantir que o gênero seja uma das opções fornecidas
    },
    // Campo para a data da consulta
    appointment_date: {
        date: { type: String, required: true }, // Formato 'YYYY-MM-DD'
        time: { type: String, required: true }   // Formato 'HH:MM'
      },
    // Campo para o departamento da consulta
    department: {
        type: String,  // Tipo de dado do campo é String
        required: true,  // O campo é obrigatório
    },
    // Campo para as informações do médico
    doctor: {
        firstName: {
            type: String,  // Tipo de dado do campo é String
            required: true,  // O campo é obrigatório
        },
        lastName: {
            type: String,  // Tipo de dado do campo é String
            required: true,  // O campo é obrigatório
        },
    },
    // Campo para indicar se o paciente já visitou o médico
    hasVisited: {
        type: Boolean,  // Tipo de dado do campo é Boolean
        default: false,  // Valor padrão é false
    },
    // Campo para o ID do médico
    doctorId: {
        type: mongoose.Schema.ObjectId,  // Tipo de dado do campo é ObjectId do Mongoose
        required: true,  // O campo é obrigatório
    },
    // Campo para o ID do paciente registrado
    patientRegistered: {
        type: mongoose.Schema.ObjectId,  // Tipo de dado do campo é ObjectId do Mongoose
        required: true,  // O campo é obrigatório
    },
    // Campo para o endereço do paciente
    address: {
        type: String,  // Tipo de dado do campo é String
        required: false,  // O campo é obrigatório
    },
    // Campo para o status da consulta
    status: {
        type: String,  // Tipo de dado do campo é String
        enum: ["Aceito", "Pendente", "Recusado"],  // Validação para garantir que o status seja um dos valores fornecidos
        default: "Pendente",  // Valor padrão é "Pendente"
    },
    // Campo para o nome do pet
    nomePet: {
        type: String,
        required: true,
    },
    // Campo para a espécie do pet
    especiePet: { // Novo campo adicionado
        type: String,
        required: true,
    },
    // Campo para a raça do pet
    racaPet: { // Novo campo adicionado
        type: String,
        required: true,
    },


   




});

// Exporta o modelo Appointment baseado no esquema definido
export const Appointment = mongoose.model('Appointment', appointmentSchema);
