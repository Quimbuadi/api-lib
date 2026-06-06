import { criarCategoria, atualizarCategoria, listarCategorias } from "./crud.js";
import { categoriaSchema } from "./validation.js";
import ErrorPersonalizado from "../error/appError.js";
import jwt from "jsonwebtoken";

const criarCategoriaController = async (req, res) => {
    try {
        const { error } = categoriaSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const resultado = await criarCategoria(req.body.nome);
        res.status(201).json({ message: "Categoria criada com sucesso", categoria: resultado });
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro ao criar categoria", error: error.message });
    }
};

const atualizarCategoriaController = async (req, res) => {
    const { error } = categoriaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "ID da categoria é obrigatório e deve ser um número válido" });
    }
    const { nome } = req.body;
    try {
        const resultado = await atualizarCategoria(id, nome);
        res.status(200).json({ message: "Categoria atualizada com sucesso", categoria: resultado });
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro ao atualizar categoria", error: error.message });
    }
};

const listarCategoriasController = async (req, res) => {
    try {
        const categorias = await listarCategorias();
        res.status(200).json(categorias );
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro ao listar categorias", error: error.message });
    }
};

export { criarCategoriaController, atualizarCategoriaController, listarCategoriasController };