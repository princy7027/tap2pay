import Joi from "joi"

export const RegisterUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const LoginUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})
