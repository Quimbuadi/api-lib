import mysql from 'mysql2/promise';
import 'dotenv/config';

const crearConexao = () => {
    try {
        const conexao = mysql.createPool({
            host: process.env.HOST_BANCO || 'localhost',
            user: process.env.USUARIO_BANCO || 'root',
            password: process.env.SENHA_BANCO || 'mypassword',
            database: process.env.NOME_BANCO || 'testdb',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('Conexão com o banco de dados criada com sucesso');
        return conexao;
    } catch (error) {
        console.error('Erro ao criar conexão com o banco de dados:', error);
        throw error;
    }
}
const banco = crearConexao();


export default banco;


