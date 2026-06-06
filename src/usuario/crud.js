import banco from "../banco-de-dados/db.js";
import ErrorPersonalizado from "../error/appError.js";

const criarUsuario = async (dados) => {
  try {
    const [result] = await banco.query(
      'INSERT INTO usuario (nome, password, email, telefone ) VALUES (?, ?, ?, ?)',
      [dados.nome, dados.password, dados.email, dados.telefone]
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
    const [rows] = await banco.execute(
      'SELECT * FROM usuario WHERE email = ? AND password = ?',
      [email, password]
    );
    return rows[0];
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export { criarUsuario, loginUsuario };