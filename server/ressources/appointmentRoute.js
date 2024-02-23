import { Router } from "express";
import {
  createAppointment,
  getAllAppointment,
} from "../controllers/appointmentController.js";
export default Router()
  .post("/appointment/new", createAppointment)
  .get("/appointment", getAllAppointment);
