// Importa o aplicativo Express a partir do módulo app.js
import app from "./app.js";

// Importa o módulo cloudinary para gerenciar uploads e manipulação de imagens na nuvem
import cloudinary from "cloudinary";

// Configura as credenciais do Cloudinary com base nas variáveis de ambiente
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Inicia o servidor na porta especificada e define um callback que será executado quando o servidor estiver pronto
app.listen(process.env.PORT, () => {
    // Exibe uma mensagem no console indicando que o servidor está escutando na porta especificada
    console.log(`Server listening on port ${process.env.PORT}`);
});
