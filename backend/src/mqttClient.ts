import mqtt, { MqttClient } from "mqtt";
import { PrismaClient } from "@prisma/client";
import broadcast from "./websocketClient.js";
import FingerprintRepository from "./repositories/fingerprintRepo.js";
import LogDeviceRepository from "./repositories/logDeviceRepo.js";

const prisma = new PrismaClient();

const fingerprintRepo = new FingerprintRepository(prisma);
const logDeviceRepo = new LogDeviceRepository(prisma);

const MQTT_URL = process.env.MQTT_URL || "mqtt://broker.hivemq.com";
const DEVICE_ID = process.env.DEVICE_ID || "cmpuxj1xh0003uxg0hb5nkydn";

const client: MqttClient = mqtt.connect(MQTT_URL);

client.on("connect", (): void => {
    console.log("Connected to MQTT Broker");

    client.subscribe(["sofie/status", "sofie/iot/results"], (err) => {
        if (err) {
            console.error("MQTT subscribe error:", err);
            return;
        }

        console.log("Subscribed to MQTT topics");
    });
});

client.on("message", (topic: string, message: Buffer): void => {
    void handleMqttMessage(topic, message).catch((error) => {
        console.error("Failed to handle MQTT message:", error);
    });
});

async function handleMqttMessage(topic: string, message: Buffer): Promise<void> {
    const rawMessage = message.toString();

    console.log(`[${topic}]:`, rawMessage);

    let data: any;

    try {
        data = JSON.parse(rawMessage);
    } catch {
        console.error("Invalid JSON message:", rawMessage);

        broadcast({
            event: "mqtt.invalid_json",
            topic,
            rawMessage
        });

        return;
    }

    if (topic === "sofie/status") {
        handleDeviceStatus(data);
        return;
    }

    if (topic === "sofie/iot/results") {
        await handleIotResult(data);
        return;
    }

    console.log("Unhandled MQTT topic:", topic);
}

function handleDeviceStatus(data: any): void {
    broadcast({
        event: "device.status",
        data
    });
}

async function handleIotResult(data: any): Promise<void> {
    switch (data.type) {
        case "register_success":
            await handleRegisterSuccess(data);
            break;

        case "attendance":
            await handleAttendance(data);
            break;

        case "delete_success":
            await handleDeleteSuccess(data);
            break;

        default:
            console.log("Unhandled IoT result type:", data.type);

            broadcast({
                event: "iot.unhandled",
                data
            });

            break;
    }
}

async function handleRegisterSuccess(data: any): Promise<void> {
    const fingerprintIndex = Number(data.fingerprintIndex);

    if (!Number.isInteger(fingerprintIndex)) {
        throw new Error("Invalid fingerprintIndex from MQTT payload");
    }

    const fingerprint = await fingerprintRepo.createFingerprint({
        fingerPrintIndex: fingerprintIndex,
        employeeId: "unassigned",
        deviceId: DEVICE_ID
    });

    if (!fingerprint) {
        throw new Error("Failed to create fingerprint data");
    }

    await logDeviceRepo.createLogDevice({
        type: "register",
        fingerprintId: fingerprint.id,
        deviceId: DEVICE_ID
    });

    broadcast({
        event: "fingerprint.register_success",
        data: {
            fingerprintId: fingerprint.id,
            fingerprintIndex,
            deviceId: DEVICE_ID
        }
    });
}

async function handleAttendance(data: any): Promise<void> {
    const fingerprintIndex = Number(data.fingerprintIndex);
    const confidence = data.confidence ?? null;

    if (!Number.isInteger(fingerprintIndex)) {
        throw new Error("Invalid fingerprintIndex from MQTT payload");
    }

    /**
     * Important:
     * You should find the fingerprint row by deviceId + fingerPrintIndex.
     * Your current FingerprintRepository does not have that method yet.
     */
    const fingerprint = await prisma.fingerprint.findFirst({
        where: {
            fingerPrintIndex: fingerprintIndex,
            deviceId: DEVICE_ID
        }
    });

    if (!fingerprint) {
        broadcast({
            event: "attendance.unknown_fingerprint",
            data: {
                fingerprintIndex,
                confidence,
                deviceId: DEVICE_ID
            }
        });

        return;
    }

    const logType = data.attendanceType === "checkOut" ? "checkOut" : "checkIn";

    await logDeviceRepo.createLogDevice({
        type: logType,
        fingerprintId: fingerprint.id,
        deviceId: DEVICE_ID
    });

    broadcast({
        event: "attendance.success",
        data: {
            type: logType,
            fingerprintId: fingerprint.id,
            fingerprintIndex,
            confidence,
            deviceId: DEVICE_ID
        }
    });
}

async function handleDeleteSuccess(data: any): Promise<void> {
    const fingerprintIndex = Number(data.fingerprintIndex);

    if (!Number.isInteger(fingerprintIndex)) {
        throw new Error("Invalid fingerprintIndex from MQTT payload");
    }

    const fingerprint = await prisma.fingerprint.findFirst({
        where: {
            fingerPrintIndex: fingerprintIndex,
            deviceId: DEVICE_ID
        }
    });

    if (!fingerprint) {
        broadcast({
            event: "fingerprint.delete_unknown",
            data: {
                fingerprintIndex,
                deviceId: DEVICE_ID
            }
        });

        return;
    }

    await logDeviceRepo.createLogDevice({
        type: "delete",
        fingerprintId: fingerprint.id,
        deviceId: DEVICE_ID
    });

    await fingerprintRepo.deleteFingerprint(fingerprint.id);

    broadcast({
        event: "fingerprint.delete_success",
        data: {
            fingerprintId: fingerprint.id,
            fingerprintIndex,
            deviceId: DEVICE_ID
        }
    });
}

client.on("reconnect", (): void => {
    console.log("Reconnecting to MQTT...");
});

client.on("error", (err: Error): void => {
    console.error("MQTT error:", err);
});

export default client;