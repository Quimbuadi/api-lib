import Joi from "joi";


const livroSchemaCadastro = Joi.object({
    titulo: Joi.string().min(3).max(150).required().messages({
        'string.base': 'O título deve ser uma string.',
        'string.empty': 'O título é obrigatório.',
        'string.min': 'O título deve ter pelo menos 3 caracteres.',
        'string.max': 'O título deve ter no máximo 150 caracteres.'
    }),
    editora: Joi.string().min(3).max(150).required().messages({
        'string.base': 'A editora deve ser uma string.',
        'string.empty': 'A editora é obrigatória.',
        'string.min': 'A editora deve ter pelo menos 3 caracteres.',
        'string.max': 'A editora deve ter no máximo 150 caracteres.'
    }),
    ano_publicacao: Joi.date().required().messages({
        'date.base': 'A data de publicação deve ser uma data válida.',
        'date.empty': 'A data de publicação é obrigatória.'
    }),
    id_categoria: Joi.number().integer().positive().required().messages({
        'number.base': 'o id da categoria deve ser um número válido.',
        'number.empty': 'O id da categoria é obrigatório.',
        'number.positive': 'O id da categoria deve ser um número positivo.'
    }),
    isbn_codigo: Joi.string().min(10).max(50).required().messages({
        'string.base': 'O ISBN deve ser uma string.',
        'string.empty': 'O ISBN é obrigatório.',
        'string.min': 'O ISBN deve ter pelo menos 10 caracteres.',
        'string.max': 'O ISBN deve ter no máximo 50 caracteres.'
    }),
    img: Joi.string().uri().required().messages({
        'string.base': 'A imagem deve ser uma URL válida.',
        'string.empty': 'A imagem é obrigatória.'
    }),
    quantidade: Joi.number().integer().min(0).required().messages({
        'number.base': 'A quantidade deve ser um número válido.',
        'number.empty': 'A quantidade é obrigatória.',
        'number.min': 'A quantidade deve ser um número inteiro não negativo.'
    })
});


const livroSchemaAtualizado = livroSchemaCadastro.fork({
    titulo: (schema) => schema.optional(),
    editora: (schema) => schema.optional(),
    ano_publicacao: (schema) => schema.optional(),
    id_categoria: (schema) => schema.optional(),
    isbn_codigo: (schema) => schema.optional(),
    img: (schema) => schema.optional(),
    quantidade: (schema) => schema.optional()
});



export { livroSchemaCadastro, livroSchemaAtualizado };
