import { Router } from "express";
import { getAverageWorkTimeForEmployees, getRevenuePerDay, getRevenuePerMonth } from "../controllers/statistiqueController.js";
export default Router()
    .get('/averageWorkTime/:employeeId',getAverageWorkTimeForEmployees)
    .get('/getRevenuePerDay/:date',getRevenuePerDay)
    .get('/revenue-per-month/:year/:month',getRevenuePerMonth)