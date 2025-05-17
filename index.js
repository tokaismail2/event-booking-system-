const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const ApiError = require("./utils/apiError");
const errorHandler = require("./middlewares/errorHandler");
require("./utils/responseWrapper.js");
bodyParser.urlencoded({ extended: false });

const cors = require("cors");
const morgan = require("morgan");




// Express app
const app = express();


// Middlewares - before routes
// app.use(cors({
//     origin: `${process.env.ENDPOINT_AUTH}`, 
//     credentials: true //for cookies
// }));
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(bodyParser.json());
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode: ${process.env.NODE_ENV}`);
} else if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
    console.log(`mode: ${process.env.NODE_ENV}`);
}


// Routes using
const adminRoutes = require("./routes/adminRoutes");
const userRoute = require("./routes/userRoutes");
const bookingRoute = require("./routes/bookingRoute");
// Routes import
app.use(express.json()); // parsing JSON
app.use('/api/users' , userRoute );
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoute);







  


// Handling invalid routes
app.use((req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server`, 400));
});

// Global error handling middleware for express
app.use(errorHandler);


// Database connection
const db = require("./config/db");

// Server configuration
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Events => listen on events => callback Fn(err)
// Handle rejections outside async functions
process.on("unhandledRejection", (err) => {
    console.log(`Unhandled Rejection: ${err.message}`);
    console.log(`MongoDB Connection Error: ${err.name} | ${err.message}`);
    server.close(() => {
        // Stop pending processes
        console.log("Server closed");
        process.exit(1);
    }); // close server - to prevent memory leak
});