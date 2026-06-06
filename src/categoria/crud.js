import banco from "../banco-de-dados/db.js";
import ErrorPersonalizado from "../error/appError.js";
import bcrypt from "bcrypt";

const criarCategoria = async (nome) => {
  try {

    categoriaExiste = await categoriaExiste(nome);
    if (categoriaExiste) {
      throw new ErrorPersonalizado("Categoria já existe", 400);
    }
    const [result] = await banco.query(
      'INSERT INTO categoria (nome) VALUES (?)',
      [nome]
    );
    return result;
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
};

const categoriaExiste = async(nome) => {
    try {
        const [rows] = await banco.query( 
            'SELECT * FROM categoria WHERE nome = ?',
            [nome]
        );
        return rows.length > 0;
    } catch (error) {
        throw new ErrorPersonalizado("Categoria ja existe", 400);
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

const atualizarCategoria = async (id, nome) => {
  try {
    const [rows] = await banco.query(
      'SELECT * FROM categoria WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      throw new ErrorPersonalizado("Categoria não encontrada", 404);
    }
    const [result] = await banco.query(
      'UPDATE categoria SET nome = ? WHERE id = ?',
      [nome, id]
    );
    return result;
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
};

const listarCategorias = async () => {
  try {
    const [rows] = await banco.query( 
      'SELECT * FROM categoria'
    );
    return rows;
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    throw error;
  };
}


export { criarCategoria, atualizarCategoria, listarCategorias };
