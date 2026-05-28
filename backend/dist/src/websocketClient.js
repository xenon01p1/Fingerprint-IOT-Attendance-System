import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}
export default broadcast;
