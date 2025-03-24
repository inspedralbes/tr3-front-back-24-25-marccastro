import express from 'express';
import { User, Item, PurchaseHistory } from '../models/index.js';

const router = express.Router();

router.post('/new-purchase', async (req, res) => {
    try {
        const { itemId, email } = req.body;

        console.log(email);

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.json({ message: "No hay ningun usuario con ese correo" });
        }
        
        const existingItem = await Item.findOne({ where: itemId });
        if (!existingItem) {
            return res.json({ message: "No hay ningun item con esa id" });
        }
        
        await PurchaseHistory.create({ user_id: existingUser.id, item_id: existingItem.id, price: existingItem.price });

        return res.status(201).json({ message: "success" });

    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;