const Joi = require("joi");

const attendanceRecordSchema = Joi.object({
    sessionId: Joi.string()
        .hex()
        .length(24)
        .required(),

    studentId: Joi.string()
        .hex()
        .length(24)
        .required(),

    status: Joi.string()
        .valid("PRESENT", "ABSENT", "LATE")
        .required(),

    method: Joi.string()
        .valid("FACE", "MANUAL", "QR")
        .optional(),

    confidence: Joi.number()
        .min(0)
        .max(1)
        .allow(null)
        .optional()
});

const validateAttendanceRecord = (req, res, next) => {
    const { error } = attendanceRecordSchema.validate(
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

module.exports = validateAttendanceRecord;