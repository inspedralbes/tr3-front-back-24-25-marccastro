import express from 'express';
import fs from 'fs';
import path from 'path';
import { Skin } from '../models/index.js';

const router = express.Router();

const uploadsDir = path.join('uploads');
const imagesDir = path.join(uploadsDir, 'images');
const assetBundleDir = path.join(uploadsDir, 'assetsbundle');

[uploadsDir, imagesDir, assetBundleDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Carpeta "${dir}" creada.`);
    }
});

router.get('/', async (req, res) => {
    try {
        const skins = await Skin.findAll();
        res.json({ skins });
    } catch (error) {
        console.error("Error en obtenir les skins:", error);
        res.status(500).json({ message: "Error intern del servidor" });
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

router.post('/new-skin', async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!req.files || !req.files.image || !req.files.assetBundle) {
            return res.status(400).json({ message: "No s'han penjat els fitxers requerits" });
        }
        
        const imagePath = await handleFileUpload(req.files.image, imagesDir);
        const assetBundlePath = await handleFileUpload(req.files.assetBundle, assetBundleDir);

        await Skin.create({
            name,
            price,
            imagePath,
            assetBundlePath
        });

        res.status(201).json({ message: 'Skin creat amb èxit' });
    } catch (error) {
        console.error('Error a la pujada de fitxers:s', error);
        res.status(500).json({ message: 'Error intern del servidor' });
    }
});

router.post('/edit-skin', async (req, res) => {
    try {
        const { id, name, price } = req.body;

        const skin = await Skin.findOne({ where: { id } });

        if(!skin) res.status(404).json({ message: 'Skin no trobat' });

        if (req.files && req.files.image && req.files.assetBundle) {
            const imagePath = await handleFileUpload(req.files.image, imagesDir);
            const assetBundlePath = await handleFileUpload(req.files.assetBundle, assetBundleDir);

            skin.name = name;
            skin.price = price;
            skin.imagePath = imagePath;
            skin.assetBundlePath = assetBundlePath;
        }
        else {
            skin.name = name;
            skin.price = price;
        }

        await skin.save();
        res.status(200).json({ message: 'Skin actualizado con éxito' });
    } catch (error) {
        console.error("Error en l'edició de la skin:", error);
        res.status(500).json({ message: 'Error intern del servidor' });
    }
});

export default router;