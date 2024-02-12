import { Router } from "express";
import { createEmployee, deleteEmployee, getAllEmployees,  getOneEmployee,  updateEmployee,  } from "../controllers/employerController.js";
export default Router()
    .post('/addEmployee',createEmployee)
    .get('/oneEmployee/:_id',getOneEmployee)
    .get('/allEmployer',getAllEmployees)
    .patch('/updateEmployee/:id',updateEmployee)
    .delete('/deleteEmployee/:_id',deleteEmployee)