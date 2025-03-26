
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const PORT = process.env.PORT || 3000;


const authRouter = require("./controllers/auth");

const usersRouter = require("./controllers/users");
const tasksRouter = require("./controllers/tasks");


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); 
  });



app.use(cors());
app.use(express.json());
app.use(logger("dev"));


app.use("/auth", authRouter);

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});