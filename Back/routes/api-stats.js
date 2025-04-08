// Importa módulos necesarios
import express from 'express';
import Stats from "../models/stats.js"; // Modelo de estadísticas
import fs from 'fs'; // Para acceder al sistema de archivos
import path from 'path'; // Para manipular rutas

// Define las rutas de las carpetas de estadísticas e imágenes
const statisticsDir = path.join('statistics');
const imagesDir = path.join(statisticsDir, 'images');

const router = express.Router(); // Crea un enrutador de Express

// Ruta POST para obtener las estadísticas (imágenes) de un usuario
router.post('/get-stats', async (req, res) => {
  try {
    const { email } = req.body;

    // Si no se proporciona email, devuelve error
    if (!email) {
      return res.status(400).json({ message: "Email es requerit" });
    }

    // Reemplaza caracteres no válidos para formar el nombre de la carpeta del usuario
    const emailFolder = email.replace(/[@.]/g, "_");
    const folderPath = path.join(imagesDir, emailFolder); // Ruta completa a la carpeta

    // Verifica si la carpeta existe
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ message: "No s'han trobat estadístiques per a aquest usuari" });
    }

    // Lee los archivos de la carpeta
    const files = fs.readdirSync(folderPath);

    // Crea una lista con las URLs de acceso a las imágenes
    const fileUrls = files.map(file => `/statistics/images/${emailFolder}/${file}`);

    return res.status(200).json({ message: "success", images: fileUrls });

  } catch (error) {
    console.error("Error en obtenir les estadístiques:", error);
    return res.status(500).json({ message: "Error intern del servidor", error });
  }
});

// Ruta POST para guardar una nueva estadística en la base de datos
router.post('/', async (req, res) => {
  try {
    // Extrae datos del cuerpo de la petición
    const { kills, rounds, totalTime, wasModificated, email } = req.body;

    // Crea una nueva instancia del modelo Stats
    const newStat = new Stats({
      kills,
      rounds,
      totalTime,
      wasModificatedMatch: wasModificated, // Guarda si la partida fue modificada
      email
    });
  
    await newStat.save(); // Guarda en la base de datos
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ missatge: "Error en crear l'estadística", error });
  }
});

export default router; // Exporta el enrutador