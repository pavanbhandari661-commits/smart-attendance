const express = require("express");

const {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
} = require("../controllers/teacherController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateTeacher = require("../middleware/teacherValidation");

const router = express.Router();

// View all teachers
router.get(
    "/",
    protect,
    authorize("admin", "teacher"),
    getTeachers
);

// Create teacher - admin only
router.post(
    "/",
    protect,
    authorize("admin"),
    validateTeacher,
    createTeacher
);

// View one teacher
router.get(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    getTeacherById
);

// Update teacher - admin only
router.put(
    "/:id",
    protect,
    authorize("admin"),
    validateTeacher,
    updateTeacher
);

// Delete teacher - admin only
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteTeacher
);

module.exports = router;