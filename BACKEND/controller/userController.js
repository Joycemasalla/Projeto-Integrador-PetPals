import { catchAsyncErros } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

// Função para registrar um paciente
export const patientRegister = catchAsyncErros(async (req, res, next) => {
    const { firstName, lastName, email, password, phone, gender, dob, nic, role = 'Paciente' } = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !gender || !dob || !nic || !role) {
        return next(new ErrorHandler("Por favor, preencha todos os campos", 400));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("Já existe um usuário com este email", 400));
    }

    user = await User.create({ firstName, lastName, email, password, phone, gender, dob, nic, role });
    generateToken(user, "Paciente cadastrado com sucesso", 200, res);
});

// Função para realizar login
export const login = catchAsyncErros(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password ||  !role) { // Tirei o !confirmPassword ||
        return next(new ErrorHandler("Por favor, preencha todos os campos", 400));
    }

    // if (password !== confirmPassword) {
    //     return next(new ErrorHandler("As senhas não coincidem", 400));
    // }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Email ou senha inválidos", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Email ou senha inválidos", 400));
    }

    if (role !== user.role) {
        return next(new ErrorHandler("Você não tem permissão para fazer isto", 400));
    }

    generateToken(user, "Usuário logado com sucesso", 200, res);
});

// Função para adicionar um novo administrador
export const addNewAdmin = catchAsyncErros(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;

    if (!email || !password || !firstName || !lastName || !phone || !gender || !dob || !nic) {
        return next(new ErrorHandler("Por favor, preencha todos os campos", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`Já existe um administrador com este email`, 400));
    }

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

    res.status(200).json({
        success: true,
        message: "Administrador cadastrado com sucesso",
    });
});

// Função para obter todos os médicos
export const getAllDoctors = catchAsyncErros(async (req, res, next) => {
    const doctors = await User.find({ role: 'Doutor' });
    res.status(200).json({
        success: true,
        doctors
    });
});

// Função para obter os detalhes de um usuário
export const getUserDetails = catchAsyncErros(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

// Função para realizar logout de um administrador
export const logoutAdmin = catchAsyncErros(async (req, res, next) => {
    res.status(200).cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Sessão encerrada com sucesso"
    });
});

// Função para realizar logout de um paciente
export const logoutPatient = catchAsyncErros(async (req, res, next) => {
    res.status(200).cookie("pacienteToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Sessão encerrada com sucesso"
    });
});

// Função para adicionar um novo médico
export const addNewDoctor = catchAsyncErros(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Avatar do doutor necessário!", 400));
    }

    const { doctorAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

    if (!allowedFormats.includes(doctorAvatar.mimetype)) {
        return next(new ErrorHandler("Formato de avatar inválido! Utilize apenas PNG, JPG ou WEBP.", 400));
    }

    const { firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !doctorDepartment || !dob || !nic || !gender) {
        return next(new ErrorHandler("Todos os campos obrigatórios devem estar preenchidos!", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("Doutor já cadastrado com este email!", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(doctorAvatar.tempFilePath, {
        folder: "doctors",
    });

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

    res.status(200).json({
        success: true,
        message: "Doutor cadastrado com sucesso",
        doctor,
    });
});

// Função para atualizar os dados de um médico
export const updateDoctor = catchAsyncErros(async (req, res) => {
    try {
        const { id } = req.params; // Obter ID do médico dos parâmetros da URL
        const updates = req.body;

        // Verificar se há um arquivo de avatar
        if (req.files && req.files.doctorAvatar) {
            const { doctorAvatar } = req.files;
            const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

            if (!allowedFormats.includes(doctorAvatar.mimetype)) {
                return res.status(400).json({ message: "Formato de avatar inválido! Utilize apenas PNG, JPG ou WEBP." });
            }

            // Fazer o upload do novo avatar para o Cloudinary
            const cloudinaryResponse = await cloudinary.uploader.upload(doctorAvatar.tempFilePath, {
                folder: "doctors",
            });

            updates.doctorAvatar = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            };
        }

        // Atualizar detalhes do médico
        const doctor = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!doctor) {
            return res.status(404).json({ message: "Doutor não encontrado" });
        }

        res.status(200).json({
            success: true,
            message: "Doutor atualizado com sucesso",
            doctor,
        });
    } catch (error) {
        console.error('Erro ao atualizar doutor:', error);
        res.status(500).json({ message: 'Erro ao atualizar doutor', error });
    }
});

// Função para excluir um médico
export const deleteDoctor = catchAsyncErros(async (req, res) => {
    try {
        const { doctorId } = req.params; // Obter ID do médico dos parâmetros da URL

        if (!doctorId) {
            return res.status(400).json({ message: 'ID do doutor não fornecido' });
        }

        const doctor = await User.findByIdAndDelete(doctorId); // Usar o modelo User para encontrar e excluir o doutor

        if (!doctor) {
            return res.status(404).json({ message: 'Doutor não encontrado' });
        }

        res.status(200).json({ message: 'Doutor excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir doutor:', error);
        res.status(500).json({ message: 'Erro ao excluir doutor', error });
    }
});
