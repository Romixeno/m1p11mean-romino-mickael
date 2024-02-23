import { Router } from "express";
import {
  getAllClients,
  getClientProfile,
  login,
  logout,
  register,
  updateClient,
} from "../controllers/clientController.js";

// import { login, logout, register } from "../controllers/securityController.js";
export default Router()
  .get("/client/profile/:_id", getClientProfile)
  .get("/client/clients", getAllClients)
  .post("/client/register", register)
  .post("/client/login/", login)
  .patch("/client/update/:_id", updateClient)
  .delete("/client/logout", logout);
// .get('/register',register)
// .post('/user/register',register)
// .get('/login',login)
// .post('/user/login/',login)
// .delete('/logout',logout)
