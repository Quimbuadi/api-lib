import Joi from "joi";
const emprestimoSchema = Joi.object({
    id_livro: Joi.number().integer().positive().required().messages({
        'number.base': 'id_livro deve ser inteiro positivo.',
        'any.required': 'informe o id_livro.'
    }),
    quantidade: Joi.number().integer().min(1).positive().required().messages({
        'number.base': 'a quantidade deve ser inteiro.',
        'any.required': 'informe a quantidade.',
        "number.min": "a quantidade minima e 1"
    })
});


export { emprestimoSchema };
