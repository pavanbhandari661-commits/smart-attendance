const Joi = require("joi");

const attendanceSessionSchema = Joi.object({
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
        .required(),

    method: Joi.string()
        .valid("FACE", "MANUAL", "QR")
        .optional()
});

const validateAttendanceSession = (req, res, next) => {
    const { error } = attendanceSessionSchema.validate(
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

module.exports = validateAttendanceSession;