import banco from "../banco-de-dados/db.js";
import bcrypt from "bcrypt";
import ErrorPersonalizado from "../error/appError.js";


const seedAdmin = async () => {
    try{
        const emailAdmin = "admin@admin.com";
        const senhaAdmin = await bcrypt.hash("admin1234", 10);
        const admin = await banco.execute(
            'INSERT INTO usuario (nome, password, email, telefone, tipo_usuario) VALUES (?, ?, ?, ?, ?)',
            ["Admin", senhaAdmin, emailAdmin, "937579318", "admin"]
        );
        console.log("Administrador criado com sucesso");
    } catch (error) {
        if (error instanceof ErrorPersonalizado) {
            console.error("Erro ao cadastrar o administrador:", error.message);
        } else {
            console.error("Erro ao criar o administrador:", error);
        }
        console.error("Erro ao semear o administrador:", error);        
    }
}

/**
NOME_BANCO='biblioteca'
USUARIO_BANCO='root'
SENHA_BANCO='1234'
HOST_BANCO='localhost'
PORTA_BANCO='3306'
JWT_SECRET='sdffsdfjwrfwefsfs90jwerwenksfrf'
*/

seedAdmin();