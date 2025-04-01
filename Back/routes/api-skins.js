import express from 'express';
import fs from 'fs';
import path from 'path';
import { Skin } from '../models/index.js';

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
        const skins = await Skin.findAll();
        res.json({ skins });
    } catch (error) {
        console.error("Error al obtener las skins:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

const handleFileUpload = (file, directory) => {
    return new Promise((resolve, reject) => {
        const uploadPath = path.join(directory, file.name);
        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(`/${directory}/${file.name}`);
        });
    });
};

// Ruta para crear un nuevo skin con imagen y asset bundler
router.post('/new-skin', async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!req.files || !req.files.image || !req.files.assetBundle) {
            return res.status(400).json({ message: 'No se han subido los archivos requeridos' });
        }
        
        const imagePath = await handleFileUpload(req.files.image, imagesDir);
        const assetBundlePath = await handleFileUpload(req.files.assetBundle, assetBundleDir);

        await Skin.create({
            name,
            price,
            imagePath,
            assetBundlePath
        });

        res.status(201).json({ message: 'Skin creado con éxito' });
    } catch (error) {
        console.error('Error en la subida de archivos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/edit-skin', async (req, res) => {
    try {
        const { id, name, price } = req.body;

        const skin = await Skin.findOne({ where: { id } });

        if(!skin) res.status(404).json({ message: 'Skin no encontrado' });

        // Si se proporcionan los archivos, los subimos
        if (req.files && req.files.image && req.files.assetBundle) {
            const imagePath = await handleFileUpload(req.files.image, imagesDir);
            const assetBundlePath = await handleFileUpload(req.files.assetBundle, assetBundleDir);

            // Actualizar los campos con los nuevos valores
            skin.name = name;
            skin.price = price;
            skin.imagePath = imagePath;
            skin.assetBundlePath = assetBundlePath;
        }
        // Si solo se proporciona el nombre y precio
        else {
            // Solo actualizamos nombre y precio, no modificamos los archivos
            skin.name = name;
            skin.price = price;
        }

        // Guardar los cambios en la base de datos
        await skin.save();
        res.status(200).json({ message: 'Skin actualizado con éxito' });
    } catch (error) {
        console.error('Error en la edicion de la skin:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;