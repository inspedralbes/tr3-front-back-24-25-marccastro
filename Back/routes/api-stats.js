import express from 'express';
import Stats from "../models/stats.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Importar 'fileURLToPath' para convertir la URL a una ruta local

const __filename = fileURLToPath(import.meta.url);  // Obtener el nombre del archivo actual
const __dirname = path.dirname(__filename);  // Obtener el directorio del archivo actual

const statisticsDir = path.join('statistics');
const imagesDir = path.join(statisticsDir, 'images');

const router = express.Router();

router.post('/get-stats', async (req, res) => {
  console.log("Hola");
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email es requerido" });
    }

    // Convertir email a la misma estructura usada en el registro
    const emailFolder = email.replace(/[@.]/g, "_");
    const folderPath = path.join(imagesDir, emailFolder);

    // Verificar si la carpeta existe
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ message: "No se encontraron estadísticas para este usuario" });
    }

    // Leer los archivos de la carpeta
    const files = fs.readdirSync(folderPath);

    // Construir las URLs o rutas de los archivos
    const fileUrls = files.map(file => `/statistics/images/${emailFolder}/${file}`);

    return res.status(200).json({ message: "success", images: fileUrls });

  } catch (error) {
    console.error("Error al obtener las estadísticas:", error);
    return res.status(500).json({ message: "Error interno del servidor", error });
  }
});

router.post('/', async (req, res) => {
  try {
    const { kills, rounds, totalTime, wasModificated, email } = req.body;

    const newStat = new Stats({
      kills,
      rounds,
      totalTime,
      wasModificatedMatch: wasModificated,
      email
    });
  
    await newStat.save();
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ missatge: 'Error al crear el stat', error });
  }
});

export default router;