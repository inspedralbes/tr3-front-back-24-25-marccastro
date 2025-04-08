// Importa módulos necesarios
import express from 'express';
import bcrypt from 'bcrypt'; // Para encriptar contraseñas
import { User } from '../models/index.js'; // Modelo de usuario desde Sequelize

const router = express.Router(); // Crea un enrutador de Express

// Ruta GET para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll(); // Obtiene todos los usuarios de la base de datos
        res.json(users); // Devuelve la lista de usuarios en formato JSON
    } catch (error) {
        res.status(500).send(error.message); // Error del servidor
    }
});

// Ruta POST para registrar un nuevo usuario (modo normal)
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verifica si ya existe un usuario con el mismo nombre
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.json({ message: "Ja existeix un usuari amb aquest nom" });
        }

        // Verifica si el correo electrónico ya está en uso
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.json({ message: "El correu electrònic ja està en ús" });
        }

        // Encripta la contraseña
        const hardPassword = await bcrypt.hash(password, 10);

        // Genera la ruta de carpeta asociada al email para estadísticas
        const emailFolder = `/statistics/images/${email.replace(/[@.]/g, "_")}`;

        // Crea el nuevo usuario en la base de datos
        await User.create({ username, email, password: hardPassword, statistics: emailFolder });

        return res.status(201).json({ message: "success", email: email });

    } catch (error) {
        console.error("Error en el registra:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
    }
});

// Ruta POST para registrar usuario administrador
router.post('/register/administraction', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Mismas validaciones que el registro normal
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

// Ruta POST para login de usuario (modo normal)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Busca el usuario por nombre
        const user = await User.findOne({ where: { username } });

        if(!user) return res.json({ message: "No existeix cap usuari amb aquest email." });

        // Compara contraseña ingresada con la guardada (encriptada)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.json({ message: "Usuari o contrasenya incorrecta" });
        }

        return res.status(201).json({ message: "success", email: user.email });

    } catch (error) {
        console.error("Error en Inicia sessió:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
    }
});

// Ruta POST para login de administración (usa email en lugar de username)
router.post('/login/administraction', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca usuario por email
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

// Ruta PUT para editar datos de usuario
router.put('/edit-user', async (req, res) => {
    const { id, username, email, password } = req.body;
  
    if (!id || !username || !email) {
      return res.status(400).json({ message: 'Faltan dades requerits' });
    }
  
    try {
      // Busca el usuario por su ID
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuari no trobat' });
      }
  
      // Actualiza nombre y email
      user.username = username;
      user.email = email;
  
      // Si se proporciona una nueva contraseña, la encripta
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      // Guarda los cambios en la base de datos
      await user.save();
      res.json({ message: 'Usuari actualitzat amb èxit' });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta DELETE para eliminar usuario por email
router.delete('/delete-user', async (req, res) => {
    try {
        const { email } = req.body;

        // Busca el usuario por email
        const user = await User.findOne({ where: { email }});

        // Elimina el usuario
        await user.destroy();

        res.status(200).json({ message: 'Usuari eliminat correctament' });
    } catch(error) {
        res.status(500).json({ message: "Error en eliminar l'usuari" });
    }
});

export default router; // Exporta el enrutador para ser usado en la app principal