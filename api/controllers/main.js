import fs from "fs";
import path from 'path';
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const controller = {
    index: (req, res) => {
        return res.render("form");
    },
    storeAvatar: (req, res) => {
        if(req.file){
            const usersDbPath = path.resolve(__dirname, "../data/users.json");
            let usersDB = JSON.parse(fs.readFileSync(usersDbPath));
            usersDB = [...usersDB, {
                nick: req.body.nickname,
                file: req.file.filename,
            }];
            fs.writeFileSync(usersDbPath, JSON.stringify(usersDB, null, 2));
            console.log(usersDB);
            return res.send("Ok todo se envió bien");
        }  
        return res.send("El archivo no es válido");
    }
}