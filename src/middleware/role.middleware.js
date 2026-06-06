import jwt from "jsonwebtoken";
import ErrorPersonalizado from "../error/appError.js";

const verificarRole = (req, res, next) => {

    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new ErrorPersonalizado("Token de autenticação não fornecido", 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            throw new ErrorPersonalizado("Token inválido ou expirado", 401);
        }

        const role = decoded.role;
        req.usuario = decoded;
        
        
        if(role !== "admin"){
            throw new ErrorPersonalizado("Acesso negado: Permissão insuficiente", 403);
        }
        next();
        
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
};

export default verificarRole;