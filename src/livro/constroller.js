import { criarUsuario, loginUsuario, verPerfil } from "./crud.js";
import { livroSchemaCadastro, livroSchemaAtualizado } from "./validation.js";
import ErrorPersonalizado from "../error/appError.js";
import jwt from "jsonwebtoken";

const criarUsuarioController = async (req, res) => {
    try {
        const { error } = usuarioSchemaCadastro.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const resultado = await criarUsuario(req.body);
        const token = jwt.sign({ id: resultado.insertId, email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '10h' });
        res.status(201).json({ message: "Usuário criado com sucesso", token });
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
    }  
};

const loginUsuarioController = async (req, res) => {
    const { error } = usuarioSchemaLogin.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;
    try {
        const usuario = await loginUsuario(email, password);

        if (usuario) {
            console.log(usuario);
            const {id, nome, email, telefone, tipo_usuario} = usuario;
            const token = jwt.sign({ id: usuario.id, email: usuario.email, nome: usuario.nome, telefone: usuario.telefone, role: usuario.tipo_usuario }, process.env.JWT_SECRET, { expiresIn: '10h' });
            res.status(200).json({ 
                message: "Login bem-sucedido",
                token,
                usuario: {
                    id,
                    nome,
                    email,
                    tipo_usuario
                }
            });
        } else {
            res.status(401).json({ message: "Email ou senha inválidos" });
        }
    } catch (error) {
        if(error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro ao fazer login", error: error.message });
    }
};

const verPerfilController = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "ID do usuário é obrigatório e deve ser um número válido" });
    }
    try {
        const usuario = await verPerfil(id);
        res.status(200).json({ usuario });
    } catch (error) {
        if(error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

const meController = async (req, res) => {
    try {
        const usuario = req.usuario;
        const {password, ...usuarioSemSenha} = usuario;
        res.status(200).json({ usuario: usuarioSemSenha });
    } catch (error) {
        res.status(500).json({ message: "Erro ao obter perfil do usuário", error: error.message });
    }
};

export { criarUsuarioController, loginUsuarioController, verPerfilController, meController };