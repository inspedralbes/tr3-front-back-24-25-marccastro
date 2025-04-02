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
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'DOWNLOAD'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));

const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/assetsbundle', express.static(path.join(__dirname, 'uploads/assetsbundle')));
app.use('/statistics/images', express.static(path.join(__dirname, 'statistics/images')));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connectat a MongoDB'))
.catch((err) => console.error('Error al connectar a MongoDB', err));

app.use("/api", apiusers);
app.use("/api/users", apiusers);
app.use("/api/skins", api_skins);
app.use("/api/purchases", api_purchases);
app.use("/api/stats", apistats);

const wss = new WebSocketServer({ server });

const clients = {};

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    if (Buffer.isBuffer(message)) {
      message = message.toString();
    }

    try {
      const data = JSON.parse(message);

      switch (data.event_backend) {
        case "register":
          clients[data.payload.id] = { socket: ws, tipo: data.payload.tipo };
          console.log(`Client registrat: ${data.payload.id} (${data.payload.tipo})`);
          break;

        case "send-to-unity":
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
          console.log("Esdeveniment desconegut", data);
      }
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
    }
  });

  ws.on("close", () => {
    for (const id in clients) {
      if (clients[id].socket === ws) {
        console.log(`Client ${id} desconectat`);
        delete clients[id];
        break;
      }
    }
  });
});

/*
app.get('/download/game', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'uploads/game/boxhead-game.zip'); // Ajusta la ruta
    res.download(filePath, 'boxhead-game.zip', (err) => {
      if (err) {
        console.error('Error al descargar:', err);
        res.status(500).send('Error al descargar el archivo');
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error interno del servidor');
  }
});
*/

sequelize
  .sync()
  .then(() => {
    console.log("Base de dades sincronitzada.");
    server.listen(PORT, () => {
      console.log(`Servidor funcionan en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error sincronitzant la base de dades:", err));