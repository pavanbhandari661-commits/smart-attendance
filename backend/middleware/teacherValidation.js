const Joi = require("joi");

const teacherSchema = Joi.object({
    teacherId: Joi.string()
        .trim()
        .required(),

    name: Joi.string()
        .trim()
        .min(2)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .required(),

    department: Joi.string()
        .trim()
        .required(),

    designation: Joi.string()
        .trim()
        .optional(),

    userId: Joi.string()
        .hex()
        .length(24)
        .allow(null)
        .optional()
});

const validateTeacher = (req, res, next) => {
    const { error } = teacherSchema.validate(req.body, {
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

module.exports = validateTeacher;