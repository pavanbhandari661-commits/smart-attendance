const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        rollNumber: {
            type: String,
            required: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        year: {
            type: Number,
            required: true
        },

        division: {
            type: String,
            required: true,
            trim: true
        },

        semester: {
            type: Number,
            required: true
        },

        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            default: null
        },

        profileImage: {
            type: String,
            default: null
        },

        faceRegistered: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;