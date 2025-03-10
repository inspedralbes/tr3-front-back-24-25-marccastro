import express from 'express';
import { User } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        await User.create({ username, email, password, level: 0 });
        res.status(201).json("Nuevo usuario añadido");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: { username: username, password: password }
        });
        res.status(201).json("Success");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router;