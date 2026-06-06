import banco from "../banco-de-dados/db.js";
import ErrorPersonalizado from "../error/appError.js";
import bcrypt from "bcrypt";

const criarCategoria = async (nome) => {
  try {

    const buscarCategoria = await categoriaExiste(nome);
    if (buscarCategoria) {
      throw new ErrorPersonalizado("Categoria já existe", 400);
    }
    const [result] = await banco.query(
      'INSERT INTO categoria (nome) VALUES (?)',
      [nome]
    );
    return result.insertId;
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
};

const categoriaExiste = async (nome) => {
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


const atualizarCategoria = async (id, nome) => {
  try {
    const [rows] = await banco.query(
      'SELECT * FROM categoria WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      throw new ErrorPersonalizado("Categoria não encontrada", 404);
    }

    if (rows[0].nome === nome) {
      throw new ErrorPersonalizado("Nome da categoria é o mesmo", 400);
    }

    const jaExiste = await banco.query('SELECT * from categoria WHERE nome = ? AND id != ?', [nome, id]);
    if (jaExiste[0].length > 0) {
      throw new ErrorPersonalizado("Já existe uma categoria com esse nome", 400);
    }

    const [result] = await banco.query(
      'UPDATE categoria SET nome = ? WHERE id = ?',
      [nome, id]
    );
    if (result.affectedRows === 0) {
      throw new ErrorPersonalizado("Categoria não encontrada", 404);
    }
    return { id, nome };

  }catch (error) {
    if (error instanceof ErrorPersonalizado) {
      throw error;
    }
    throw new ErrorPersonalizado("Erro ao atualizar categoria", 500);
  }

};

const listarCategorias = async () => {
  try {
    const [rows] = await banco.query(
      'SELECT * FROM categoria'
    );
    return rows;
  } catch (error) {
    throw error;
  };
}

const buscarCategoriaPorId = async (id) => {
  try {
    const [rows] = await banco.query(
      'SELECT * FROM categoria WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      throw new ErrorPersonalizado("Categoria não encontrada", 404);
    }
      return rows[0];
  } catch (error) {
    throw error;
  }
};

const buscarCategoriaPorNome = async (nome) => {
  try {
    const [rows] = await banco.query(
      'SELECT * FROM categoria WHERE nome LIKE ?',
      [`${nome}%`]
    );
    if (rows.length === 0) {
      throw new ErrorPersonalizado("Categoria não encontrada", 404);
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
};


export { criarCategoria, atualizarCategoria, listarCategorias, buscarCategoriaPorId, buscarCategoriaPorNome };
