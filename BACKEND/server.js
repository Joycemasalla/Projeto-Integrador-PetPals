import mongoose from "mongoose";
import app from "./app.js";
import cloudinary from "cloudinary";

// Configura as credenciais do Cloudinary com base nas variáveis de ambiente
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Estabelece a conexão com o banco de dados e trata erros
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// Inicia o servidor na porta especificada e define um callback que será executado quando o servidor estiver pronto
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
