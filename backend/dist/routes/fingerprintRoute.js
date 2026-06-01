import express from "express";
const fingerprintRoute = express.Router();
// ======================
// DEPENDENCY INJECTION
// ======================
// const fingerprintService =
//     new FingerprintService(mqttClient, fingerprintRepository);
// const fingerprintController =
//     new FingerprintController(fingerprintService);
// // ======================
// // ROUTES
// // ======================
// fingerprintRoute.post(
//     "/register-fingerprint",
//     fingerprintController.fingerprintRegister
// );
// fingerprintRoute.delete(
//     "/delete-fingerprint",
//     fingerprintController.deleteFingerprint
// );
export default fingerprintRoute;
