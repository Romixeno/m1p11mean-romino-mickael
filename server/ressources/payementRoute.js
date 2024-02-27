import { Router } from "express";
import {
  capture,
  createPayment,
  getAllPayments,
  order,
} from "../controllers/payementController.js";
export default Router()
  .post("/createPayment", createPayment)
  .get("/allPayment", getAllPayments)
  .post("/payment/orders", order)
  .post("/payment/orders/:orderID/capture", capture);
