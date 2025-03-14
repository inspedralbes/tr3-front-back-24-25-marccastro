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

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.json({ message: "Ya existe un usuario con ese nombre" });
        }

        // Verificar si el email ya está registrado
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.json({ message: "El correo electrónico ya está en uso" });
        }

        // Crear el usuario
        await User.create({ username, email, password: password, level: 0 });

        return res.status(201).json({ message: "Success" });

    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log(username, password);

        const user = await User.findOne({ where: { username } });

        user ? console.log("Existe") : console.log("No existe");

        if (!user || user.password !== password) {
            return res.json({ message: "Usuario o contraseña incorrectos" });
        }        

        return res.status(200).json({ message: "success" });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;