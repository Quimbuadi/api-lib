import {
    cadastrarLivro,
    listarLivros,
    atualizarLivro,
    buscarLivroPorId
} from "./crud.js";

import { livroSchemaCadastro, livroSchemaAtualizado } from "./validation.js";
import ErrorPersonalizado from "../error/appError.js";
import jwt from "jsonwebtoken";
import fs from "fs";

const cadastrarLivroController = async (req, res) => {
    try {

        //pegar o nome da imagem do arquivo enviado
        if (req.file) {
            req.body.img = `public/uploads/${req.file.filename}`;
        } else {
            throw new ErrorPersonalizado("Imagem do livro é obrigatória", 400);
        }

        const resultado = await cadastrarLivro(req.body);
        res.status(201).json({ message: "Livro cadastrado com sucesso", livro: resultado });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro ao cadastrar livro", error: error.message });
    }
};

const listarLivrosController = async (req, res) => {
    try {

        const { titulo, categoria, page, limit } = req.query;
        const resultado = await listarLivros({ titulo, categoria, page, limit });
        res.status(200).json(resultado);
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro interno no servidor" });
    }

};


const atualizarLivroController = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "ID do livro é obrigatório e deve ser um número válido" });
    }
    try {
        const livroAtualizado = await atualizarLivro(id, req.body);
        res.status(200).json(livroAtualizado);
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro ao atualizar livro", error });
    }
};

const buscarLivroPorIdController = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "O id deve ser um inteiro valido" });
        }
        const buscar = await buscarLivroPorId(id);
        return res.status(200).json( buscar );
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro ao buscar livro por id", "erro": error.message });
    }
}

export {
    cadastrarLivroController,
    listarLivrosController,
    atualizarLivroController,
    buscarLivroPorIdController
};