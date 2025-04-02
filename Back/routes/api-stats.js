import express from 'express';
import Stats from "../models/stats.js";
import fs from 'fs';
import path from 'path';

const statisticsDir = path.join('statistics');
const imagesDir = path.join(statisticsDir, 'images');

const router = express.Router();

router.post('/get-stats', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email es requerit" });
    }

    const emailFolder = email.replace(/[@.]/g, "_");
    const folderPath = path.join(imagesDir, emailFolder);

    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ message: "No s'han trobat estadístiques per a aquest usuari" });
    }

    const files = fs.readdirSync(folderPath);

    const fileUrls = files.map(file => `/statistics/images/${emailFolder}/${file}`);

    return res.status(200).json({ message: "success", images: fileUrls });

  } catch (error) {
    console.error("Error en obtenir les estadístiques:", error);
    return res.status(500).json({ message: "Error intern del servidor", error });
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
    res.status(500).json({ missatge: "Error en crear l'estadística", error });
  }
});

export default router;