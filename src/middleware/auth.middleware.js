import jwt from "jsonwebtoken";
import ErrorPersonalizado from "../error/appError.js";

const autenticarUsuario = (req, res, next) => {

    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new ErrorPersonalizado("Token de autenticação não fornecido", 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
        
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(401).json({ message: "Token inválido" });
    }
};

export default autenticarUsuario;