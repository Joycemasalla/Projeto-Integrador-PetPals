// Importa o framework Express para criar roteadores
import express from 'express';

// Importa a função sendMessage do controlador de mensagens
import { getAllMessages, sendMessage } from '../controller/messageController.js';

import { isAdminAuthenticated} from '../middlewares/auth.js';

// Cria uma instância do roteador Express
const router = express.Router();

// Define a rota POST para enviar mensagens
// Quando uma requisição POST é feita para "/send", a função sendMessage é chamada
router.post("/send", sendMessage);
router.get("/getall",isAdminAuthenticated,getAllMessages);

// Exporta o roteador para que possa ser importado em outros arquivos
export default router;
