//responsável por configurar o servidor Express, configurar middlewares, estabelecer conexões com o banco de dados, e definir as rotas da aplicação.


// Importa o framework Express para construir o servidor web
import express from "express";

// Importa a função config do pacote dotenv para carregar as variáveis de ambiente
import { config } from "dotenv";

// Importa o middleware cors para habilitar CORS (Cross-Origin Resource Sharing)
import cors from "cors";

// Importa o middleware cookie-parser para analisar cookies anexados às requisições do cliente
import cookieParser from "cookie-parser";

// Importa o middleware express-fileupload para permitir o upload de arquivos
import fileUpload from "express-fileupload";

// Importa a função de conexão com o banco de dados
import { dbConnection } from "./database/dbConnection.js";

// Importa o roteador para as rotas relacionadas a mensagens
import messageRouter from "./router/messageRouter.js";

// Importa o middleware para tratamento de erros personalizados
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

// Importa o roteador para as rotas relacionadas a usuários
import userRouter from "./router/userRouter.js";

// Importa a função de login do controlador de usuários
import { login } from "./controller/userController.js";

import appointmentRouter from "./router/appointmentRouter.js"


// Cria uma instância do aplicativo Express
const app = express();

// Carrega as variáveis de ambiente do arquivo config.env localizado na pasta config
config({ path: "./config/config.env" });

// Configura o middleware cors com as URLs de origem permitidas e métodos HTTP permitidos
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Adiciona o middleware cookie-parser para analisar cookies
app.use(cookieParser());

// Adiciona o middleware express.json para analisar corpos de requisições JSON
app.use(express.json());

// Adiciona o middleware express.urlencoded para analisar corpos de requisições URL-encoded
app.use(express.urlencoded({ extended: true }));

// Adiciona o middleware express-fileupload para permitir o upload de arquivos
app.use(
    fileUpload({
        useTempFiles: true,  // Usa arquivos temporários para uploads
        tempFileDir: "/tmp/",  // Diretório para armazenar arquivos temporários
    })
);

// Configura as rotas para a API de mensagens
app.use("/api/v1/message", messageRouter);

// Configura as rotas para a API de usuários
app.use("/api/v1/user", userRouter);

app.use("/api/v1/appointment", appointmentRouter);

// Configura a rota para a função de login ///////
app.use("/api/v1/login", login);

// Estabelece a conexão com o banco de dados
dbConnection();

// Adiciona o middleware para tratamento de erros personalizados
app.use(errorMiddleware);

// Exporta a instância do aplicativo Express para que possa ser importada em outros arquivos
export default app;
