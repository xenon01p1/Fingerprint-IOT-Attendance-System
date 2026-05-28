import express from "express";
import { PrismaClient } from "@prisma/client"; // Import the actual Client
import AuthController from "../controllers/authController.js";
import AuthService from "../services/authService.js";
import AuthRepository from "../repositories/authRepo.js";
const authRoute = express.Router();
const prisma = new PrismaClient();
const authRepo = new AuthRepository(prisma);
const authService = new AuthService(authRepo);
const authController = new AuthController(authService);
authRoute.post('/login', authController.adminLoginController);
authRoute.post('/refreshToken', authController.refreshTokenController);
export default authRoute;
