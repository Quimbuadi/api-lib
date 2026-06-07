import banco from "../banco-de-dados/db.js";
import ErrorPersonalizado from "../error/appError.js";
import bcrypt from "bcrypt";
import {buscarLivroPorId} from "../livro/crud.js";

const fazerEmprestimo = async (id_usuario, id_livro, quantidade) => {
  try {

    //garantir que os id estejam limpos
    if(!id_livro || isNaN(id_livro) && !quantidade || isNaN(quantidade)){
      throw new ErrorPersonalizado("Id livro e a quantidade devem ser inteiros positivos", 400);
    }

    //ver se o livro existe
    const livroExiste = await buscarLivroPorId(id_livro);
    if (!livroExiste) {
      throw new ErrorPersonalizado("Livro nao encontrado", 400);
    }

    //ver se ainda restou copias para ser emprestado
    if(livroExiste.quantidade <= 0){
      throw new ErrorPersonalizado("Quantidade de livro insuficiente");
    }

    //fazer emprestimo
    const sql = `INSERT INTO emprestimo (id_usuario, id_livro, data_devolucao_prevista, quantidade)
    VALUES (? , ?, ?, ?)
    `
    const emprestar = await banco.query(sql, [id_usuario, id_livro, quantidade]);
    console.log("emprestimo: ", emprestar);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
};



export { fazerEmprestimo };
