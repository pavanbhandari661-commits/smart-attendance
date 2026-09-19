const express = require("express");

const {
    markAttendance,
    getAttendanceRecordsBySession,
    getAttendanceReview,
    updateAttendance,
    upsertAttendance
} = require("../controllers/attendanceRecordController");


const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateAttendanceRecord = require("../middleware/attendanceRecordValidation");

const router = express.Router();

// Mark attendance for a student
router.post(
    "/",
    protect,
    authorize("admin", "teacher"),
    validateAttendanceRecord,
    markAttendance
);

// Get all attendance records for a session
router.get(
    "/session/:sessionId",
    protect,
    authorize("admin", "teacher"),
    getAttendanceRecordsBySession
);

// Get attendance review for a session
router.get(
    "/session/:sessionId/review",
    protect,
    authorize("admin", "teacher"),
    getAttendanceReview
);

// Upsert attendance during the REVIEW stage

router.put(
    "/review",
    protect,
    authorize("admin", "teacher"),
    validateAttendanceRecord,
    upsertAttendance
);

// Update attendance during the REVIEW stage
router.put(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    updateAttendance
);



module.exports = router;