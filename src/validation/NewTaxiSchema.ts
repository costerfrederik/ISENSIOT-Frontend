import Joi, { ObjectSchema } from 'joi';

export const newTaxiSchema: ObjectSchema = Joi.object({
    identifier: Joi.string().max(50).trim().required().messages({
        'string.base': `Vehicle identifier should be a string`,
        'string.empty': `Vehicle identifier can't be empty`,
        'string.max': `Vehicle identifier can't exceed 50 characters`,
        'any.required': `Vehicle identifier is required`,
    }),
});
