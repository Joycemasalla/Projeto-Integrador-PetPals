import { User } from "../models/userSchema.js"; // Importa o modelo User baseado no esquema definido
import { catchAsyncErros } from "./catchAsyncError.js"; // Importa a função para tratamento de erros assíncronos
import ErrorHandler from "./errorMiddleware.js"; // Importa a classe ErrorHandler para lidar com erros personalizados
import jwt from "jsonwebtoken"; // Importa o módulo jwt para verificar tokens JWT

// Middleware para verificar a autenticação do administrador
export const isAdminAuthenticated = catchAsyncErros(async (req, res, next) => {
    // Obtém o token de autenticação dos cookies da requisição
    const token = req.cookies.adminToken;

    // Verifica se o token existe, caso contrário, retorna um erro
    if (!token) {
        return next(new ErrorHandler("Você precisa estar logado para acessar essa área", 400));
    }

    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Encontra o usuário no banco de dados pelo ID decodificado do token
    req.user = await User.findById(decoded.id);

    // Verifica se o usuário tem a função de administrador, caso contrário, retorna um erro
    if (!req.user || req.user.role !== "Admin") {
        return next(
            new ErrorHandler(
                "Você não tem permissão para acessar essa área", 403
            )
        );
    }

    // Continua para o próximo middleware ou rota
    next();
});

// Middleware para verificar a autenticação do paciente
export const isPatientAuthenticated = catchAsyncErros(async (req, res, next) => {
    const token = req.cookies.pacienteToken;

    if (!token) {
        return next(new ErrorHandler("Você precisa estar logado para acessar essa área", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
        return next(new ErrorHandler("Usuário não encontrado", 404));
    }

    if (req.user.role !== "Paciente") {
        return next(
            new ErrorHandler(
                "Você não tem permissão para acessar essa área", 403
            )
        );
    }

    next();
});
