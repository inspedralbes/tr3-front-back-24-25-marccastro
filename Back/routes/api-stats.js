import express from 'express';
const router = express.Router();
import Stats from "../models/stats.js";

router.post('/', async (req, res) => {
    try {
      const newStat = new Stats({
        kills: req.body.kills,
        rounds: req.body.rounds,
      });
  
      const statSave = await newStat.save();
      res.status(201).json(statSave);
    } catch (error) {
      res.status(500).json({ missatge: 'Error al crear el stat', error });
    }
});

export default router;