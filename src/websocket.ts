import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer;

export function initWebSocket(server: any) {
  wss = new WebSocketServer({ server, path: "/ws" });


  wss.on("connection", (ws: WebSocket) => {
    console.log("🔗 Client WebSocket connecté");
  
    ws.on("close", () => console.log("❌ Client WebSocket déconnecté"));
    ws.on("error", (err) => console.error("❌ WS Client Error:", err));
  });

  console.log("🟢 WebSocket initialisé");
}

export function notifyPartsUpdated() {
  if (!wss) return;

  const msg = JSON.stringify({ type: "PARTS_UPDATED" });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });

  console.log("📢 Notification envoyée : PARTS_UPDATED");
}
export function notifyMovementsUpdated() {
  if (!wss) return;

  const message = JSON.stringify({ type: "MOVEMENTS_UPDATED" });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  console.log("📢 Notification envoyée : MOVEMENTS_UPDATED");
}

export function notifylogin(){
  if(!wss) return;
  const message = JSON.stringify({type:"USER_LOGUED"})
  wss.clients.forEach(client=>{
    if(client.readyState===WebSocket.OPEN) client.send(message)

  })
  console.log("📢 Notification envoyée : USER_LOGUED")
}
