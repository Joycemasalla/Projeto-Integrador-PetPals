import express from 'express';
import { deleteAppointment, getAppointments, postAppointment, updateAppointmentStatus, getPatientAppointments } from '../controller/appointmentController.js';
import { isAdminAuthenticated, isPatientAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Rota para criar uma nova consulta. Requer autenticação do paciente.
router.post('/post', isPatientAuthenticated, postAppointment);

// Rota para obter todas as consultas. Requer autenticação do administrador.
router.get('/getall', isAdminAuthenticated, getAppointments);

// Rota para obter agendamentos do paciente autenticado. Requer autenticação do paciente.
router.get('/user', isPatientAuthenticated, getPatientAppointments);

// Rota para atualizar o status de uma consulta existente. Requer autenticação do administrador. O ID da consulta é passado como parâmetro na URL.
router.put('/update/:id', isAdminAuthenticated, updateAppointmentStatus);

// Rota para excluir uma consulta existente. Requer autenticação do administrador. O ID da consulta é passado como parâmetro na URL.
router.delete('/delete/:id', isAdminAuthenticated, deleteAppointment);


export default router;
