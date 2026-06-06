import Joi from "joi";
const categoriaSchema = Joi.object({
    nome: Joi.string().min(3).max(50).required().messages({
        'string.base': 'O nome da categoria deve ser uma string.',
        'string.empty': 'O nome da categoria é obrigatório.',
        'string.min': 'O nome da categoria deve ter pelo menos 3 caracteres.',
        'string.max': 'O nome da categoria deve ter no máximo 50 caracteres.'
    })
});


export { categoriaSchema };
