const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AttendanceSession",
            required: true
        },

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        status: {
            type: String,
            enum: ["PRESENT", "ABSENT", "LATE"],
            default: "ABSENT"
        },

        method: {
            type: String,
            enum: ["FACE", "MANUAL", "QR"],
            default: "MANUAL"
        },

        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: null
        },

        markedAt: {
            type: Date,
            default: Date.now
        },

        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

// A student can have only one attendance record per session
attendanceRecordSchema.index(
    {
        sessionId: 1,
        studentId: 1
    },
    {
        unique: true
    }
);

const AttendanceRecord = mongoose.model(
    "AttendanceRecord",
    attendanceRecordSchema
);

module.exports = AttendanceRecord;