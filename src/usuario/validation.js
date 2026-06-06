import Joi from "joi";
const usuarioSchemaCadastro = Joi.object({
    nome: Joi.string().min(3).max(30).required().messages({
        'string.base': 'O nome deve ser uma string.',
        'string.empty': 'O nome é obrigatório.',
        'string.min': 'O nome deve ter pelo menos 3 caracteres.',
        'string.max': 'O nome deve ter no máximo 30 caracteres.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': 'A senha deve ser uma string.',
        'string.empty': 'A senha é obrigatória.',
        'string.min': 'A senha deve ter pelo menos 6 caracteres.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'O email deve ser um email válido.',
        'string.empty': 'O email é obrigatório.'
    }),
    telefone: Joi.string().pattern(/^\d{9,9}$/).required().messages({
        'string.pattern.base': 'O telefone deve ter 9 dígitos.',
        'string.empty': 'O telefone é obrigatório.'
    })
});

const usuarioSchemaLogin = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'O email deve ser um email válido.',
        'string.empty': 'O email é obrigatório.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': 'A senha deve ser uma string.',
        'string.empty': 'A senha é obrigatória.',
        'string.min': 'A senha deve ter pelo menos 6 caracteres.'
    })
});


export { usuarioSchemaLogin, usuarioSchemaCadastro };
