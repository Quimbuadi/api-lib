import banco from "../banco-de-dados/db.js";
import ErrorPersonalizado from "../error/appError.js";
import { buscarLivroPorId } from "../livro/crud.js";

const SELECT_EMPRESTIMO = `
  SELECT e.id, u.nome AS usuario, l.titulo AS livro, 
         e.data_emprestimo, e.data_devolucao_prevista, 
         e.data_devolucao_real, e.quantidade,
         CASE WHEN e.data_devolucao_real IS NULL THEN 'activo' ELSE 'devolvido' END AS estado
  FROM emprestimo e
  JOIN usuario u ON e.id_usuario = u.id
  JOIN livro l ON e.id_livro = l.id
`;

const LIMITE_EMPRESTIMOS = 3;

const verificarLimiteEmprestimos = async (id_usuario) => {
  const [[{ total }]] = await banco.query(
    `SELECT COUNT(*) as total FROM emprestimo 
     WHERE id_usuario = ? AND data_devolucao_real IS NULL`,
    [id_usuario]
  );
  if (total >= LIMITE_EMPRESTIMOS)
    throw new ErrorPersonalizado(`Limite de ${LIMITE_EMPRESTIMOS} empréstimos activos atingido`, 400);
};

const fazerEmprestimo = async (id_usuario, id_livro, quantidade) => {
  const livro = await buscarLivroPorId(id_livro);
  if (!livro)
    throw new ErrorPersonalizado("Livro não encontrado", 404);
  if (livro.quantidade < quantidade)
    throw new ErrorPersonalizado("Quantidade insuficiente de cópias disponíveis", 400);

  await verificarLimiteEmprestimos(id_usuario);

  const data_devolucao_prevista = new Date();
  data_devolucao_prevista.setDate(data_devolucao_prevista.getDate() + 14);

  const [result] = await banco.query(
    `INSERT INTO emprestimo (id_usuario, id_livro, data_devolucao_prevista, quantidade)
     VALUES (?, ?, ?, ?)`,
    [id_usuario, id_livro, data_devolucao_prevista, quantidade]
  );

  await banco.query(
    'UPDATE livro SET quantidade = quantidade - ? WHERE id = ?',
    [quantidade, id_livro]
  );

  return { id: result.insertId, id_usuario, id_livro, quantidade, data_devolucao_prevista };
};

const devolverLivro = async (id_emprestimo, id_usuario) => {
  const [rows] = await banco.query(
    'SELECT * FROM emprestimo WHERE id = ?', [id_emprestimo]
  );
  const emprestimo = rows[0];

  if (!emprestimo)
    throw new ErrorPersonalizado("Empréstimo não encontrado", 404);
  if (emprestimo.id_usuario !== id_usuario)
    throw new ErrorPersonalizado("Não autorizado", 403);
  if (emprestimo.data_devolucao_real)
    throw new ErrorPersonalizado("Livro já foi devolvido", 400);

  await banco.query(
    'UPDATE emprestimo SET data_devolucao_real = NOW() WHERE id = ?',
    [id_emprestimo]
  );

  await banco.query(
    'UPDATE livro SET quantidade = quantidade + ? WHERE id = ?',
    [emprestimo.quantidade, emprestimo.id_livro]
  );

  return { message: "Livro devolvido com sucesso" };
};

const verMeusEmprestimos = async (id_usuario) => {
  const [rows] = await banco.query(
    `${SELECT_EMPRESTIMO} WHERE e.id_usuario = ? ORDER BY e.data_emprestimo DESC`,
    [id_usuario]
  );
  return rows;
};

const listarTodosEmprestimos = async ({ page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;

  const [rows] = await banco.query(
    `${SELECT_EMPRESTIMO} ORDER BY e.data_emprestimo DESC LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );

  const [[{ total }]] = await banco.query(
    'SELECT COUNT(*) as total FROM emprestimo'
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

export { fazerEmprestimo, devolverLivro, verMeusEmprestimos, listarTodosEmprestimos };