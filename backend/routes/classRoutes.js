const express = require("express");

const {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass
} = require("../controllers/classController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateClass = require("../middleware/classValidation");

const router = express.Router();

// View all classes
router.get(
    "/",
    protect,
    authorize("admin", "teacher"),
    getClasses
);

// Create class
router.post(
    "/",
    protect,
    authorize("admin", "teacher"),
    validateClass,
    createClass
);

// View one class
router.get(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    getClassById
);

// Update class
router.put(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    validateClass,
    updateClass
);

// Delete class - admin only
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteClass
);

module.exports = router;