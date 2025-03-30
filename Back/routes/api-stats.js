import express from 'express';
const router = express.Router();
import Stats from "../models/stats.js";

router.post('/', async (req, res) => {
  console.log("HolaStats");
    try {
      const newStat = new Stats({
        kills: req.body.kills,
        rounds: req.body.rounds,
        totalTime: req.body.totalTime,
        wasModificatedMatch: req.body.wasModificated,
      });
  
      await newStat.save();
      res.status(201).json({ message: "success" });
    } catch (error) {
      res.status(500).json({ missatge: 'Error al crear el stat', error });
    }
});

export default router;