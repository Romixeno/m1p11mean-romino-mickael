import { Router } from "express";
import {
  createAppointment,
  getAllAppointment,
  getOneAppointment,
} from "../controllers/appointmentController.js";
export default Router()
  .post("/appointment/new", createAppointment)
  .get("/appointment", getAllAppointment)
  .get('/appointments/:id', getOneAppointment)
