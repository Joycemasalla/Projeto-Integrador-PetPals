// Define uma classe personalizada de erro que estende a classe base Error
class ErrorHandler extends Error {
    // O construtor recebe uma mensagem de erro e um código de status HTTP
    constructor(message, statusCode) {
        // Chama o construtor da classe base Error com a mensagem fornecida
        super(message);
        // Define o código de status HTTP para este erro
        this.statusCode = statusCode;
    }
}

// Exporta uma função middleware para lidar com erros
export const errorMiddleware = (err, req, res, next) => {
    // Define uma mensagem padrão para o erro, caso não haja uma mensagem fornecida
    err.message = err.message || "Erro interno do servidor";
    // Define um código de status padrão para o erro, caso não haja um código fornecido
    err.statusCode = err.statusCode || 500;

    // Verifica se o erro é um erro de duplicidade no MongoDB
    if (err.code === 11000) {
        const message = `Duplicado ${Object.keys(err.keyValue)} inserido`; // Corrige a mensagem de duplicidade
        err = new ErrorHandler(message, 400); // Cria um novo erro com a mensagem personalizada e código de status 400
    }

    // Verifica se o erro é um erro de token JWT inválido
    if (err.name === "JsonWebTokenError") {
        const message = "Token JSON Web é inválido"; // Corrige a mensagem de token inválido
        err = new ErrorHandler(message, 400); // Cria um novo erro com a mensagem personalizada e código de status 400
    }

    // Verifica se o erro é um erro de token JWT expirado
    if (err.name === "TokenExpiredError") {
        const message = "Token JSON Web expirou"; // Corrige a mensagem de token expirado
        err = new ErrorHandler(message, 400); // Cria um novo erro com a mensagem personalizada e código de status 400
    }

    // Verifica se o erro é um erro de tipo inválido (por exemplo, ID de banco de dados inválido)
    if (err.name === "CastError") {
        const message = `Valor inválido para ${err.path}`; // Corrige a mensagem para erros de tipo inválido
        err = new ErrorHandler(message, 400); // Cria um novo erro com a mensagem personalizada e código de status 400
    }

    // Se houver erros de validação, mapeia e concatena suas mensagens
    const errorMessage = err.errors
        ? Object.values(err.errors).map(error => error.message).join(" ")
        : err.message;

    // Envia a resposta de erro para o cliente com o código de status e a mensagem apropriados
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage // Corrige a mensagem do erro para exibir a mensagem agregada
    });
};

// Exporta a classe ErrorHandler para uso em outros arquivos
export default ErrorHandler;
