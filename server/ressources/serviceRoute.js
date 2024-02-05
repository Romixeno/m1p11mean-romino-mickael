import { Router } from "express";
import { addService, getService, getServiceById } from "../controllers/serviceController.js";
export default Router()
    .post('/service',addService)
    .get('/allService',getService)
    .get('/oneService/:serviceId',getServiceById)


