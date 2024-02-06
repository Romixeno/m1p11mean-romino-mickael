import { Router } from "express";
import { createAppointment, getAppointments } from "../controllers/remindAppointmentController.js";
export default Router()
    .post('/createAppointment',createAppointment)
    .get('/allAppointment',getAppointments)