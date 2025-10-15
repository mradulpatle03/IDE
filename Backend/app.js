const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
require('dotenv').config();

const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const connectDB = require('./config/db');
const sessionRouter = require("./routes/sessionRoute");
const questionRoute = require("./routes/questionRoute");
const projectRouter = require("./routes/projectRoute");
const leetcodeRouter = require("./routes/dsaRoutes");
const roadMapRouter = require("./routes/roadmapRoutes");
const chatRouter = require('./routes/chatbotRoute')

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/projects', projectRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/question", questionRoute);
app.use('/api/v1/dsa',leetcodeRouter);
app.use('/api/v1/roadmap',roadMapRouter);
app.use('/api/v1/chat',chatRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(PORT, () => console.log("Server is running on port",PORT));

// error handler
app.use(function (err, req, res, next) {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


module.exports = app;