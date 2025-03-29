import express from 'express';
import { User, Skin, PurchaseHistory } from '../models/index.js';

const router = express.Router();

router.post('/new-purchase', async (req, res) => {
    try {
        const { skinId, email } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.json({ message: "No hay ningun usuario con ese correo" });
        }
        
        const existingSkin = await Skin.findOne({ where: skinId });
        if (!existingSkin) {
            return res.json({ message: "No hay ningun skin con esa id" });
        }
        
        await PurchaseHistory.create({ user_id: existingUser.id, skin_id: existingSkin.id, price: existingSkin.price });

        return res.status(201).json({ message: "success" });

    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post('/history', async (req, res) => {
    try {
        const { skinId, email } = req.body;

        const existingUser = await User.findOne({ where: { email } })

        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const existingPurchase = await PurchaseHistory.findOne({ where: { skin_id: skinId, user_id: existingUser.id }});
        if(existingPurchase) {
            return res.status(201).json({ message: "success" });
        }
        else {
            return res.status(404).json({ message: "Compra no encontrada para este usuario y skin" });
        }
    }
    catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;