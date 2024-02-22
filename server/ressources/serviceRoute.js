import { Router } from "express";
import {
  addService,
  addServiceType,
  deleteService,
  getAllServiceTypes,
  getAllServices,
  getServiceById,
  updateService,
} from "../controllers/serviceController.js";
export default Router()
  .post("/service", addService)
  .post("/addServiceType", addServiceType)
  .get("/allServices", getAllServices)
  .get("/allServiceType", getAllServiceTypes)
  .get("/oneService/:id", getServiceById)
  .patch("/updateService/:id", updateService)
  .delete("/deleteService/:id", deleteService);
