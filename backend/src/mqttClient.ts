import mqtt, { MqttClient } from "mqtt";
import broadcast from "./websocketClient.js"; 

const client: MqttClient = mqtt.connect('mqtt://broker.hivemq.com');

client.on("connect", (): void => {
    console.log("Connected to MQTT Broker");
    client.subscribe("sofie/status");
    client.subscribe("sofie/iot/results");
});

client.on("message", (topic: string, message: Buffer): void => {
    const rawMessage = message.toString();

    console.log(`[${topic}]:`, rawMessage);

    try {
        const data = JSON.parse(rawMessage);

        if (topic === "sofie/iot/results") {
            if (data.type === "register_success") {
                console.log("Fingerprint registered successfully");
                console.log("Fingerprint index:", data.fingerprintIndex);

                broadcast({
                    event: "register_success",
                    fingerprintIndex: data.fingerprintIndex
                });
            }
        }

        if (topic === "sofie/status") {
            broadcast({
                event: "device_status",
                data
            });
        }

    } catch (error) {
        console.error("Invalid JSON message:", rawMessage);
    }
});

client.on("reconnect", (): void => {
    console.log("Reconnecting to MQTT...");
});

client.on("error", (err: Error): void => {
    console.error("MQTT error: ", err);
});

export default client;