require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("SmartAttend AI Backend is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});