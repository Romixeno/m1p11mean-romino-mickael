import { Router } from "express";
import { getAverageWorkTimeForEmployees } from "../controllers/statistiqueController.js";
export default Router()
    .get('/averageWorkTime/:employeeId',getAverageWorkTimeForEmployees)