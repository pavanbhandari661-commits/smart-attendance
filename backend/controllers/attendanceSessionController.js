const AttendanceSession = require("../models/AttendanceSession");
const TeachingAssignment = require("../models/TeachingAssignment");
const Teacher = require("../models/Teacher");
const Class = require("../models/Class");
const Subject = require("../models/Subject");

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

    // Handle both populated and unpopulated teacherId
    const sessionTeacherId = session.teacherId?._id
        ? session.teacherId._id.toString()
        : session.teacherId?.toString();

    // Check whether this teacher owns the session
    return sessionTeacherId === teacher._id.toString();
};


// Start attendance session
const startAttendanceSession = async (req, res) => {
    try {
        const {
            teacherId,
            classId,
            subjectId,
            method
        } = req.body;

        // Find the teacher record
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        // Make sure the logged-in user actually belongs to this teacher
        if (
            !teacher.userId ||
            teacher.userId.toString() !== req.user.userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to start attendance for this teacher"
            });
        }

        // Check class exists
        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        // Check subject exists
        const subject = await Subject.findById(subjectId);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        // Make sure subject belongs to selected class
        if (subject.classId.toString() !== classId) {
            return res.status(400).json({
                success: false,
                message: "Subject does not belong to the selected class"
            });
        }

        // Check teacher is assigned to this class and subject
        const assignment = await TeachingAssignment.findOne({
            teacherId,
            classId,
            subjectId
        });

        if (!assignment) {
            return res.status(403).json({
                success: false,
                message: "Teacher is not assigned to this class and subject"
            });
        }

        // Prevent multiple active sessions for same class and subject
        const activeSession = await AttendanceSession.findOne({
            classId,
            subjectId,
            status: "ACTIVE"
        });

        if (activeSession) {
            return res.status(409).json({
                success: false,
                message: "An active attendance session already exists"
            });
        }

        const now = new Date();

        const session = await AttendanceSession.create({
            teacherId,
            classId,
            subjectId,
            date: now,
            startTime: now,
            method: method || "FACE",
            status: "ACTIVE"
        });

        res.status(201).json({
            success: true,
            message: "Attendance session started successfully",
            session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to start attendance session",
            error: error.message
        });
    }
};


// Get all attendance sessions
const getAttendanceSessions = async (req, res) => {
    try {
        let query = {};

        // Teachers can only see their own attendance sessions
        if (req.user.role !== "admin") {
            const teacher = await Teacher.findOne({
                userId: req.user.userId
            });

            if (!teacher) {
                return res.status(403).json({
                    success: false,
                    message: "Teacher account is not linked"
                });
            }

            query.teacherId = teacher._id;
        }

        const sessions = await AttendanceSession.find(query)
            .populate(
                "teacherId",
                "teacherId name department designation"
            )
            .populate(
                "classId",
                "name department year division semester"
            )
            .populate(
                "subjectId",
                "name code department semester"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: sessions.length,
            sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch attendance sessions",
            error: error.message
        });
    }
};


// Get one attendance session
const getAttendanceSessionById = async (req, res) => {
    try {
        const session = await AttendanceSession.findById(
            req.params.id
        )
            .populate(
                "teacherId",
                "teacherId name department designation"
            )
            .populate(
                "classId",
                "name department year division semester"
            )
            .populate(
                "subjectId",
                "name code department semester"
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

        res.status(200).json({
            success: true,
            session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch attendance session",
            error: error.message
        });
    }
};


// End attendance session
const endAttendanceSession = async (req, res) => {
    try {
        const session = await AttendanceSession.findById(
            req.params.id
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
                message: "You are not authorized to end this attendance session"
            });
        }

        if (session.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Attendance session is not active"
            });
        }

        session.endTime = new Date();
        session.status = "REVIEW";

        await session.save();

        res.status(200).json({
            success: true,
            message: "Attendance session ended successfully",
            session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to end attendance session",
            error: error.message
        });
    }
};


// Confirm reviewed attendance and mark the session as COMPLETED
const confirmAttendanceSession = async (req, res) => {
    try {
        // Get the attendance session ID from the URL
        const { id } = req.params;

        // Find the attendance session in MongoDB
        const session = await AttendanceSession.findById(id);

        // Check whether the session exists
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
                message: "You are not authorized to confirm this attendance session"
            });
        }

        // Attendance can be confirmed only after teacher review
        if (session.status !== "REVIEW") {
            return res.status(400).json({
                success: false,
                message: "Only sessions in REVIEW status can be confirmed"
            });
        }

        // Mark the reviewed attendance as final
        session.status = "COMPLETED";

        // Save the updated session to MongoDB
        await session.save();

        // Send the successful response
        res.status(200).json({
            success: true,
            message: "Attendance confirmed successfully",
            session
        });
    } catch (error) {
        // Handle unexpected server/database errors
        res.status(500).json({
            success: false,
            message: "Failed to confirm attendance",
            error: error.message
        });
    }
};


// Export all attendance session controller functions
module.exports = {
    startAttendanceSession,
    getAttendanceSessions,
    getAttendanceSessionById,
    endAttendanceSession,
    confirmAttendanceSession
};