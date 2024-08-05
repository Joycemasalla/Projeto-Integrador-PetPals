//gera um token JWT para um usuário autenticado e o envia de volta ao cliente junto com uma resposta HTTP.


// Função para gerar um token JWT e enviá-lo ao cliente junto com a resposta HTTP
export const generateToken = (user, message, statusCode, res) => {
    // Gera o token JWT usando o método do modelo User
    const token = user.generateJsonWebToken();
    
    // Define o nome do cookie com base no papel do usuário
    const cookieName = user.role === "Admin" ? "adminToken" : "pacienteToken";
    
    // Envia a resposta HTTP com o status code, define o cookie e retorna o token e dados do usuário
    res.status(statusCode).cookie(cookieName, token, {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // Define a expiração do cookie
        ),
        httpOnly: true, // Define que o cookie só pode ser acessado por um script no lado do cliente
    }).json({
        success: true, // Indica que a operação foi bem-sucedida
        message,       // Mensagem de sucesso
        user,          // Dados do usuário
        token,         // Token JWT
    });
};
