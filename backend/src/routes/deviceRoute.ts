import express from "express";
import { PrismaClient } from "@prisma/client";
import DeviceController from "../controllers/deviceController.js";
import DeviceService from "../services/deviceService.js";
import DeviceRepository from "../repositories/deviceRepo.js";

const deviceRoute = express.Router();
const prisma = new PrismaClient();

const deviceRepo = new DeviceRepository(prisma);
const deviceService = new DeviceService(deviceRepo);
const deviceController = new DeviceController(deviceService);

deviceRoute.get('/', deviceController.getAllDevicesController);
deviceRoute.post('/', deviceController.createDeviceController);
deviceRoute.put('/:deviceId', deviceController.updateDeviceController);
deviceRoute.delete('/:deviceId', deviceController.deleteDeviceController);

export default deviceRoute;