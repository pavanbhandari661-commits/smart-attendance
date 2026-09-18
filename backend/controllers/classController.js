const Class = require("../models/Class");

// Create a new class
const createClass = async (req, res) => {
    try {
        const { name, department, year, division, semester } = req.body;

        const existingClass = await Class.findOne({
            name,
            department,
            year,
            division,
            semester
        });

        if (existingClass) {
            return res.status(409).json({
                success: false,
                message: "Class already exists"
            });
        }

        const newClass = await Class.create({
            name,
            department,
            year,
            division,
            semester
        });

        res.status(201).json({
            success: true,
            message: "Class created successfully",
            class: newClass
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create class",
            error: error.message
        });
    }
};


// Get all classes
const getClasses = async (req, res) => {
    try {
        const classes = await Class.find().sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: classes.length,
            classes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch classes",
            error: error.message
        });
    }
};


// Get class by ID
const getClassById = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.status(200).json({
            success: true,
            class: classData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch class",
            error: error.message
        });
    }
};


// Update class
const updateClass = async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Class updated successfully",
            class: updatedClass
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update class",
            error: error.message
        });
    }
};


// Delete class
const deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(
            req.params.id
        );

        if (!deletedClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Class deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete class",
            error: error.message
        });
    }
};


module.exports = {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass
};