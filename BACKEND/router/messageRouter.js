import express from 'express';

// Importa a função sendMessage do controlador de mensagens
import { deleteMessage, getAllMessages, sendMessage } from '../controller/messageController.js';

import { isAdminAuthenticated} from '../middlewares/auth.js';

// Cria uma instância do roteador Express
const router = express.Router();

// Define a rota POST para enviar mensagens
// Quando uma requisição POST é feita para "/send", a função sendMessage é chamada
router.post("/send", sendMessage);
router.get("/getall",isAdminAuthenticated,getAllMessages);
router.delete("/delete/:id",isAdminAuthenticated, deleteMessage);

export default router;
