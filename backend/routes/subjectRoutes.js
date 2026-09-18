const express = require("express");

const {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateSubject = require("../middleware/subjectValidation");

const router = express.Router();

// View all subjects
router.get(
    "/",
    protect,
    authorize("admin", "teacher"),
    getSubjects
);

// Create subject
router.post(
    "/",
    protect,
    authorize("admin", "teacher"),
    validateSubject,
    createSubject
);

// View one subject
router.get(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    getSubjectById
);

// Update subject
router.put(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    validateSubject,
    updateSubject
);

// Delete subject - admin only
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteSubject
);

module.exports = router;