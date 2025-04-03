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

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.json({ message: "Ja existeix un usuari amb aquest nom" });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.json({ message: "El correu electrònic ja està en ús" });
        }

        const hardPassword = await bcrypt.hash(password, 10);
        const emailFolder = `/statistics/images/${email.replace(/[@.]/g, "_")}`;

        await User.create({ username, email, password: hardPassword, statistics: emailFolder });

        return res.status(201).json({ message: "success", email: email });

    } catch (error) {
        console.error("Error en el registra:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
    }
});

router.post('/register/administraction', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(401).json({ message: "Ja existeix un usuari amb aquest nom" });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(401).json({ message: "El correu electrònic ja està en ús" });
        }

        const hardPassword = await bcrypt.hash(password, 10);
        const emailFolder = `/statistics/images/${email.replace(/[@.]/g, "_")}`;

        await User.create({ username, email, password: hardPassword, statistics: emailFolder });

        return res.status(201).json({ message: "success" });

    } catch (error) {
        console.error("Error en el registra:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if(!user) return res.json({ message: "No existeix cap usuari amb aquest email." });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.json({ message: "Usuari o contrasenya incorrecta" });
        }

        return res.status(201).json({ message: "success", email: user.email });

    } catch (error) {
        console.error("Error en Inicia sessió:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
    }
});

router.post('/login/administraction', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if(!user) return res.status(401).json({ message: "No existeix cap usuari amb aquest email." });
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Usuari o contrasenya incorrectes" });
        }
  
        return res.status(201).json({ message: "success" });
    } catch (error) {
        console.error("Error en Inicia sessió:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
    }
});

router.put('/edit-user', async (req, res) => {
    const { id, username, email, password } = req.body;
  
    if (!id || !username || !email) {
      return res.status(400).json({ message: 'Faltan dades requerits' });
    }
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuari no trobat' });
      }
  
      user.username = username;
      user.email = email;
  
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      await user.save();
      res.json({ message: 'Usuari actualitzat amb èxit' });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });

router.delete('/delete-user', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email }});

        await user.destroy();

        res.status(200).json({ message: 'Usuari eliminat correctament' });
    } catch(error) {
        res.status(500).json({ message: "Error en eliminar l'usuari" });
    }
});


export default router;