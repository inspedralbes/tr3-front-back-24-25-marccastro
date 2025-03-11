"use strict";
import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
import { sequelize } from "./models/index.js";
import apiusers from "./routes/api-users.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const server = createServer(app); // 🔥 Cambia "http.createServer" por "createServer"

// Configuración de rutas y vistas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Rutas
app.use("/api", apiusers);

// Sockets
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("updateCharacter", (update) => {
    console.log(update);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Sincronización de la base de datos
sequelize
  .sync()
  .then(() => {
    console.log("Base de datos sincronizada.");
    server.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error sincronizando la base de datos:", err));