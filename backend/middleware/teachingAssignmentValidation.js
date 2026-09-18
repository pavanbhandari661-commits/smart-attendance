const Joi = require("joi");

const teachingAssignmentSchema = Joi.object({
    teacherId: Joi.string()
        .hex()
        .length(24)
        .required(),

    classId: Joi.string()
        .hex()
        .length(24)
        .required(),

    subjectId: Joi.string()
        .hex()
        .length(24)
        .required()
});

const validateTeachingAssignment = (req, res, next) => {
    const { error } = teachingAssignmentSchema.validate(
        req.body,
        {
            abortEarly: false
        }
    );

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map(
                (detail) => detail.message
            )
        });
    }

    next();
};

module.exports = validateTeachingAssignment;