import express from "express";
import { PrismaClient } from "@prisma/client";

import FingerprintController from "../controllers/fingerprintController.js";
import FingerprintService from "../services/fingerprintService.js";
import FingerprintRepository from "../repositories/fingerprintRepo.js";
import mqttClient from "../mqttClient.js";

const fingerprintRoute = express.Router();
const prisma = new PrismaClient();
const mqttClientInstance = mqttClient;

// ======================
// DEPENDENCY INJECTION
// ======================

const fingerprintRepo = new FingerprintRepository(prisma);
const fingerprintService = new FingerprintService(mqttClientInstance, fingerprintRepo);
const fingerprintController = new FingerprintController(fingerprintService);

// ======================
// ROUTES
// ======================

fingerprintRoute.post(
    "/register-fingerprint",
    fingerprintController.fingerprintRegister
);

fingerprintRoute.delete(
    "/delete-fingerprint/:id",
    fingerprintController.deleteFingerprint
);

fingerprintRoute.get(
    "/available-indexes/:deviceId",
    fingerprintController.getAvailableIndexes
);

export default fingerprintRoute;