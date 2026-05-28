import mqtt, { MqttClient } from "mqtt";
import broadcast from "./websocketClient.js"; 

const client: MqttClient = mqtt.connect('mqtt://broker.hivemq.com');

client.on("connect", (): void => {
    console.log("Connected to MQTT Broker");
    client.subscribe("sofie/status");
    client.subscribe("sofie/iot/results");
});

client.on("message", (topic: string, message: Buffer): void => {
    const parsedMessage = message.toString();
    console.log(`[${topic}]:`, parsedMessage);

    // You can handle routing to your WebSocket broadcast here
    // Example: broadcast(topic, parsedMessage);
});

client.on("reconnect", (): void => {
    console.log("Reconnecting to MQTT...");
});

client.on("error", (err: Error): void => {
    console.error("MQTT error: ", err);
});

export default client;