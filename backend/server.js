require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");


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

app.get("/", (req, res) => {
    res.send("SmartAttend AI Backend is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});