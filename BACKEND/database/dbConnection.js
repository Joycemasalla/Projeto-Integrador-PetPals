// Importa o módulo mongoose para gerenciar a conexão com o banco de dados MongoDB
import mongoose from "mongoose";

// Função para conectar ao banco de dados MongoDB usando mongoose
export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        // Nome do banco de dados a ser utilizado
        dbName: "CLINICA_VETERINARIA_PETPALS"
    })
        .then(() => {
            // Mensagem exibida no console quando a conexão com o banco de dados for bem-sucedida
            console.log("Database connection successful!");
        })
        .catch((err) => {
            // Mensagem exibida no console quando ocorrer um erro na conexão com o banco de dados
            console.error("Database connection error:", err);
        });
};
