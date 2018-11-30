import Joi from 'joi'

export default {
    contactFormSchema: Joi.object().keys({
        "purpose" : Joi.string().min(2).required(),
        "name" : Joi.string().min(2).required(),
        "email" : Joi.string().email({ minDomainAtoms: 2 }).required(),
        "phone" : Joi.string().min(10).allow(''),
        "country" : Joi.string().allow(''),
        "message" : Joi.string().min(5).required()
    })
};