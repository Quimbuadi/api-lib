import { Router } from "express";
import verificarRole from "../middleware/role.middleware.js";
import autenticarUsuario from "../middleware/auth.middleware.js";
import validarAntesDeFicheiro from "../middleware/validar.antes.upload.js";
import { livroSchemaAtualizado, livroSchemaCadastro } from "./validation.js";
import { upload } from "../upload/upload.js";
import {
    cadastrarLivroController, 
    listarLivrosController, 
    atualizarLivroController,
    buscarLivroPorIdController
} from "./constroller.js";

const router = Router();

router.get("/livros",
  autenticarUsuario,
  listarLivrosController
);

router.get("/livros/:id",
  autenticarUsuario,
  buscarLivroPorIdController
);

router.post("/livros",
  autenticarUsuario,
  verificarRole,
  upload.single("img"),
  validarAntesDeFicheiro(livroSchemaCadastro),
  cadastrarLivroController
);

router.put("/livros/:id",
  verificarRole,
  upload.single("img"),
  validarAntesDeFicheiro(livroSchemaAtualizado),
  atualizarLivroController
);
const livroRouter = router;

export default livroRouter;