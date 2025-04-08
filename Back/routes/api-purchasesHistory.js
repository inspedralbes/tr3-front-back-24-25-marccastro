// Importa Express y los modelos necesarios desde la base de datos
import express from 'express';
import { User, Skin, PurchaseHistory } from '../models/index.js';

const router = express.Router(); // Crea un nuevo router de Express

// Ruta GET que obtiene el historial completo de compras
router.get('/', async (req, res) => {
    try {
        const purchases = await PurchaseHistory.findAll({
            include: [
                { model: Skin, attributes: ['name', 'imagePath'] }, // Incluye info de la skin
                { model: User, attributes: ['username', 'email'] }  // Incluye info del usuario
            ]
        });

        // Si no hay compras, devuelve mensaje
        if (!purchases.length) {
            return res.status(404).json({ message: "No hay compras registradas." });
        }

        // Devuelve el historial completo
        res.status(201).json(purchases);
    } catch (error) {
        console.error("Error obteniendo historial de compras:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


// Ruta POST para registrar una nueva compra
router.post('/new-purchase', async (req, res) => {
    try {
        const { skinId, email } = req.body;

        // Verifica que el usuario exista
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.json({ message: "No hi ha cap usuari amb aquest correu" });
        }

        // Verifica que la skin exista
        const existingSkin = await Skin.findOne({ where: skinId });
        if (!existingSkin) {
            return res.json({ message: "No hi ha cap skin amb aquesta id" });
        }

        // Crea una nueva entrada en el historial de compras
        await PurchaseHistory.create({ 
            user_id: existingUser.id, 
            skin_id: existingSkin.id, 
            price: existingSkin.price 
        });

        return res.status(201).json({ message: "success" });

    } catch (error) {
        console.error("Error al registre:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
    }
});


// Ruta POST para verificar si un usuario ya ha comprado una skin específica
router.post('/history', async (req, res) => {
    try {
        const { skinId, email } = req.body;

        // Busca al usuario
        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        // Busca si hay una compra registrada con ese user_id y skin_id
        const existingPurchase = await PurchaseHistory.findOne({ 
            where: { skin_id: skinId, user_id: existingUser.id }
        });

        // Si existe, devuelve éxito; si no, indica que no se encontró
        if (existingPurchase) {
            return res.status(201).json({ message: "success" });
        } else {
            return res.status(404).json({ message: "Compra no trobada per a aquest usuari i skin" });
        }
    }
    catch (error) {
        console.error("Error a la consulta:", error);
        res.status(500).json({ message: "Error intern del servidor" });
    }
});

export default router; // Exporta el router para ser usado por la app