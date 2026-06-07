import Router from "express";
import { 
    fazerEmprestimoController, 
}  from "./constroller.js";

import verificarRole from "../middleware/role.middleware.js";
import autenticarUsuario from "../middleware/auth.middleware.js";

const router = Router();
router.post("/emprestar", autenticarUsuario);

const emprestarRouter = router;
export default emprestarRouter;