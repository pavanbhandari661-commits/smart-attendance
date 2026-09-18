const Joi = require("joi");

const classSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .required(),

    department: Joi.string()
        .trim()
        .required(),

    year: Joi.number()
        .integer()
        .min(1)
        .max(4)
        .required(),

    division: Joi.string()
        .trim()
        .required(),

    semester: Joi.number()
        .integer()
        .min(1)
        .max(8)
        .required()
});

const validateClass = (req, res, next) => {
    const { error } = classSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map((detail) => detail.message)
        });
    }

    next();
};

module.exports = validateClass;