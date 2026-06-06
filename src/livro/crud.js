import banco from "../banco-de-dados/db.js";
import ErrorPersonalizado from "../error/appError.js";
import { buscarCategoriaPorId } from "../categoria/crud.js";
import crypto from "crypto";

/*
# Field	Type	Null	Key	Default	Extra
id	int	NO	PRI		auto_increment
titulo	varchar(150)	NO	UNI		
editora	varchar(150)	NO			
ano_publicacao	date	NO			
id_categoria	int	YES	MUL		
isbn_codigo	varchar(50)	NO			
img	varchar(254)	NO			
quantidade	int	YES			
*/

const cadastrarLivro = async (dados) => {
  try {

    const existe = await livroExiste(dados.isbn_codigo, dados.titulo);
    if (existe) {
      throw new ErrorPersonalizado("Livro já cadastrado", 400);
    }
    const categoria = await buscarCategoriaPorId(dados.id_categoria);
    if (!categoria) {
      throw new ErrorPersonalizado("Categoria não encontrada", 404);
    }
    const modelo = `ISBN-`;
    const isbn = modelo + crypto.randomBytes(5).toString("hex");

    console.log(isbn);

    const [result] = await banco.query(
      'INSERT INTO livro (titulo, editora, ano_publicacao, id_categoria, isbn_codigo, img, quantidade) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [dados.titulo, dados.editora, dados.ano_publicacao, dados.id_categoria, isbn, dados.img, dados.quantidade]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const atualizarLivro = async (id, dados) => {
  const livro = await buscarLivroPorId(id);
  if (!livro) throw new ErrorPersonalizado("Livro não encontrado", 404);

  // verifica duplicado de título (excluindo o próprio livro)
  if (dados.titulo) {
    const [mesmaTitulo] = await banco.query(
      'SELECT id FROM livro WHERE titulo = ? AND id != ?',
      [dados.titulo, id]
    );
    if (mesmaTitulo.length > 0)
      throw new ErrorPersonalizado("Já existe um livro com este título", 409);
  }

  // verifica duplicado de isbn (excluindo o próprio livro)
  if (dados.isbn_codigo) {
    const [mesmoIsbn] = await banco.query(
      'SELECT id FROM livro WHERE isbn_codigo = ? AND id != ?',
      [dados.isbn_codigo, id]
    );
    if (mesmoIsbn.length > 0)
      throw new ErrorPersonalizado("Já existe um livro com este ISBN", 409);
  }

  // monta update dinâmico só com os campos enviados
  const campos = Object.keys(dados).map(k => `${k} = ?`).join(', ');
  const valores = [...Object.values(dados), id];

  const [result] = await banco.query(
    `UPDATE livro SET ${campos} WHERE id = ?`,
    valores
  );

  return result.affectedRows > 0 ? { id, ...dados } : null;
};


const SELECT_LIVRO = `
  SELECT l.id, l.titulo, l.editora, l.ano_publicacao, 
         c.nome AS categoria, l.isbn_codigo, l.img, l.quantidade 
  FROM livro l 
  JOIN categoria c ON l.id_categoria = c.id
`;

const livroExiste = async (isbn, titulo) => {
  const [rows] = await banco.query(
    'SELECT id FROM livro WHERE isbn_codigo = ? OR titulo = ?',
    [isbn, titulo]
  );
  return rows.length > 0;
};

const listarLivros = async ({ titulo, categoria, page = 1, limit = 10 } = {}) => {
  const conditions = [];
  const valores = [];

  if (titulo) {
    conditions.push('l.titulo LIKE ?');
    valores.push(`%${titulo}%`);
  }

  if (categoria) {
    conditions.push('l.id_categoria = ?');
    valores.push(categoria);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await banco.query(
    `${SELECT_LIVRO} ${where} LIMIT ? OFFSET ?`,
    [...valores, Number(limit), Number(offset)]
  );

  const [[{ total }]] = await banco.query(
    `SELECT COUNT(*) as total FROM livro l ${where}`,
    valores
  );

  return {
    data: rows,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

const buscarLivroPorId = async (id) => {
  const [rows] = await banco.query(
    `${SELECT_LIVRO} WHERE l.id = ?`, [id]
  );
  return rows[0] || null;
};

export { cadastrarLivro,  atualizarLivro, listarLivros, buscarLivroPorId };