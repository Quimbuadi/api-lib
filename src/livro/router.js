import Router from "express";
import {loginUsuarioController, criarUsuarioController, verPerfilController, meController }  from "./constroller.js";
import verificarRole from "../middleware/role.middleware.js";
import autenticarUsuario from "../middleware/auth.middleware.js";

const router = Router();
router.post("/login", loginUsuarioController);
router.post("/", criarUsuarioController);
router.get("/perfil/:id", verificarRole, verPerfilController);
router.get("/me", autenticarUsuario, meController);
const usuarioRouter = router;
export default usuarioRouter;