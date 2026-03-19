const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/UserRoute");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/mydb")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("Database Error:", err));
 
// Routes
app.use("/api/users", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server Start
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});