import banco from "../banco-de-dados/db.js";
import ErrorPersonalizado from "../error/appError.js";
import buscarCategoriaPorId from "../categoria/crud.js";
import upload from "../upload/upload.js";

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
    

    const [result] = await banco.query(
      'INSERT INTO livro (titulo, editora, ano_publicacao, id_categoria, isbn_codigo, img, quantidade) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [dados.titulo, dados.editora, dados.ano_publicacao, dados.id_categoria, dados.isbn_codigo, dados.img, dados.quantidade]
    );
    return result;
  } catch (error) {
    console.error('Erro ao cadastrar livro:', error);
    throw error;
  }
};

const livroExiste = async(isbn, titulo) => {
    try {
        const [rows] = await banco.query(
            'SELECT * FROM livro WHERE isbn_codigo = ? OR titulo = ?',
            [isbn, titulo]
        );
        return rows.length > 0;

    } catch (error) {
        throw new ErrorPersonalizado("Erro ao verificar livro existente", 500);
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