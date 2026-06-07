import banco from "../banco-de-dados/db.js";
import ErrorPersonalizado from "../error/appError.js";
import bcrypt from "bcrypt";

const criarUsuario = async (dados) => {
  try {

    const emailExiste = await usuarioExiste(dados.email);
    if (emailExiste) {
      throw new ErrorPersonalizado("Email já cadastrado", 400);
    }
    const hashPassword = await bcrypt.hash(dados.password, 10);
    const [result] = await banco.query(
      'INSERT INTO usuario (nome, password, email, telefone ) VALUES (?, ?, ?, ?)',
      [dados.nome, hashPassword, dados.email, dados.telefone]
    );
    return result;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

const usuarioExiste = async(email) => {
    try {
        const [rows] = await banco.query(
            'SELECT * FROM usuario WHERE email = ?',
            [email]
        );
        return rows.length > 0;

    } catch (error) {
        throw new ErrorPersonalizado("Erro ao verificar usuário existente", 500);
    }
}

const loginUsuario = async (email, password) => {
  try {
    const emailExiste = await usuarioExiste(email);
    if (!emailExiste) {
      throw new ErrorPersonalizado("Usuário não encontrado", 404);
    }

    const [rows] = await banco.execute(
      'SELECT id, nome, email, password, telefone, tipo_usuario FROM usuario WHERE email = ?',
      [email]
    );
    const usuario = rows[0];
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      throw new ErrorPersonalizado("Senha incorreta", 400);
    }
    return usuario;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

const verPerfil = async (id) => {
  try {
    const [rows] = await banco.query(
      'SELECT id, nome, email, telefone FROM usuario WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      throw new ErrorPersonalizado("Usuário não encontrado", 404);
    }
    return rows[0];
  } catch (error) {
    throw new ErrorPersonalizado(error, 404);
  }
};


export { criarUsuario, loginUsuario, verPerfil };