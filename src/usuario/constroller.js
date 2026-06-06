import { criarUsuario, loginUsuario } from "./crud.js";
import { usuarioSchemaLogin, usuarioSchemaCadastro } from "./validation.js";
import jwt from "jsonwebtoken";

const criarUsuarioController = async (req, res) => {
    try {
        const { error } = usuarioSchemaCadastro.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const resultado = await criarUsuario(req.body);
        const token = jwt.sign({ id: resultado.insertId, email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '10h' });
        res.status(201).json({ message: "Usuário criado com sucesso", id: resultado.insertId, token });
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
            const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '10h' });
            res.status(200).json({ message: "Login bem-sucedido", token, usuario });
        } else {
            res.status(401).json({ message: "Email ou senha inválidos" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erro ao fazer login", error: error.message });
    }
};

export { criarUsuarioController, loginUsuarioController };