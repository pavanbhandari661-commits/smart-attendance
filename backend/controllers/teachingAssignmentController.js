const TeachingAssignment = require("../models/TeachingAssignment");
const Teacher = require("../models/Teacher");
const Class = require("../models/Class");
const Subject = require("../models/Subject");

// Create teaching assignment
const createTeachingAssignment = async (req, res) => {
    try {
        const {
            teacherId,
            classId,
            subjectId
        } = req.body;

        // Check teacher exists
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        // Check class exists
        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        // Check subject exists
        const subject = await Subject.findById(subjectId);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        // Make sure subject belongs to selected class
        if (subject.classId.toString() !== classId) {
            return res.status(400).json({
                success: false,
                message: "Subject does not belong to the selected class"
            });
        }

        // Check duplicate assignment
        const existingAssignment =
            await TeachingAssignment.findOne({
                teacherId,
                classId,
                subjectId
            });

        if (existingAssignment) {
            return res.status(409).json({
                success: false,
                message: "Teaching assignment already exists"
            });
        }

        // Create assignment
        const assignment = await TeachingAssignment.create({
            teacherId,
            classId,
            subjectId
        });

        res.status(201).json({
            success: true,
            message: "Teaching assignment created successfully",
            assignment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create teaching assignment",
            error: error.message
        });
    }
};


// Get all teaching assignments
const getTeachingAssignments = async (req, res) => {
    try {
        const assignments = await TeachingAssignment.find()
            .populate(
                "teacherId",
                "teacherId name email department designation"
            )
            .populate(
                "classId",
                "name department year division semester"
            )
            .populate(
                "subjectId",
                "name code department semester"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: assignments.length,
            assignments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch teaching assignments",
            error: error.message
        });
    }
};


// Get assignment by ID
const getTeachingAssignmentById = async (req, res) => {
    try {
        const assignment =
            await TeachingAssignment.findById(req.params.id)
                .populate(
                    "teacherId",
                    "teacherId name email department designation"
                )
                .populate(
                    "classId",
                    "name department year division semester"
                )
                .populate(
                    "subjectId",
                    "name code department semester"
                );

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Teaching assignment not found"
            });
        }

        res.status(200).json({
            success: true,
            assignment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch teaching assignment",
            error: error.message
        });
    }
};


// Delete assignment
const deleteTeachingAssignment = async (req, res) => {
    try {
        const assignment =
            await TeachingAssignment.findByIdAndDelete(
                req.params.id
            );

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Teaching assignment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Teaching assignment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete teaching assignment",
            error: error.message
        });
    }
};


module.exports = {
    createTeachingAssignment,
    getTeachingAssignments,
    getTeachingAssignmentById,
    deleteTeachingAssignment
};