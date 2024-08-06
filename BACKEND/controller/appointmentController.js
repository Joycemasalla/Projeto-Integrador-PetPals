import { catchAsyncErros } from "../middlewares/catchAsyncError.js"; // Importa o middleware para tratamento de erros assíncronos
import ErrorHandler from "../middlewares/errorMiddleware.js"; // Importa a classe ErrorHandler para lidar com erros personalizados
import { Appointment } from "../models/appointmentSchema.js"; // Importa o modelo Appointment baseado no esquema definido
import { User } from "../models/userSchema.js"; // Importa o modelo User baseado no esquema definido

/**
 * Função para agendar uma consulta.
 * Verifica se todos os campos necessários estão preenchidos.
 * Verifica se existe conflito de horários com o médico.
 * Cria um novo agendamento no banco de dados.
 */
export const postAppointment = catchAsyncErros(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
        nomePet, // Novo campo adicionado
        especiePet, // Novo campo adicionado
        racaPet, // Novo campo adicionado
    } = req.body;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (
        !nomePet ||
        !especiePet ||
        !racaPet ||
        !nic ||
        !gender ||
        !dob ||
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !appointment_date ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !address
    ) {
        return next(new ErrorHandler("Por favor preencha todos os campos necessários", 400)); // Se faltar algum campo, retorna um erro
    }
    
    

    // Verifica se existe um médico com o nome e departamento fornecidos
    const isConflict = await User.findOne({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doutor",
        doctorDepartment: department,
    });

    if (!isConflict) {
        return next(new ErrorHandler("Nenhum médico encontrado no departamento informado", 404)); // Se nenhum médico for encontrado, retorna um erro
    }

    // Cria um novo agendamento no banco de dados
    const doctorId = isConflict._id;
    const patientId = req.user._id;
    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor: {
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        },
        hasVisited,
        address,
        doctorId,
        patientRegistered: patientId,
        nomePet, // Novo campo incluído
        especiePet, // Novo campo incluído
        racaPet, // Novo campo incluído
    });

    res.status(200).json({
        success: true,
        message: "Consulta agendada com sucesso", // Retorna uma mensagem de sucesso
        appointment,
    });
});

/**
 * Função para obter todos os agendamentos.
 * Retorna uma lista de todos os agendamentos no banco de dados.
 */
export const getAppointments = catchAsyncErros(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
        success: true,
        message: "Suas consultas", // Retorna uma mensagem de sucesso com todos os agendamentos
        appointments,
    });
});

/**
 * Função para obter agendamentos do paciente autenticado.
 * Retorna uma lista de agendamentos específicos do paciente que está autenticado.
 */
export const getPatientAppointments = catchAsyncErros(async (req, res, next) => {
    try {
        const userId = req.user._id; // Supondo que o middleware 'isPatientAuthenticated' adiciona req.user
        const appointments = await Appointment.find({ patientRegistered: userId });
        res.status(200).json({
            success: true,
            message: "Agendamentos do paciente", // Retorna uma mensagem de sucesso com os agendamentos do paciente
            appointments,
        });
    } catch (error) {
        console.error("Error fetching patient appointments:", error);
        return next(new ErrorHandler("Failed to fetch appointments.", 500)); // Retorna uma mensagem de erro se ocorrer uma falha
    }
});

/**
 * Função para atualizar o status de um agendamento.
 * Verifica se o agendamento existe e atualiza com os novos dados fornecidos.
 */
export const updateAppointmentStatus = catchAsyncErros(async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);

    if (!appointment) {
        return next(new ErrorHandler("Consulta não encontrada", 404)); // Se o agendamento não for encontrado, retorna um erro
    }

    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Status da consulta atualizado com sucesso", // Retorna uma mensagem de sucesso
        appointment,
    });
});

/**
 * Função para deletar um agendamento.
 * Verifica se o agendamento existe e o remove do banco de dados.
 */
export const deleteAppointment = catchAsyncErros(async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);

    if (!appointment) {
        return next(new ErrorHandler("Consulta não encontrada", 404)); // Se o agendamento não for encontrado, retorna um erro
    }

    await appointment.deleteOne();

    res.status(200).json({
        success: true,
        message: "Consulta excluída com sucesso", // Retorna uma mensagem de sucesso
    });
});
