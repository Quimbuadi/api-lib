import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// caminho absoluto correcto baseado na raiz do projecto
const uploadDir = path.join(__dirname, "../../public/uploads");

// cria a pasta se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const permitidos = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  permitidos.includes(file.mimetype) ? cb(null, true) : cb(new Error("Formato não permitido"));
};

export const upload = multer({ storage, fileFilter });