import { Router } from "express";
import { login, logout, register } from "../controllers/securityController.js";
export default Router()
    .get('/register',register)
    .post('/user/register',register)
    .get('/login',login)
    .post('/user/login/',login)
    .delete('/logout',logout)