import { Router } from "express";
import { getAverageWorkTimeForEmployees, getRevenuePerDay } from "../controllers/statistiqueController.js";
export default Router()
    .get('/averageWorkTime/:employeeId',getAverageWorkTimeForEmployees)
    .get('/getRevenuePerDay/:date',getRevenuePerDay)