import Joi from 'joi'

export default {
    UserRegistrationSchema: Joi.object().keys({
        "username": Joi.string().min(3).required(),
        "password": Joi.string().min(3).required(),
        "first_name" : Joi.string().min(2).required(),
        "last_name" : Joi.string().min(3).required(),
        "email" : Joi.string().email({ minDomainAtoms: 2 }).required()
    })
};