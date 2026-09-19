const AttendanceRecord = require("../models/AttendanceRecord");
const AttendanceSession = require("../models/AttendanceSession");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");



// Check whether the logged-in user owns the attendance session
const verifySessionAccess = async (session, user) => {
    // Admins can access all attendance sessions
    if (user.role === "admin") {
        return true;
    }

    // Find the teacher linked to the logged-in user
    const teacher = await Teacher.findOne({
        userId: user.userId
    });

    if (!teacher) {
        return false;
    }

    // Check whether this teacher owns the session
    return (
        session.teacherId &&
        session.teacherId.toString() === teacher._id.toString()
    );
};


// Mark attendance for one student
const markAttendance = async (req, res) => {
    try {
        const {
            sessionId,
            studentId,
            status,
            method,
            confidence
        } = req.body;

        // Check session
        const session = await AttendanceSession.findById(
            sessionId
        );

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Attendance session not found"
            });
        }

        // Verify that the logged-in user can access this session
const hasAccess = await verifySessionAccess(
    session,
    req.user
);

if (!hasAccess) {
    return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this attendance session"
    });
}

        // Attendance can only be marked for an active session
       if (!["ACTIVE", "REVIEW"].includes(session.status)) {
    return res.status(400).json({
        success: false,
        message: "Attendance session is not available for attendance changes"
    });
}

        // Check student
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Student must belong to the session's class
        if (
            student.classId &&
            student.classId.toString() !== session.classId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "Student does not belong to this class"
            });
        }

        // Check whether attendance already exists
        const existingRecord = await AttendanceRecord.findOne({
            sessionId,
            studentId
        });

        if (existingRecord) {
            return res.status(409).json({
                success: false,
                message: "Attendance already marked for this student",
                record: existingRecord
            });
        }

        const record = await AttendanceRecord.create({
            sessionId,
            studentId,
            status,
            method: method || "MANUAL",
            confidence:
                confidence !== undefined
                    ? confidence
                    : null,
            markedBy: req.user.userId
        });

        const populatedRecord =
            await AttendanceRecord.findById(record._id)
                .populate(
                    "studentId",
                    "studentId rollNumber name email department year division semester"
                )
                .populate(
                    "sessionId",
                    "date startTime endTime status method"
                )
                .populate(
                    "markedBy",
                    "name email role"
                );

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            record: populatedRecord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
            error: error.message
        });
    }
};

// Get all attendance records for a session
const getAttendanceRecordsBySession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await AttendanceSession.findById(
            sessionId
        );

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Attendance session not found"
            });
        }

        // Verify that the logged-in user can access this session
const hasAccess = await verifySessionAccess(
    session,
    req.user
);

if (!hasAccess) {
    return res.status(403).json({
        success: false,
        message: "You are not authorized to view this attendance session"
    });
}

        const records = await AttendanceRecord.find({
            sessionId
        })
            .populate(
                "studentId",
                "studentId rollNumber name email department year division semester"
            )
            .populate(
                "markedBy",
                "name email role"
            )
            .sort({
                markedAt: 1
            });

        res.status(200).json({
            success: true,
            count: records.length,
            records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch attendance records",
            error: error.message
        });
    }
};



const getAttendanceReview = async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Find session
        const session = await AttendanceSession.findById(
            sessionId
        );

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Attendance session not found"
            });
        }

        // Verify that the logged-in user can access this session
const hasAccess = await verifySessionAccess(
    session,
    req.user
);

