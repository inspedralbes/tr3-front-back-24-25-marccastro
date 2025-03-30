import express from 'express';
const router = express.Router();
import { User } from '../models/index.js';
import Stats from "../models/stats.js";

router.post('/', async (req, res) => {
  console.log("HolaStats");
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