import express from 'express';
import multer from 'multer';
import path from 'path';

import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Controller
import { controller } from "../controllers/main.js";

// Storage de multer
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        //const filePath = path.resolve(__dirname, "../public/uploads");
        const filePath = "192.168.44.119/digitalizacion/uploads";
        cb(null, filePath);
    }, 
    filename: (req, file, cb) => {
        const fileName = req
            .body
            .nickname
            //.replaceAll('', '-')
            .toLowerCase();
        const fileExtension = path.extname(file.originalname);
        cb(null, `${fileName}-${Date.now()}${fileExtension}`);
    }
});

// Upload function
const uploadFiles = multer({ 
    storage: diskStorage, 
    fileFilter: (req, file, cb) => {
        const acceptedExtensions = [".jpg", ".png", ".jpeg"];
        const fileExtension = path.extname(file.originalname);
        const isAnAcceptedExtension = acceptedExtensions.includes(fileExtension);
        if (isAnAcceptedExtension) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
 });

const router = express.Router();

router.get("/", controller.index);

router.post("/guardar", uploadFiles.single("avatar"), controller.storeAvatar);

export default router;