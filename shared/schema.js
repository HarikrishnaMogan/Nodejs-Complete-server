const joi = require("joi");

const schema={
    registerSchema: joi.object({
        name:joi.string().required(),
        email:joi.string().email().required(),
        password:joi.string().min(5).max(10).required()
    }),

    loginSchema:joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(5).max(10).required()
    }),
    postSchema:joi.object({
        title:joi.string().min(4).max(10).required(),
        body:joi.string().max(100).required()
    })
}

module.exports = schema;