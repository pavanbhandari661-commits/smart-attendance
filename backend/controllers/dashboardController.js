const Class = require("../models/Class");
const Student = require("../models/Student");
const AttendanceSession = require("../models/AttendanceSession");
const AttendanceRecord = require("../models/AttendanceRecord");

const getDashboardStats = async (req, res) => {
    try {
        const totalClasses = await Class.countDocuments();
        const totalStudents = await Student.countDocuments();

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todaySessions = await AttendanceSession.countDocuments({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        const attendanceRecords = await AttendanceRecord.find();

        let attendanceRate = 0;

        if (attendanceRecords.length > 0) {
            const presentRecords = attendanceRecords.filter(
                (record) => record.status === "PRESENT"
            );

            attendanceRate =
                (presentRecords.length / attendanceRecords.length) * 100;
        }

        res.status(200).json({
            success: true,
            stats: {
                totalClasses,
                totalStudents,
                todaySessions,
                attendanceRate: Number(attendanceRate.toFixed(1))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};