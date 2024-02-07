import { Router } from "express";
import { createPayment, getAllPayments } from "../controllers/payementController.js";
export default Router()
    .post('/createPayement',createPayment)
    .get('/allPayement',getAllPayments)