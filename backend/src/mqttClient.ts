import mqtt, { MqttClient } from "mqtt";
import { PrismaClient } from "@prisma/client";
import broadcast from "./websocketClient.js";
import FingerprintRepository from "./repositories/fingerprintRepo.js";
import LogDeviceRepository from "./repositories/logDeviceRepo.js";
import AttendanceRepository from "./repositories/attendanceRepo.js";

const prisma = new PrismaClient();

const fingerprintRepo = new FingerprintRepository(prisma);
const logDeviceRepo = new LogDeviceRepository(prisma);
const attendanceRepo = new AttendanceRepository(prisma);

const MQTT_URL = process.env.MQTT_URL || "mqtt://broker.hivemq.com";
const DEVICE_ID = process.env.DEVICE_ID || "cmpuxj1xh0003uxg0hb5nkydn";

const client: MqttClient = mqtt.connect(MQTT_URL);

client.on("connect", (): void => {
    console.log("Connected to MQTT Broker");

    client.subscribe(["sofie/status", "sofie/iot/result"], (err) => {
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
    const rawMessage = message.toString().trim();

    console.log(`[${topic}]:`, rawMessage);

    if (topic === "sofie/status") {
        handleDeviceStatus({
            status: rawMessage,
            deviceId: DEVICE_ID
        });

        return;
    }

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

    if (topic === "sofie/iot/result") {
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
    const fingerprintIndex = Number(data.fingerprintIndex ?? data.template_id);
    const deviceId = String(data.deviceId ?? DEVICE_ID);

    if (!Number.isInteger(fingerprintIndex)) {
        throw new Error("Invalid fingerprintIndex from MQTT payload");
    }

    const fingerprint = await fingerprintRepo.findByDeviceAndIndex(
        deviceId,
        fingerprintIndex
    );

    if (!fingerprint) {
        broadcast({
            event: "fingerprint.register_success_without_pending_record",
            data: {
                fingerprintIndex,
                deviceId
            }
        });

        return;
    }

    await logDeviceRepo.createLogDevice({
        type: "register",
        fingerprintId: fingerprint.id
    });

    broadcast({
        event: "fingerprint.register_success",
        data: {
            fingerprintId: fingerprint.id,
            fingerprintIndex,
            employeeId: fingerprint.employeeId,
            deviceId
        }
    });
}

function getTodayRangeJakarta() {
    const now = new Date();

    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(now);

    const year = Number(parts.find(p => p.type === "year")?.value);
    const month = Number(parts.find(p => p.type === "month")?.value);
    const day = Number(parts.find(p => p.type === "day")?.value);

    // Jakarta is UTC+7
    const start = new Date(Date.UTC(year, month - 1, day, -7, 0, 0, 0));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return { start, end };
}

async function publishAttendanceFeedback(
    deviceId: string,
    payload: {
        status: "checkIn" | "checkOut" | "doneToday" | "unknown";
        message: string;
        fingerprintIndex?: number;
        employeeId?: string;
    }
): Promise<void> {
    const mqttPayload = JSON.stringify({
        type: "attendance_feedback",
        deviceId,
        ...payload
    });

    client.publish("sofie/fingerprint/feedback", mqttPayload);
}

async function handleAttendance(data: any): Promise<void> {
    const fingerprintIndex = Number(data.fingerprintIndex);
    const confidence = data.confidence ?? null;
    const deviceId = String(data.deviceId ?? DEVICE_ID);

    if (!Number.isInteger(fingerprintIndex)) {
        throw new Error("Invalid fingerprintIndex from MQTT payload");
    }

    const fingerprint = await prisma.fingerprint.findFirst({
        where: {
            fingerPrintIndex: fingerprintIndex,
            deviceId
        }
    });

    if (!fingerprint) {
        await publishAttendanceFeedback(deviceId, {
            status: "unknown",
            message: "Fingerprint not registered",
            fingerprintIndex
        });

        broadcast({
            event: "attendance.unknown_fingerprint",
            data: {
                fingerprintIndex,
                confidence,
                deviceId
            }
        });

        return;
    }

    const { start, end } = getTodayRangeJakarta();

    const todayLogs = await prisma.logDevice.findMany({
        where: {
            fingerprintId: fingerprint.id,
            type: {
                in: ["checkIn", "checkOut"]
            },
            createdAt: {
                gte: start,
                lt: end
            }
        },
        orderBy: {
            createdAt: "asc"
        }
    });

    const hasCheckIn = todayLogs.some(log => log.type === "checkIn");
    const hasCheckOut = todayLogs.some(log => log.type === "checkOut");

    if (!hasCheckIn) {
        const log = await logDeviceRepo.createLogDevice({
            type: "checkIn",
            fingerprintId: fingerprint.id
        });

        // Create Attendance record
        await attendanceRepo.createAttendance({
            type: "checkIn",
            employeeId: fingerprint.employeeId,
            deviceId
        });

        await publishAttendanceFeedback(deviceId, {
            status: "checkIn",
            message: "Check-in success",
            fingerprintIndex,
            employeeId: fingerprint.employeeId
        });

        broadcast({
            event: "attendance.check_in_success",
            data: {
                type: "checkIn",
                log,
                fingerprintId: fingerprint.id,
                fingerprintIndex,
                employeeId: fingerprint.employeeId,
                confidence,
                deviceId
            }
        });

        return;
    }

    if (!hasCheckOut) {
        const log = await logDeviceRepo.createLogDevice({
            type: "checkOut",
            fingerprintId: fingerprint.id
        });

        // Create Attendance record
        await attendanceRepo.createAttendance({
            type: "checkOut",
            employeeId: fingerprint.employeeId,
            deviceId
        });

        await publishAttendanceFeedback(deviceId, {
            status: "checkOut",
            message: "Check-out success",
            fingerprintIndex,
            employeeId: fingerprint.employeeId
        });

        broadcast({
            event: "attendance.check_out_success",
            data: {
                type: "checkOut",
                log,
                fingerprintId: fingerprint.id,
                fingerprintIndex,
                employeeId: fingerprint.employeeId,
                confidence,
                deviceId
            }
        });

        return;
    }

    await publishAttendanceFeedback(deviceId, {
        status: "doneToday",
        message: "You're done for today",
        fingerprintIndex,
        employeeId: fingerprint.employeeId
    });

    broadcast({
        event: "attendance.done_today",
        data: {
            message: "You're done for today",
            fingerprintId: fingerprint.id,
            fingerprintIndex,
            employeeId: fingerprint.employeeId,
            confidence,
            deviceId
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
        fingerprintId: fingerprint.id
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