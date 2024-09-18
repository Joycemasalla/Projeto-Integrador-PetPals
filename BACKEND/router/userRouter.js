// Este módulo define as rotas para operações relacionadas a usuários, incluindo
// registro de pacientes, login, gerenciamento de administradores e médicos,
// obtenção de detalhes do usuário e logout. As rotas são protegidas por autenticação
// de administrador ou paciente conforme necessário.

import express from "express";
import { 
    addNewAdmin, 
    addNewDoctor,  
    deleteDoctor, 
    getAllDoctors, 
    getUserDetails, 
    login, 
    logoutAdmin, 
    logoutPatient, 
    patientRegister, 
    updateDoctor 
} from "../controller/userController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Rota para registrar um novo paciente
router.post("/paciente/register", patientRegister);

// Rota para realizar login
router.post("/login", login);

// Rota para adicionar um novo administrador. Requer autenticação de administrador
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// Rota para obter todos os médicos
router.get("/doctors", getAllDoctors);

// Rota para obter detalhes do administrador autenticado. Requer autenticação de administrador
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// Rota para obter detalhes do paciente autenticado. Requer autenticação de paciente
router.get("/paciente/me", isPatientAuthenticated, getUserDetails);

// Rota para realizar logout do administrador. Requer autenticação de administrador
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

// Rota para realizar logout do paciente. Requer autenticação de paciente
router.get("/paciente/logout", isPatientAuthenticated, logoutPatient);

// Rota para adicionar um novo médico. Requer autenticação de administrador
router.post("/doutor/addnew", isAdminAuthenticated, addNewDoctor);

// Rota para atualizar informações de um médico existente. Requer autenticação de administrador
router.put('/doutor/:id', isAdminAuthenticated, updateDoctor);




// Route to delete a doctor
router.delete('/doutor/:doctorId', isAdminAuthenticated, deleteDoctor);



export default router;
