// Importa o middleware para tratamento de erros assíncronos
import { catchAsyncErros } from "../middlewares/catchAsyncError.js";

// Importa a classe ErrorHandler para lidar com erros personalizados
import ErrorHandler from "../middlewares/errorMiddleware.js";

// Importa o modelo User baseado no esquema definido
import { User } from "../models/userSchema.js";

// Importa a função para gerar tokens JWT
import { generateToken } from "../utils/jwtToken.js";

// Importa o cloudinary para upload de imagens
import cloudinary from "cloudinary";

/**
 * Função assíncrona para registrar um paciente.
 * Cria um novo paciente no banco de dados.
 * Verifica se todos os campos obrigatórios estão preenchidos,
 * se o email já está em uso, e cria um novo usuário no banco de dados.
 */
export const patientRegister = catchAsyncErros(async (req, res, next) => {
    const { firstName, lastName, email, password, phone, gender, dob, nic, role='Paciente' } = req.body;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!firstName || !lastName || !email || !password || !phone || !gender || !dob || !nic || !role) {
        return next(new ErrorHandler("Por favor preencha todos os campos", 400));
    }

    // Verifica se já existe um usuário com o mesmo email
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("Já existe um usuário com este email", 400));
    }

    // Cria um novo usuário no banco de dados com os dados fornecidos
    user = await User.create({ firstName, lastName, email, password, phone, gender, dob, nic, role });

    // Gera um token JWT e responde com sucesso
    generateToken(user, "Paciente cadastrado com sucesso", 200, res);
});

/**
 * Função assíncrona para realizar login.
 * Autentica um usuário existente.
 * Verifica se todos os campos obrigatórios estão preenchidos,
 * se as senhas coincidem, se o email e a senha são válidos,
 * e se o papel do usuário é permitido para login.
 */
export const login = catchAsyncErros(async (req, res, next) => {
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
 * Cria um novo administrador no banco de dados.
 * Verifica se todos os campos obrigatórios estão preenchidos e se o email já está em uso.
 */
export const addNewAdmin = catchAsyncErros(async (req, res, next) => {
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
 * Função assíncrona para obter todos os médicos.
 * Busca todos os usuários com o papel de "Doutor" no banco de dados.
 */
export const getAllDoctors = catchAsyncErros(async (req, res, next) => {
    const doctors = await User.find({ role: 'Doutor' });
    res.status(200).json({
        success: true,
        doctors
    });
});

/**
 * Função assíncrona para obter os detalhes de um usuário.
 * Retorna os detalhes do usuário autenticado.
 */
export const getUserDetails = catchAsyncErros(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

/**
 * Função assíncrona para realizar logout de um administrador.
 * Encerra a sessão do administrador removendo o cookie de autenticação.
 */
export const logoutAdmin = catchAsyncErros(async (req, res, next) => {
    res.status(200).cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Sessão encerrada com sucesso"
    });
});

/**
 * Função assíncrona para realizar logout de um paciente.
 * Encerra a sessão do paciente removendo o cookie de autenticação.
 */
export const logoutPatient = catchAsyncErros(async (req, res, next) => {
    res.status(200).cookie("pacienteToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Sessão encerrada com sucesso"
    });
});

/**
 * Função assíncrona para adicionar um novo médico.
 * Cria um novo médico no banco de dados.
 * Verifica se todos os campos obrigatórios estão preenchidos,
 * se o email já está em uso, e carrega a imagem de avatar do médico no Cloudinary.
 */
export const addNewDoctor = catchAsyncErros(async (req, res, next) => {
    // Verifica se há arquivos na requisição
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Avatar médico necessário!", 400));
    }

    const { doctorAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

    // Verifica se o formato do arquivo é permitido
    if (!allowedFormats.includes(doctorAvatar.mimetype)) {
        return next(new ErrorHandler("Formato de avatar inválido! Utilize apenas PNG, JPG ou WEBP.", 400));
    }

    const { firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment } = req.body;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!firstName || !lastName || !email || !phone || !password || !doctorDepartment || !dob || !nic || !gender) {
        return next(new ErrorHandler("Todos os campos obrigatórios devem estar preenchidos!", 400));
    }

    // Verifica se já existe um usuário com o mesmo email
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("Médico já cadastrado com este email!", 400));
    }

    // Carrega a imagem no Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(doctorAvatar.tempFilePath, {
        folder: "doctors",
    });

    // Cria um novo doutor no banco de dados com os dados fornecidos
    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        role: "Doutor",
        doctorAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    // Responde com sucesso
    res.status(200).json({
        success: true,
        message: "Doutor cadastrado com sucesso",
        doctor,
    });
});
