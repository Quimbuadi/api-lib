import expess from "express";
import banco from "./banco-de-dados/db.js";
import usuarioRouter from "./usuario/router.js";
const app = expess();

app.use(expess.json());
app.use(expess.urlencoded({ extended: true }));

app.use("/api/usuarios", usuarioRouter);

export default app;