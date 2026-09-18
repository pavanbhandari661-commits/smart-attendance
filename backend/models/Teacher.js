const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        teacherId: {
            type: String,
            required: true,
            unique: true,
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

        designation: {
            type: String,
            trim: true,
            default: "Faculty"
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;