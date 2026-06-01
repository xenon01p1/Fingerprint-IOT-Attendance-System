import { WebSocket, WebSocketServer } from "ws";

const WS_PORT = Number(process.env.WS_PORT || 8080);

const wss = new WebSocketServer({ port: WS_PORT });

function broadcast(data: unknown): void {
    const payload = JSON.stringify(data);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

console.log(`WebSocket server running on port ${WS_PORT}`);

export default broadcast;