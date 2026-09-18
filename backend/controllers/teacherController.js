const Teacher = require("../models/Teacher");
const User = require("../models/User");

// Create a teacher
const createTeacher = async (req, res) => {
    try {
        const {
            teacherId,
            name,
            email,
            department,
            designation,
            userId
        } = req.body;

        // Check duplicate teacher ID
        const existingTeacherId = await Teacher.findOne({ teacherId });

        if (existingTeacherId) {
            return res.status(409).json({
                success: false,
                message: "Teacher ID already exists"
            });
        }

        // Check duplicate email
        const existingTeacherEmail = await Teacher.findOne({ email });

        if (existingTeacherEmail) {
            return res.status(409).json({
                success: false,
                message: "Teacher email already exists"
            });
        }

        // If userId is provided, verify the User exists
        if (userId) {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            if (user.role !== "teacher") {
                return res.status(400).json({
                    success: false,
                    message: "User must have teacher role"
                });
            }
        }

        const teacher = await Teacher.create({
            teacherId,
            name,
            email,
            department,
            designation,
            userId: userId || null
        });

        res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create teacher",
            error: error.message
        });
    }
};


// Get all teachers
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .populate("userId", "name email role")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: teachers.length,
            teachers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch teachers",
            error: error.message
        });
    }
};


// Get teacher by ID
const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id)
            .populate("userId", "name email role");

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.status(200).json({
            success: true,
            teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch teacher",
            error: error.message
        });
    }
};


// Update teacher
const updateTeacher = async (req, res) => {
    try {
        const {
            teacherId,
            name,
            email,
            department,
            designation,
            userId
        } = req.body;

        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        // Check duplicate teacher ID
        const duplicateId = await Teacher.findOne({
            teacherId,
            _id: { $ne: req.params.id }
        });

        if (duplicateId) {
            return res.status(409).json({
                success: false,
                message: "Teacher ID already exists"
            });
        }

        // Check duplicate email
        const duplicateEmail = await Teacher.findOne({
            email,
            _id: { $ne: req.params.id }
        });

        if (duplicateEmail) {
            return res.status(409).json({
                success: false,
                message: "Teacher email already exists"
            });
        }

        // Verify user if provided
        if (userId) {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            if (user.role !== "teacher") {
                return res.status(400).json({
                    success: false,
                    message: "User must have teacher role"
                });
            }
        }

        teacher.teacherId = teacherId;
        teacher.name = name;
        teacher.email = email;
        teacher.department = department;
        teacher.designation = designation;
        teacher.userId = userId || null;

        await teacher.save();

        res.status(200).json({
            success: true,
            message: "Teacher updated successfully",
            teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update teacher",
            error: error.message
        });
    }
};


// Delete teacher
const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(
            req.params.id
        );

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Teacher deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete teacher",
            error: error.message
        });
    }
};


module.exports = {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
};