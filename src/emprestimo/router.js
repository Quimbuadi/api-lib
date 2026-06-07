import Router from "express";
import {
    fazerEmprestimoController,
    listarEmprestimosController,
    verMeusEmprestimosController,
    devolverEmprestimosController
} from "./constroller.js";

import verificarRole from "../middleware/role.middleware.js";
import autenticarUsuario from "../middleware/auth.middleware.js";

const router = Router();
router.post("/emprestimo", autenticarUsuario, fazerEmprestimoController);
router.get("/emprestimo", autenticarUsuario, listarEmprestimosController);
router.get("/emprestimo/me", autenticarUsuario, verMeusEmprestimosController);
router.put("/emprestimo/:id", autenticarUsuario, devolverEmprestimosController);

const emprestarRouter = router;
export default emprestarRouter;