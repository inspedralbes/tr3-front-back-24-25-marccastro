"use strict";
// Importación de módulos necesarios
import express from "express";
import path from "path";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';

// Importación de rutas y modelos
import { sequelize } from "./models/index.js";
import apiusers from "./routes/api-users.js";
import api_skins from "./routes/api-skins.js";
import apistats from "./routes/api-stats.js";
import api_purchases from "./routes/api-purchasesHistory.js";

// Carga variables de entorno desde .env
dotenv.config();

// Inicialización de la app de Express
const app = express();
const PORT = process.env.PORT || 3002;

// Configuración de CORS (controla quién puede acceder al servidor)
const corsOptions = {
  origin: 'http://localhost:7001',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Crea servidor HTTP
const server = createServer(app);

// Obtiene rutas de archivos actuales
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para permitir subida de archivos
app.use(fileUpload());

// Sirve archivos estáticos desde varias carpetas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/assetsbundle', express.static(path.join(__dirname, 'uploads/assetsbundle')));
app.use('/statistics/images', express.static(path.join(__dirname, 'statistics/images')));

// Middleware para parsear JSON en peticiones
app.use(express.json());

// Conexión a MongoDB usando Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connectat a MongoDB'))
.catch((err) => console.error('Error al connectar a MongoDB', err));

// Uso de rutas definidas para diferentes partes del API
app.use("/api/users", apiusers);        // Rutas de usuarios
app.use("/api/skins", api_skins);       // Rutas para skins
app.use("/api/purchases", api_purchases); // Rutas de historial de compras
app.use("/api/stats", apistats);        // Rutas de estadísticas

// Inicializa WebSocket Server sobre el servidor HTTP
const wss = new WebSocketServer({ server });

// Objeto para guardar los clientes conectados vía WebSocket
const clients = {};

// Evento cuando un cliente se conecta por WebSocket
wss.on("connection", (ws) => {
  // Evento cuando el cliente envía un mensaje
  ws.on("message", (message) => {
    // Si el mensaje viene como Buffer, convertir a string
    if (Buffer.isBuffer(message)) {
      message = message.toString();
    }

    try {
      // Intenta parsear el mensaje como JSON
      const data = JSON.parse(message);

      switch (data.event_backend) {
        case "register":
          // Registra el cliente en el objeto clients con su ID y tipo
          clients[data.payload.id] = { socket: ws, tipo: data.payload.tipo };
          console.log(`Client registrat: ${data.payload.id} (${data.payload.tipo})`);
          break;

        case "send-to-unity":
          // Envía un mensaje a todos los clientes tipo "unity"
          if (!data.payload) {
            console.error("Error: El missatge de send-to-unity no té payload");
            return;
          }

          for(const id in clients) {
            console.log(clients[id].tipo);
            if (clients[id].tipo === "unity") {
              clients[id].socket.send(JSON.stringify({
                event_unity: data.event_unity,
                payload: data.payload
              }));
            }
          }
          break;

        default:
          // Evento no reconocido
          console.log("Esdeveniment desconegut", data);
      }
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
    }
  });

  // Evento cuando el cliente se desconecta
  ws.on("close", () => {
    // Elimina el cliente del objeto clients
    for (const id in clients) {
      if (clients[id].socket === ws) {
        console.log(`Client ${id} desconectat`);
        delete clients[id];
        break;
      }
    }
  });
});

// Sincroniza Sequelize (base de datos relacional) y arranca el servidor
sequelize
  .sync()
  .then(() => {
    console.log("Base de dades sincronitzada.");
    server.listen(PORT, () => {
      console.log(`Servidor funcionan en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error sincronitzant la base de dades:", err));
