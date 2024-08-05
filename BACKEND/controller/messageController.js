// Este arquivo contém funções assíncronas para gerenciar usuários e mensagens, incluindo registro, login, adição de novos administradores e envio de mensagens.

// Importa o middleware para tratamento de erros assíncronos
import { catchAsyncErros } from "../middlewares/catchAsyncError.js";

// Importa a classe ErrorHandler para lidar com erros personalizados
import ErrorHandler from "../middlewares/errorMiddleware.js";

// Importa o modelo Message a partir do arquivo messageSchema
import { Message } from "../models/messageSchema.js";

// Importa o modelo User baseado no esquema definido
 import { User } from "../models/userSchema.js";

// Importa a função para gerar tokens JWT
 import { generateToken } from "../utils/jwtToken.js";

/**
 * Função assíncrona para registrar um paciente.
 * Responsável por criar um novo paciente no banco de dados.
 * Verifica se todos os campos obrigatórios estão preenchidos,
 * verifica se o email já está em uso e cria um novo usuário no banco de dados.
 */
export const patientRegister = catchAsyncErros(async (req, res, next) => {
    // Extrai os dados do corpo da requisição
    const { firstName, lastName, email, password, phone, gender, dob, nic, role } = req.body;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!firstName || !lastName || !email || !password || !phone || !gender || !dob || !nic || !role) {
        // Se algum campo estiver faltando, retorna um erro 400 com uma mensagem apropriada
        return next(new ErrorHandler("Por favor preencha todos os campos", 400));
    }

    // Verifica se já existe um usuário com o mesmo email
    let user = await User.findOne({ email });
    if (user) {
        // Se um usuário com o mesmo email for encontrado, retorna um erro 400 com uma mensagem apropriada
        return next(new ErrorHandler("Já existe um usuário com este email", 400));
    }

    // Cria um novo usuário no banco de dados com os dados fornecidos
    user = await User.create({ firstName, lastName, email, password, phone, gender, dob, nic, role });

    // Gera um token JWT e responde com sucesso
    generateToken(user, "Paciente cadastrado com sucesso", 200, res);
});

/**
 * Função assíncrona para realizar login.
 * Responsável por autenticar um usuário existente.
 * Verifica se todos os campos obrigatórios estão preenchidos,
 * verifica se as senhas coincidem, verifica se o email e a senha são válidos,
 * e se o papel do usuário é permitido para login.
 */
export const login = catchAsyncErros(async (req, res, next) => {
    // Extrai os dados do corpo da requisição
    const { email, password, confirmPassword, role } = req.body;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Por favor preencha todos os campos", 400));
    }

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
        return next(new ErrorHandler("As senhas não coincidem", 400));
    }

    // Procura o usuário pelo email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Email ou senha inválidos", 400));
    }

    // Verifica se a senha é válida
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Email ou senha inválidos", 400));
    }

    // Verifica se o papel do usuário é permitido para login
    if (role !== user.role) {
        return next(new ErrorHandler("Você não tem permissão para fazer isto", 400));
    }

    // Gera um token JWT e responde com sucesso
    generateToken(user, "Usuário logado com sucesso", 200, res);
});

/**
 * Função assíncrona para adicionar um novo administrador.
 * Responsável por criar um novo usuário administrador no banco de dados.
 * Verifica se todos os campos obrigatórios estão preenchidos e
 * se o email já está em uso, e então cria um novo administrador.
 */
export const addNewAdmin = catchAsyncErros(async (req, res, next) => {
    // Extrai os dados do corpo da requisição
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;
    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!email || !password || !firstName || !lastName || !phone || !gender || !dob || !nic) {
        return next(new ErrorHandler("Por favor preencha todos os campos", 400));
    }

    // Verifica se já existe um usuário com o mesmo email
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} já existe um administrador com este email`));
    }

    // Cria um novo administrador no banco de dados com os dados fornecidos
    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role: "Admin"
    });

    // Responde com sucesso
    res.status(200).json({
        success: true,
        message: "Administrador cadastrado com sucesso",
    });
});

/**
 * Função assíncrona para enviar uma mensagem.
 * Responsável por criar uma nova mensagem no banco de dados.
 * Verifica se todos os campos necessários estão presentes.
 */
export const sendMessage = catchAsyncErros(async (req, res, next) => {
    // Extrai os dados do corpo da requisição
    const { firstName, lastName, email, phone, message } = req.body;

    // Verifica se todos os campos necessários estão presentes
    if (!firstName || !lastName || !email || !phone || !message) {
        // Retorna um erro se algum campo estiver faltando
        return next(new ErrorHandler("Por favor preencha todo o formulário", 400));
    }

    // Cria uma nova mensagem no banco de dados
    await Message.create({ email, firstName, lastName, phone, message });

    // Retorna uma resposta de sucesso se a mensagem for criada com sucesso
    res.status(200).json({
        success: true,
        message: 'Mensagem enviada com sucesso'
    });
});

/**
 * Função assíncrona para obter todas as mensagens.
 * Busca todas as mensagens no banco de dados.
 * Retorna uma resposta com todas as mensagens.
 */
export const getAllMessages = catchAsyncErros(async (req, res, next) => {
    // Busca todas as mensagens no banco de dados
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});
