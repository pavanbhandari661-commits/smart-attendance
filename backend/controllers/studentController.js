const Student = require("../models/Student");

// Get all students
// Get students with search, filters and pagination
const getStudents = async (req, res) => {
    try {
        const {
            search,
            department,
            year,
            division,
            page = 1,
            limit = 10
        } = req.query;

        let filter = {};

        // Search by name, student ID, roll number or email
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { studentId: { $regex: search, $options: "i" } },
                { rollNumber: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        // Filter by department
        if (department) {
            filter.department = department;
        }

        // Filter by year
        if (year) {
            filter.year = Number(year);
        }

        // Filter by division
        if (division) {
            filter.division = division;
        }

        // Convert pagination values to numbers
        const currentPage = Number(page);
const itemsPerPage = Number(limit);

if (
    !Number.isInteger(currentPage) ||
    currentPage < 1
) {
    return res.status(400).json({
        success: false,
        message: "Page must be a positive integer"
    });
}

if (
    !Number.isInteger(itemsPerPage) ||
    itemsPerPage < 1 ||
    itemsPerPage > 100
) {
    return res.status(400).json({
        success: false,
        message: "Limit must be an integer between 1 and 100"
    });
}

        // Calculate how many documents to skip
        const skip = (currentPage - 1) * itemsPerPage;

        // Get total number of matching students
        const totalStudents = await Student.countDocuments(filter);

        // Get students for current page
        const students = await Student.find(filter)
            .skip(skip)
            .limit(itemsPerPage);

        // Calculate total pages
        const totalPages = Math.ceil(totalStudents / itemsPerPage);

        res.status(200).json({
            success: true,
            count: students.length,
            pagination: {
                currentPage: currentPage,
                itemsPerPage: itemsPerPage,
                totalStudents: totalStudents,
                totalPages: totalPages
            },
            students: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch students",
            error: error.message
        });
    }
};

// Add a new student
const createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student: student
        });
    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];

            return res.status(409).json({
                success: false,
                message: `${duplicateField} already exists`
            });
        }

        res.status(400).json({
            success: false,
            message: "Failed to create student",
            error: error.message
        });
    }
};

// Get a single student by ID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            student: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid student ID",
            error: error.message
        });
    }
};

// Update a student
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update student",
            error: error.message
        });
    }
};

// Delete a student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete student",
            error: error.message
        });
    }
};
module.exports = {
    getStudents,
    createStudent,
    getStudentById,
    updateStudent,
    deleteStudent
};