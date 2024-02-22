import { Router } from "express";
import { login, logout, register } from "../controllers/managerController";

export default Router()
  .get("/getManager", (req, res) => {})
  .post("/manager/login", login)
  .post("/addManager", register)
  .delete("/manager/logout", logout);
