"use strict";
import express from "express";
import path from "path";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { sequelize } from "./models/index.js";
import apiusers from "./routes/api-users.js";
import api_skins from "./routes/api-skins.js";
import apistats from "./routes/api-stats.js";
import api_purchases from "./routes/api-purchasesHistory.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;
const corsOptions = {
  origin: 'http://localhost:7001',
  // origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));

const server = createServer(app); // 🔥 Cambia "http.createServer" por "createServer"

// Configuración de rutas y vistas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/assetsbundle', express.static(path.join(__dirname, 'uploads/assetsbundle')));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connectat a MongoDB'))
.catch((err) => console.error('Error al connectar a MongoDB', err));

// Rutas
app.use("/api", apiusers);
app.use("/api/users", apiusers);
app.use("/api/skins", api_skins);
app.use("/api/purchases", api_purchases);
app.use("/api/stats", apistats);

// Servidor WebSocket
const wss = new WebSocketServer({ server });

const clients = {};

wss.on("connection", (ws) => {
  console.log("Un cliente se ha conectado");

  // Al recibir un mensaje del cliente
  ws.on("message", (message) => {
    if (Buffer.isBuffer(message)) {
      message = message.toString();  // Convertir Buffer a string
    }

    try {
      const data = JSON.parse(message);
      console.log("Datos recibidos:", data);

      switch (data.event_backend) {
        case "register":
          clients[data.payload.id] = { socket: ws, tipo: data.payload.tipo };
          console.log(`Cliente registrado: ${data.payload.id} (${data.payload.tipo})`);
          break;

        case "send-to-unity":
          if (!data.payload) {
            console.error("Error: El mensaje de send-to-unity no tiene payload");
            return;
          }

          for(const id in clients) {
            if (clients[id].tipo === "unity") {
              clients[id].socket.send(JSON.stringify({
                event_unity: data.event_unity,
                payload: data.payload
              }));
            }
            else console.log("No esta");
          }
          break;
        
        default:
          console.log("Evento desconocido", data);
      }
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
    }
  });

  // Cuando un cliente se desconecta
  ws.on("close", () => {
    for (const id in clients) {
      if (clients[id].socket === ws) {
        console.log(`Cliente ${id} desconectado`);
        delete clients[id];
        break;
      }
    }
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