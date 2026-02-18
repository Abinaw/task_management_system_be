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
app.use("/api/v1/auth", authRoutes);

module.exports = app;
