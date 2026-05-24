import mqtt from "mqtt";
import broadcast from "./websocketClient.js";

const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on("connect", (): void => {

});

client.on("message", async (topic: any, message: any): Promise<void> => {

});

client.on("reconnect", (): void => {

});

client.on("error", (err): void => {

});