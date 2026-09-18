const Subject = require("../models/Subject");
const Class = require("../models/Class");

// Create a new subject
const createSubject = async (req, res) => {
    try {
        const {
            name,
            code,
            department,
            semester,
            classId
        } = req.body;

        // Check whether the class exists
        const classExists = await Class.findById(classId);

        if (!classExists) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        // Check for duplicate subject in the same class
        const existingSubject = await Subject.findOne({
            code,
            classId
        });

        if (existingSubject) {
            return res.status(409).json({
                success: false,
                message: "Subject already exists for this class"
            });
        }

        const subject = await Subject.create({
            name,
            code,
            department,
            semester,
            classId
        });

        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create subject",
            error: error.message
        });
    }
};


// Get all subjects
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find()
            .populate("classId", "name department year division semester")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: subjects.length,
            subjects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch subjects",
            error: error.message
        });
    }
};


// Get subject by ID
const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate(
                "classId",
                "name department year division semester"
            );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch subject",
            error: error.message
        });
    }
};


// Update subject
const updateSubject = async (req, res) => {
    try {
        const {
            name,
            code,
            department,
            semester,
            classId
        } = req.body;

        // Check whether the new class exists
        const classExists = await Class.findById(classId);

        if (!classExists) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            {
                name,
                code,
                department,
                semester,
                classId
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update subject",
            error: error.message
        });
    }
};


// Delete subject
const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(
            req.params.id
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subject deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete subject",
            error: error.message
        });
    }
};


module.exports = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
};