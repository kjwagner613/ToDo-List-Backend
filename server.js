// npm
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const PORT = process.env.PORT || 3000;

// Import routers
const authRouter = require("./controllers/auth");
// const testJwtRouter = require("./controllers/test-jwt");
const usersRouter = require("./controllers/users");
const tasksRouter = require("./controllers/tasks");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit process if the DB connection fails
  });


// Middleware
app.use(cors());
app.use(express.json());
app.use(logger("dev"));

// Routes
app.use("/auth", authRouter);
// app.use("/test-jwt", testJwtRouter);
app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

// Start the server and listen on the specified PORT from the environment or 3000 locally
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

