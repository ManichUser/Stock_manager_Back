import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";         // ⭐ important
import { initWebSocket } from "./websocket"; // ⭐ fonction WS

import authRoutes from "./routes/auth.routes";
import brandRoutes from "./routes/brands.routes";
import partRoutes from "./routes/parts.routes";
import movementRoutes from "./routes/movements.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/brands", brandRoutes);
app.use("/parts", partRoutes);
app.use("/movements", movementRoutes);

//  Création obligatoire pour WS
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

//  Initialisation WebSocket
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
