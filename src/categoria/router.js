import Router from "express";
import { criarCategoriaController, atualizarCategoriaController, listarCategoriasController }  from "./constroller.js";
import verificarRole from "../middleware/role.middleware.js";

const router = Router();
router.post("/categorias", verificarRole, criarCategoriaController);
router.put("/categorias/:id", verificarRole, atualizarCategoriaController);
router.get("/categorias", listarCategoriasController);
const categoriaRouter = router;
export default categoriaRouter;