import { Router } from "express";
import {
  createAppointment,
  getAllAppointment,
  getClientAppointment,
  getEmployeeTasks,
  getOneAppointment,
} from "../controllers/appointmentController.js";
export default Router()
  .post("/appointment/new", createAppointment)
  .get("/appointment", getAllAppointment)
  .get("/appointments/:id", getOneAppointment)
  .get("/appointment/client/:id", getClientAppointment)
  .get("/appointment/employee/:id", getEmployeeTasks);
