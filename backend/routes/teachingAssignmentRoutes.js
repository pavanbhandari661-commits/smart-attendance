const express = require("express");

const {
    createTeachingAssignment,
    getTeachingAssignments,
    getTeachingAssignmentById,
    deleteTeachingAssignment
} = require("../controllers/teachingAssignmentController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateTeachingAssignment = require("../middleware/teachingAssignmentValidation");

const router = express.Router();

// View all teaching assignments
router.get(
    "/",
    protect,
    authorize("admin", "teacher"),
    getTeachingAssignments
);

// Create teaching assignment - admin only
router.post(
    "/",
    protect,
    authorize("admin"),
    validateTeachingAssignment,
    createTeachingAssignment
);

// View one teaching assignment
router.get(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    getTeachingAssignmentById
);

// Delete teaching assignment - admin only
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteTeachingAssignment
);

module.exports = router;