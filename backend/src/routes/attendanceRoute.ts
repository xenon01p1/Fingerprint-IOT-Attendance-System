import express from "express";
import { PrismaClient } from "@prisma/client";
import AttendanceController from "../controllers/attendanceController.js";
import AttendanceService from "../services/attendanceService.js";
import AttendanceRepository from "../repositories/attendanceRepo.js";

const attendanceRoute = express.Router();
const prisma = new PrismaClient();

const attendanceRepo = new AttendanceRepository(prisma);
const attendanceService = new AttendanceService(attendanceRepo);
const attendanceController = new AttendanceController(attendanceService);

attendanceRoute.get('/', attendanceController.getAllAttendanceController);
attendanceRoute.get('/:attendanceId', attendanceController.getAttendanceController);
attendanceRoute.post('/', attendanceController.createAttendanceController);

export default attendanceRoute;
