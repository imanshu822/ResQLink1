const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();

const authRouter = require("./routes/authRoute");
const incidentRoute = require("./routes/incidentRoute");

const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const PORT = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Connect to the database
dbConnect();

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/user", authRouter);
app.use("/api/incident", incidentRoute);

// 404 Not Found Middleware
app.use(notFound);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
