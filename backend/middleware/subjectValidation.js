const Joi = require("joi");

const subjectSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .required(),

    code: Joi.string()
        .trim()
        .min(2)
        .required(),

    department: Joi.string()
        .trim()
        .required(),

    semester: Joi.number()
        .integer()
        .min(1)
        .max(8)
        .required(),

    classId: Joi.string()
        .hex()
        .length(24)
        .required()
});

const validateSubject = (req, res, next) => {
    const { error } = subjectSchema.validate(req.body, {
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

module.exports = validateSubject;