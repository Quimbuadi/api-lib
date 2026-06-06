import Router from "express";
import { 
    criarCategoriaController, 
    atualizarCategoriaController, 
    listarCategoriasController,
    buscarCategoriaPorIdController,
    buscarCategoriaPorNomeController
}  from "./constroller.js";

import verificarRole from "../middleware/role.middleware.js";

const router = Router();
router.get("/categorias", listarCategoriasController);
router.get("/categorias/nome", buscarCategoriaPorNomeController);
router.post("/categorias", verificarRole, criarCategoriaController);
router.put("/categorias/:id", verificarRole, atualizarCategoriaController);
router.get("/categorias/:id", buscarCategoriaPorIdController);
const categoriaRouter = router;
export default categoriaRouter;