"use strict";
import express from "express";
import path from "path";
import { createServer } from "http";
import { WebSocketServer } from "ws"; // WebSocket nativo en Node.js
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from "./models/index.js";
import apiusers from "./routes/api-users.js";
import apistats from "./routes/api-stats.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;
const corsOptions = {
  origin: 'http://localhost:7001',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));

const server = createServer(app); // 🔥 Cambia "http.createServer" por "createServer"

// Configuración de rutas y vistas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connectat a MongoDB'))
.catch((err) => console.error('Error al connectar a MongoDB', err));

// Rutas
app.use("/api", apiusers);
app.use("/api/register/administraction", apiusers);
app.use("/api/login/administraction", apiusers);
app.use('/api/stats', apistats);

// Servidor WebSocket
const wss = new WebSocketServer({ server });

const clients = [];

wss.on("connection", (ws) => {
  console.log("Un cliente se ha conectado");
  clients.push(ws);

  ws.on("message", (message) => {
    // Si el mensaje es un Buffer (datos binarios), convertirlo a cadena
    if (Buffer.isBuffer(message)) {
      message = message.toString();  // Convierte el Buffer a una cadena
    }

    try {
      const data = JSON.parse(message); // Convertimos el mensaje en JSON

      console.log("Datos recibidos:", data); // Debug

      // Aquí puedes hacer algo con los datos (ej: actualizar BD, broadcast a otros clientes)
      // Puedes enviar un mensaje al cliente Unity de la misma manera que a los clientes web
      clients.forEach(client => {
        client.send(JSON.stringify(data)); // Enviar a todos los clientes
      });
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
    }
  });

  ws.on("close", () => {
    console.log("Un cliente se ha desconectado");
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
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