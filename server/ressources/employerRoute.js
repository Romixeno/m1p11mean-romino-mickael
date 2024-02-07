import { Router } from "express";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployee, updateEmployee,  } from "../controllers/employerController.js";
export default Router()
    .post('/addEmployee',createEmployee)
    .get('/oneEmployee/:id',getEmployee)
    .get('/allEmployer',getAllEmployees)
    .patch('/updateEmployee/:id',updateEmployee)
    .delete('/deleteEmployee/:id',deleteEmployee)