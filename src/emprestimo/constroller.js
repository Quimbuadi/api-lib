import {
    fazerEmprestimo,
    listarTodosEmprestimos,
    verMeusEmprestimos,
    devolverLivro
} from "./crud.js";

import ErrorPersonalizado from "../error/appError.js";
import { emprestimoSchema } from "./validation.js";

const fazerEmprestimoController = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const { value, error } = emprestimoSchema.validate(req.body, { convert: true });

        if (error) return res.status(400).json({ message: error.details[0].message });

        const emprestar = await fazerEmprestimo(id_usuario, value.id_livro, value.quantidade);
        res.status(201).json({ message: "Livro emprestado com sucesso", emprestar });
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
};

const listarEmprestimosController = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const emprestimos = await listarTodosEmprestimos({ page, limit });
        res.status(200).json(emprestimos);
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
};

const verMeusEmprestimosController = async (req, res) => {
    try {
        const id = req.usuario.id;
        const meusEmprestimos = await verMeusEmprestimos(id);
        return res.status(200).json(meusEmprestimos);
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }

}

const devolverEmprestimosController = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const {id} = req.params;

        if(!id || isNaN(id) || Number(id) < 0){
            throw new ErrorPersonalizado("informe um id_emprestimo valido", 400);
        }
        const devolver = await devolverLivro(id ,id_usuario);
        return res.status(200).json({
            devolver
        });
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }

}


export { 
    fazerEmprestimoController, 
    listarEmprestimosController, 
    verMeusEmprestimosController,
    devolverEmprestimosController
};