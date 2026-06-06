import express from "express";
import cors from "cors";
import banco from "./banco-de-dados/db.js";
import usuarioRouter from "./usuario/router.js";
import categoriaRouter from "./categoria/router.js";
import livroRouter from "./livro/router.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//arquivo estaticos
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use("/api/usuarios", usuarioRouter);
app.use("/api/", categoriaRouter);
app.use("/api/", livroRouter);

export default app;