const express = require("express");

const {
    startAttendanceSession,
    getAttendanceSessions,
    getAttendanceSessionById,
    endAttendanceSession,
    confirmAttendanceSession
} = require("../controllers/attendanceSessionController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateAttendanceSession = require("../middleware/attendanceSessionValidation");

const router = express.Router();

// View all attendance sessions
router.get(
    "/",
    protect,
    authorize("admin", "teacher"),
    getAttendanceSessions
);

// Start a new attendance session
router.post(
    "/",
    protect,
    authorize("admin", "teacher"),
    validateAttendanceSession,
    startAttendanceSession
);

// View one attendance session
router.get(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    getAttendanceSessionById
);

// End an active session and move it to REVIEW
router.put(
    "/:id/end",
    protect,
    authorize("admin", "teacher"),
    endAttendanceSession
);

// Confirm reviewed attendance and move it to COMPLETED
router.put(
    "/:id/confirm",
    protect,
    authorize("admin", "teacher"),
    confirmAttendanceSession
);

module.exports = router;