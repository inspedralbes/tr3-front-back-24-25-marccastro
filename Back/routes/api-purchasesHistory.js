import express from 'express';
import { User, Skin, PurchaseHistory } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const purchases = await PurchaseHistory.findAll({
            include: [
                { model: Skin, attributes: ['name', 'imagePath'] },
                { model: User, attributes: ['username', 'email'] }
            ]
        });

        if (!purchases.length) {
            return res.status(404).json({ message: "No hay compras registradas." });
        }

        res.status(201).json(purchases);
    } catch (error) {
        console.error("Error obteniendo historial de compras:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


router.post('/new-purchase', async (req, res) => {
    try {
        const { skinId, email } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.json({ message: "No hi ha cap usuari amb aquest correu" });
        }
        
        const existingSkin = await Skin.findOne({ where: skinId });
        if (!existingSkin) {
            return res.json({ message: "No hi ha cap skin amb aquesta id" });
        }
        
        await PurchaseHistory.create({ user_id: existingUser.id, skin_id: existingSkin.id, price: existingSkin.price });

        return res.status(201).json({ message: "success" });

    } catch (error) {
        console.error("Error al registre:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
    }
});

router.post('/history', async (req, res) => {
    try {
        const { skinId, email } = req.body;

        const existingUser = await User.findOne({ where: { email } })

        if (!existingUser) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        const existingPurchase = await PurchaseHistory.findOne({ where: { skin_id: skinId, user_id: existingUser.id }});
        if(existingPurchase) {
            return res.status(201).json({ message: "success" });
        }
        else {
            return res.status(404).json({ message: "Compra no trobada per a aquest usuari i skin" });
        }
    }
    catch (error) {
        console.error("Error a la consulta:", error);
        res.status(500).json({ message: "Error intern del servidor" });
    }
});

export default router;