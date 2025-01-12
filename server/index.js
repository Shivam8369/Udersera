// Import required modules and configurations
const express = require("express");
const app = express(); 
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Import routes
const userRoutes = require("./routes/User");
const paymentRoutes = require("./routes/Payments");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/ContactUs");

// Import database and cloudinary configurations
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Set the port for the server
const PORT = process.env.PORT || 5000;

// Connect to the database
database.connect();

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Configure CORS
const whitelist = process.env.CORS_ORIGIN
  ? JSON.parse(process.env.CORS_ORIGIN)
  : ["*"]; // Allow all origins if no whitelist is provided

app.use(
  cors({
    origin: whitelist, // Enable CORS for specific origins
    credentials: true, // Allow credentials (cookies)
    maxAge: 14400, // Cache pre-flight requests for 4 hours
  })
);

// Configure file upload settings
app.use(
  fileUpload({
    useTempFiles: true, // Use temporary files during upload
    tempFileDir: "/tmp", // Directory for temp files
  })
);

// Initialize Cloudinary connection
cloudinaryConnect();

// Define API routes
app.use("/api/v1/auth", userRoutes); // Authentication and user routes
app.use("/api/v1/payment", paymentRoutes); // Payment-related routes
app.use("/api/v1/profile", profileRoutes); // Profile management routes
app.use("/api/v1/course", courseRoutes); // Course management routes
app.use("/api/v1/contact", contactRoutes); // Contact form routes

// Define the default route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API", // Response for the root route
  });
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log when the server starts
});
