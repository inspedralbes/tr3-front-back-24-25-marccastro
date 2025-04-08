// Importa express, fs (file system), path y el modelo Skin
import express from 'express';
import fs from 'fs';
import path from 'path';
import { Skin } from '../models/index.js';

const router = express.Router(); // Crea un router de Express

// Define rutas para las carpetas de subida de archivos
const uploadsDir = path.join('uploads');
const imagesDir = path.join(uploadsDir, 'images');
const assetBundleDir = path.join(uploadsDir, 'assetsbundle');

// Asegura que las carpetas necesarias existan, si no las crea
[uploadsDir, imagesDir, assetBundleDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Carpeta "${dir}" creada.`);
    }
});

// Ruta GET que devuelve todas las skins disponibles en la base de datos
router.get('/', async (req, res) => {
    try {
        const skins = await Skin.findAll(); // Busca todas las skins
        res.json({ skins }); // Responde con las skins encontradas
    } catch (error) {
        console.error("Error en obtenir les skins:", error);
        res.status(500).json({ message: "Error intern del servidor" });
    }
});

// Función auxiliar para subir archivos a una carpeta especificada
const handleFileUpload = (file, directory) => {
    return new Promise((resolve, reject) => {
        const uploadPath = path.join(directory, file.name); // Ruta destino
        file.mv(uploadPath, (err) => { // Mueve el archivo
            if (err) {
                return reject(err); // En caso de error, rechaza la promesa
            }
            resolve(`/${directory}/${file.name}`); // Devuelve la ruta del archivo subido
        });
    });
};

// Ruta POST para crear una nueva skin
router.post('/new-skin', async (req, res) => {
    try {
        const { name, price } = req.body;

        // Verifica que se hayan subido los archivos necesarios
        if (!req.files || !req.files.image || !req.files.assetBundle) {
            return res.status(400).json({ message: "No s'han penjat els fitxers requerits" });
        }

        // Sube los archivos a las carpetas correspondientes
        const imagePath = await handleFileUpload(req.files.image, imagesDir);
        const assetBundlePath = await handleFileUpload(req.files.assetBundle, assetBundleDir);

        // Crea la skin en la base de datos
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

// Ruta POST para editar una skin existente
router.post('/edit-skin', async (req, res) => {
    try {
        const { id, name, price } = req.body;

        const skin = await Skin.findOne({ where: { id } }); // Busca la skin por ID

        if(!skin) res.status(404).json({ message: 'Skin no trobat' });

        // Si se subieron nuevos archivos, los reemplaza
        if (req.files && req.files.image && req.files.assetBundle) {
            const imagePath = await handleFileUpload(req.files.image, imagesDir);
            const assetBundlePath = await handleFileUpload(req.files.assetBundle, assetBundleDir);

            skin.name = name;
            skin.price = price;
            skin.imagePath = imagePath;
            skin.assetBundlePath = assetBundlePath;
        }
        // Si no, solo actualiza nombre y precio
        else {
            skin.name = name;
            skin.price = price;
        }

        await skin.save(); // Guarda los cambios en la base de datos
        res.status(200).json({ message: 'Skin actualizado con éxito' });
    } catch (error) {
        console.error("Error en l'edició de la skin:", error);
        res.status(500).json({ message: 'Error intern del servidor' });
    }
});

export default router; // Exporta el router para ser usado en el servidor