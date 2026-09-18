const Joi = require("joi");

const studentSchema = Joi.object({
    studentId: Joi.string()
        .trim()
        .required(),

    rollNumber: Joi.string()
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
        .required(),

    classId: Joi.string()
        .allow(null)
        .optional(),

    profileImage: Joi.string()
        .allow(null, "")
        .optional(),

    faceRegistered: Joi.boolean()
        .optional()
});

const validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body, {
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

module.exports = validateStudent;