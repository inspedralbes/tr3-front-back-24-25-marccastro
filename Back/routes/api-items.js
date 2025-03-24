import express from 'express';
import fs from 'fs';
import path from 'path';
import { Item } from '../models/index.js';

const router = express.Router();

// Definir carpetas para imágenes y asset bundlers
const uploadsDir = path.join('uploads');
const imagesDir = path.join(uploadsDir, 'images');
const assetBundleDir = path.join(uploadsDir, 'assetsbundle');

// Crear las carpetas si no existen
[uploadsDir, imagesDir, assetBundleDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Carpeta "${dir}" creada.`);
    }
});

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const items = await Item.findAll();
        res.json({ items });
    } catch (error) {
        console.error("Error al obtener los items:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para crear un nuevo item con imagen y asset bundler
router.post('/new-item', async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!req.files || !req.files.image || !req.files.assetBundler) {
            return res.status(400).json({ message: 'No se han subido los archivos requeridos' });
        }

        const imageFile = req.files.image;
        const assetBundlerFile = req.files.assetBundler;

        // Rutas de guardado
        const imagePath = `/uploads/images/${imageFile.name}`;
        const assetBundlePath = `/uploads/assetsbundle/${assetBundlerFile.name}`;

        // Definir rutas de subida
        const imageUploadPath = path.join(imagesDir, imageFile.name);
        const assetBundleUploadPath = path.join(assetBundleDir, assetBundlerFile.name);

        // Mover archivos a sus carpetas correspondientes
        imageFile.mv(imageUploadPath, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al subir la imagen', error: err });
            }

            assetBundlerFile.mv(assetBundleUploadPath, async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al subir el asset bundle', error: err });
                }

                // Guardar el nuevo item en la base de datos
                await Item.create({
                    name,
                    price,
                    imagePath,
                    assetBundlePath
                });

                res.status(201).json({ message: 'Item creado con éxito' });
            });
        });
    } catch (error) {
        console.error('Error en la subida de archivos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;