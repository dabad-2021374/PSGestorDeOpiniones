import express from "express";

import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

import {login, registerUser, test, updatePass, updateUser } from "./user.controller.js";

const api = express.Router();

//Rutas
api.get('/test', [validateJwt, isAdmin] ,test)
api.post('/registerUser', registerUser)
api.post('/login', login)
api.put('/updateUser/:id', [validateJwt], updateUser)
api.put('/updatePassword', [validateJwt], updatePass)

export default api