import { Router } from "express";
import { addService, deleteService, getAllServices, getServiceById, updateService } from "../controllers/serviceController.js";
export default Router()
    .post('/service',addService)
    .get('/allServices',getAllServices)
    .get('/oneService/:id',getServiceById)
    .patch('/updateService/:id',updateService)
    .delete('/deleteService/:id',deleteService)


