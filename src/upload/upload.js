import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // ex: 1780749984.jpg
  }
});

const fileFilter = (req, file, cb) => {
  const permitidos = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  permitidos.includes(file.mimetype) ? cb(null, true) : cb(new Error("Formato não permitido"));
};

export const upload = multer({ storage, fileFilter });
