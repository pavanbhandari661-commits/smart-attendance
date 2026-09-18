require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const teachingAssignmentRoutes = require("./routes/teachingAssignmentRoutes");


const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware to read JSON data
app.use(express.json());

// Student routes
app.use("/api/students", studentRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// Class routes
app.use("/api/classes", classRoutes);

// Subject routes
app.use("/api/subjects", subjectRoutes);

// Teacher routes
app.use("/api/teachers", teacherRoutes);

app.get("/", (req, res) => {
    res.send("SmartAttend AI Backend is running!");
});


// Teaching Assignment routes
app.use(
    "/api/teaching-assignments",
    teachingAssignmentRoutes
);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});