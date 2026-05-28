import mqtt from "mqtt";
const client = mqtt.connect('mqtt://broker.hivemq.com');
client.on("connect", () => {
    console.log("Connected to MQTT Broker");
    client.subscribe("sofie/status");
    client.subscribe("sofie/iot/results");
});
client.on("message", (topic, message) => {
    const parsedMessage = message.toString();
    console.log(`[${topic}]:`, parsedMessage);
    // You can handle routing to your WebSocket broadcast here
    // Example: broadcast(topic, parsedMessage);
});
client.on("reconnect", () => {
    console.log("Reconnecting to MQTT...");
});
client.on("error", (err) => {
    console.error("MQTT error: ", err);
});
export default client;
