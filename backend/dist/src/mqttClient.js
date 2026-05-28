import mqtt from "mqtt";
const client = mqtt.connect('mqtt://broker.hivemq.com');
client.on("connect", () => {
});
client.on("message", async (topic, message) => {
});
client.on("reconnect", () => {
});
client.on("error", (err) => {
});
