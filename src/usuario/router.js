import Router from "express";
import {loginUsuarioController, criarUsuarioController }  from "./constroller.js";


const router = Router();
router.post("/login", loginUsuarioController);
router.post("/register", criarUsuarioController);

const usuarioRouter = router;
export default usuarioRouter;