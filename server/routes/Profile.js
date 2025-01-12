// Import required modules
const express = require("express");
const router = express.Router();

// Import middlewares
const { auth, isInstructor } = require("../middlewares/auth");

// Import controller functions
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

// Route to delete user profile
router.delete("/deleteProfile", auth, deleteAccount);

// Route to update user profile details
router.put("/updateProfile", auth, updateProfile);

// Route to get all user details
router.get("/getUserDetails", auth, getAllUserDetails);

// Route to get courses enrolled by the user
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

// Route to update the user's display picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

// Route to get instructor dashboard details (only for instructors)
router.get("/getInstructorDashboardDetails", auth, isInstructor, instructorDashboard);

module.exports = router;
