const express = require("express");

const {
    getStudents,
    createStudent,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

const validateStudent = require("../middleware/studentValidation");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// View all students
router.get(
    "/",
    protect,
    authorize("admin", "teacher"),
    getStudents
);

// Create student
router.post(
    "/",
    protect,
    authorize("admin", "teacher"),
    validateStudent,
    createStudent
);

// View one student
router.get(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    getStudentById
);

// Update student
router.put(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    validateStudent,
    updateStudent
);

// Delete student - admin only
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteStudent
);

module.exports = router;