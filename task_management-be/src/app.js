const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users", userRoutes);

module.exports = app;
