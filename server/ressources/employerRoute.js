import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getOneEmployee,
  loginEmployee,
  logoutEmployee,
  updateEmployee,
} from "../controllers/employerController.js";
export default Router()
  .post("/addEmployee", createEmployee)
  .post("/login/employee", loginEmployee)
  .get("/oneEmployee/:_id", getOneEmployee)
  .get("/allEmployer", getAllEmployees)
  .patch("/updateEmployee/:id", updateEmployee)
  .delete("/deleteEmployee/:_id", deleteEmployee)
  .delete("/employee/logout", logoutEmployee);
