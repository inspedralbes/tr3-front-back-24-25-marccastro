import express from 'express';
import fs from 'fs';
import path from 'path';
import { Item } from '../models/index.js';

const router = express.Router();

// Crear la carpeta 'uploads' si no existe
const uploadsDir = path.join('uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Carpeta "uploads" creada.');
}

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const items = await Item.findAll();
        if(!items) res.status(400).json("No hay items");
        res.json(items);
    } catch (error) {
        console.error("Error al obtener los items:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para crear un nuevo producto con imagen
router.post('/', async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
        }

        const imageFile = req.files.image;
        const uploadPath = path.join(uploadsDir, imageFile.name);

        // Mover el archivo a la carpeta de uploads
        imageFile.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al subir la imagen', error: err });
            }

            await Item.create({
                name,
                price,
                imagePath: `/uploads/${imageFile.name}`, // Guardamos la ruta en la BD
            });

            res.status(201).json({ message: 'Item creado' });
        });
    } catch (error) {
        console.error('Error en la subida de imagen:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;