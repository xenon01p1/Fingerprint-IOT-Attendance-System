import express from "express";
import { PrismaClient } from "@prisma/client";
import LogDeviceController from "../controllers/logDeviceController.js";
import LogDeviceService from "../services/logDeviceService.js";
import LogDeviceRepository from "../repositories/logDeviceRepo.js";

const logDeviceRoute = express.Router();
const prisma = new PrismaClient();

const logDeviceRepo = new LogDeviceRepository(prisma);
const logDeviceService = new LogDeviceService(logDeviceRepo);
const logDeviceController = new LogDeviceController(logDeviceService);

logDeviceRoute.get('/', logDeviceController.getAllLogDeviceController);
logDeviceRoute.get('/:logDeviceId', logDeviceController.getLogDeviceController);
logDeviceRoute.post('/', logDeviceController.createLogDeviceController);

export default logDeviceRoute;
