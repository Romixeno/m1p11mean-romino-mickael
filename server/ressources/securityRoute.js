import { Router } from "express";
import { login, logout, register } from "../controllers/securityController.js";
export default Router()
    .get('/register',register)
    .post('/register/:roles',register)
    .get('/login',login)
    .post('/login/:roles',login)
    .delete('/logout',logout)