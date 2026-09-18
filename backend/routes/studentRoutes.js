const express = require("express");
const {
    getStudents,
    createStudent,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

const router = express.Router();

// GET all students
router.get("/", getStudents);

// POST create a student
router.post("/", createStudent);

// GET one student
router.get("/:id", getStudentById);

// PUT update a student
router.put("/:id", updateStudent);

// DELETE a student
router.delete("/:id", deleteStudent);

module.exports = router;