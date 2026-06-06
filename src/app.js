import expess from "express";
import cors from "cors";
import banco from "./banco-de-dados/db.js";
import usuarioRouter from "./usuario/router.js";
import categoriaRouter from "./categoria/router.js";
const app = express();
app.use(cors());

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//arquivo estaticos
app.use("/uploads", express.static("./src/public/uploads"));

app.use("/api/usuarios", usuarioRouter);
app.use("/api/", categoriaRouter);

export default app;