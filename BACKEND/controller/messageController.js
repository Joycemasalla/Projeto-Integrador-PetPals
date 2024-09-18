// Este arquivo contém funções assíncronas para gerenciar usuários e mensagens, incluindo registro, login, adição de novos administradores e envio de mensagens.

// Importa o middleware para tratamento de erros assíncronos
import { catchAsyncErros } from "../middlewares/catchAsyncError.js";

// Importa a classe ErrorHandler para lidar com erros personalizados
import ErrorHandler from "../middlewares/errorMiddleware.js";

// Importa o modelo Message a partir do arquivo messageSchema
import { Message } from "../models/messageSchema.js";





/*
  Função assíncrona para enviar uma mensagem.
  Responsável por criar uma nova mensagem no banco de dados.
  Verifica se todos os campos necessários estão presentes.
*/
export const sendMessage = catchAsyncErros(async (req, res, next) => {
    // Extrai os dados do corpo da requisição
    const { firstName, lastName, email, phone, message,  rating } = req.body;

    // Verifica se todos os campos necessários estão presentes
    if (!firstName || !lastName || !email || !phone || !message) {
        // Retorna um erro se algum campo estiver faltando
        return next(new ErrorHandler("Por favor preencha todo o formulário", 400));
    }

    // Cria uma nova mensagem no banco de dados
    await Message.create({ email, firstName, lastName, phone, message,  rating: rating || 0, });

    // Retorna uma resposta de sucesso se a mensagem for criada com sucesso
    res.status(200).json({
        success: true,
        message: 'Mensagem enviada com sucesso'
    });
});

/*
  Função assíncrona para obter todas as mensagens.
  Busca todas as mensagens no banco de dados.
  Retorna uma resposta com todas as mensagens.
*/
export const getAllMessages = catchAsyncErros(async (req, res, next) => {
    // Busca todas as mensagens no banco de dados
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});


/*Função para deletar uma mensagem*/

export const deleteMessage = async (req, res) => {
    try {
      const messageId = req.params.id;
      const deletedMessage = await Message.findByIdAndDelete(messageId);
      if (!deletedMessage) {
        return res.status(404).json({ success: false, message: 'Mensagem não encontrada' });
      }
      res.status(200).json({ success: true, message: 'Mensagem excluída com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao excluir a mensagem', error: error.message });
    }
  };
  
