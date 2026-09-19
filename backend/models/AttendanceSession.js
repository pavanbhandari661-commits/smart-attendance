const mongoose = require("mongoose");

const attendanceSessionSchema = new mongoose.Schema(
    {
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        },

        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },

        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        startTime: {
            type: Date,
            required: true
        },

        endTime: {
            type: Date,
            default: null
        },

        status: {
    type: String,
    enum: ["ACTIVE", "REVIEW", "COMPLETED", "CANCELLED"],
    default: "ACTIVE"
},

        method: {
            type: String,
            enum: ["FACE", "MANUAL", "QR"],
            default: "FACE"
        }
    },
    {
        timestamps: true
    }
);

const AttendanceSession = mongoose.model(
    "AttendanceSession",
    attendanceSessionSchema
);

module.exports = AttendanceSession;