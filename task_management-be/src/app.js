const express = require("express");
const cors = require("cors");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../src/config/swagger");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
