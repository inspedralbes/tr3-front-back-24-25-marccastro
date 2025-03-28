import express from 'express';
import bcrypt from 'bcrypt';
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
        await User.create({ username, email, password: password, admin: 0 });

        return res.status(201).json({ message: "success" });

    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post('/register/administraction', async (req, res) => {
    try {
        console.log("Hola");
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(401).json({ message: "Ya existe un usuario con ese nombre" });
        }

        // Verificar si el email ya está registrado
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(401).json({ message: "El correo electrónico ya está en uso" });
        }

        const hardPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        await User.create({ username, email, password: hardPassword, admin: 1 });

        return res.status(201).json({ message: "success" });

    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.json({ message: "Usuario o contraseña incorrectos" });
        }

        return res.status(200).json({ message: "success", email: user.email });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post('/login/administraction', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }        

        return res.status(200).json({ message: "success" });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.delete('/delete-user', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email }});

        await user.destroy();

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch(error) {
        res.status(500).json({ message: 'Error al eliminar el usuario' })
        console.error("Error en eliminar el usuario");
    }
});


export default router;