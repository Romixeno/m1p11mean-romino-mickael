import { Router } from "express";
import { createPayment } from "../controllers/payementController.js";
export default Router()
    ('/',createPayment)