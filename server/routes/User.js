// Import the required modules
const express = require("express");
const router = express.Router();

const { login, signup, sendOtp, changePassword} = require("../controllers/Auth");
const {resetPasswordToken, resetPassword} = require("../controllers/ResetPassword");
const { auth } = require("../middlewares/auth");


                                    // Authentication routes

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Route for sending OTP to the user's email
router.post("/sendOtp", sendOtp);

// Route for Changing the password
router.post("/changepassword", auth, changePassword);


                                        //Reset password

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

module.exports = router;
