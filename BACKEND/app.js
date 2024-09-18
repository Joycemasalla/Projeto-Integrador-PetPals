import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import availabilityRouter from "./router/availabilityRouter.js";
import { login } from "./controller/userController.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

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

// Configura as rotas para a API de agendamentos
app.use("/api/v1/appointment", appointmentRouter);

// Configura as rotas para a API de disponibilidade
app.use('/api/v1/admin', availabilityRouter);

// Configura a rota para a função de login
app.post("/api/v1/login", login);


// Estabelece a conexão com o banco de dados
dbConnection();

// Adiciona o middleware para tratamento de erros personalizados
app.use(errorMiddleware);

export default app;
