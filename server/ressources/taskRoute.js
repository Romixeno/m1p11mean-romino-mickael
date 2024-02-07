import { Router } from "express";
import { createTask, getAllTasks, getTaskById, updateTask } from "../controllers/taskController.js";
export default Router()
    .post('/createTask',createTask)
    .get('/oneTask/:id',getTaskById)
    .get('/allTask',getAllTasks)
    .patch('/updateTask/:id',updateTask)