if (!hasAccess) {
    return res.status(403).json({
        success: false,
        message: "You are not authorized to review this attendance session"
    });
}

        // Get all students belonging to the class
        const students = await Student.find({
            classId: session.classId
        })
            .select(
                "studentId rollNumber name email department year division semester"
            )
            .sort({
                rollNumber: 1
            });

        // Get already marked attendance
        const records = await AttendanceRecord.find({
            sessionId
        });

        // Convert records into a quick lookup
        const recordMap = new Map();

        records.forEach((record) => {
            recordMap.set(
                record.studentId.toString(),
                record
            );
        });

        // Build complete class attendance
        const attendance = students.map((student) => {
            const record = recordMap.get(
                student._id.toString()
            );

            return {
                student,
                status: record
                    ? record.status
                    : "ABSENT",
                method: record
                    ? record.method
                    : null,
                confidence: record
                    ? record.confidence
                    : null,
                recordId: record
                    ? record._id
                    : null,
                recordExists: !!record
            };
        });

        res.status(200).json({
            success: true,
            sessionId,
            count: attendance.length,
            attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to generate attendance review",
            error: error.message
        });
    }
};



// Update an attendance record during the review stage
const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, method } = req.body;

        // Find the attendance record
        const record = await AttendanceRecord.findById(id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found"
            });
        }

        // Find the session connected to this attendance record
        const session = await AttendanceSession.findById(record.sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Attendance session not found"
            });
        }

        // Verify that the logged-in user can access this session
const hasAccess = await verifySessionAccess(
    session,
    req.user
);

if (!hasAccess) {
    return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this attendance session"
    });
}

        // Attendance can only be corrected during REVIEW
        if (session.status !== "REVIEW") {
            return res.status(400).json({
                success: false,
                message: "Attendance can only be corrected during REVIEW"
            });
        }

        // Update the attendance status
        record.status = status;

        // Manual correction should be recorded as MANUAL
        record.method = method || "MANUAL";

        // The user making the correction
        record.markedBy = req.user.userId;

        // Update the modification time
        record.markedAt = new Date();

        await record.save();

        // Return the updated record with student/session information
        const updatedRecord = await AttendanceRecord.findById(record._id)
            .populate(
                "studentId",
                "studentId rollNumber name email department year division semester"
            )
            .populate(
                "sessionId",
                "date startTime endTime status method"
            )
            .populate(
                "markedBy",
                "name email role"
            );

        res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            record: updatedRecord
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update attendance",
            error: error.message
        });
    }
};

// Create a new attendance record or update an existing one during review
const upsertAttendance = async (req, res) => {
    try {
        const { sessionId, studentId, status, method } = req.body;

        // Verify that the attendance session exists
        const session = await AttendanceSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Attendance session not found"
            });
        }

        // Verify that the logged-in user can access this session
const hasAccess = await verifySessionAccess(
    session,
    req.user
);

if (!hasAccess) {
    return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this attendance session"
    });
}

        // Attendance corrections are allowed only during review
        if (session.status !== "REVIEW") {
            return res.status(400).json({
                success: false,
                message: "Attendance can only be changed during REVIEW"
            });
        }

        // Verify that the student exists
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Make sure the student belongs to the session's class
        if (
            student.classId &&
            student.classId.toString() !== session.classId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "Student does not belong to this class"
            });
        }

        // Find an existing attendance record for this student and session
        let record = await AttendanceRecord.findOne({
            sessionId,
            studentId
        });

        if (record) {
            // Update the existing record
            record.status = status;
            record.method = method || "MANUAL";
            record.markedBy = req.user.userId;
            record.markedAt = new Date();
        } else {
            // Create a new record if one does not exist
            record = new AttendanceRecord({
                sessionId,
                studentId,
                status,
                method: method || "MANUAL",
                markedBy: req.user.userId
            });
        }

        await record.save();

        // Return the updated record with useful related information
        const updatedRecord = await AttendanceRecord.findById(record._id)
            .populate(
                "studentId",
                "studentId rollNumber name email department year division semester"
            )
            .populate(
                "sessionId",
                "date startTime endTime status method"
            )
            .populate(
                "markedBy",
                "name email role"
            );

        res.status(200).json({
            success: true,
            message: "Attendance saved successfully",
            record: updatedRecord
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to save attendance",
            error: error.message
        });
    }
};



module.exports = {
    markAttendance,
    getAttendanceRecordsBySession,
    getAttendanceReview,
    updateAttendance,
    upsertAttendance
};