import { fazerEmprestimo } from "./crud.js";
import ErrorPersonalizado from "../error/appError.js";
import jwt from "jsonwebtoken";

const fazerEmprestimoController = async (req, res) => {
    try {
        const {id_livro} = req.params;
        const id_usuario = req.usuario.id;
        const quantidade = req.body.quantidade;
        console.log("idlivro: ",id_livro, "idusuario: ", id_usuario);
        const emprestar = await fazerEmprestimo(id_usuario, id_livro, quantidade);
        return res.status(201).json({message: "livro emprestado", emprestar});

    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro ao fazer emprestimo", error: error.message });
    }
};



export { fazerEmprestimoController };