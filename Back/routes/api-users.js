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

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        await User.create({ username, email, password, level: 0 });
        res.json({ message: "success" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log(username, password);

        const user = await User.findOne({ where: { username } });

        console.log(user);

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }        

        return res.status(200).json({ message: "success" });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;