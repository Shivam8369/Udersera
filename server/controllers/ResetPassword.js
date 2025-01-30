const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { passwordUpdate } = require("../mail/templates/passwordUpdate");
require("dotenv").config();

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }
    const token = crypto.randomBytes(20).toString("hex"); // creating a random token 

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 10 * 60 * 1000, // 5 min validity
      },
      { new: true }
    );
    console.log("DETAILS", updatedDetails);

    // const url = `https://studynotion.fun/update-password/${token}`;
    // const url = `http://localhost:3000/update-password/${token}`;
    const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/update-password/${token}`;


    await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );

    res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // const id = req.user?.id;
    const user = await User.findOne({ token });
    console.log(user.firstName);
    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      });
    }
    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }

    //check if expired token
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    );

    await mailSender(
      user.email,
      `Password Updated Successfully`,
      passwordUpdate(user.email, user.firstName)
    );

    await User.findOneAndUpdate(
      { token },
      {
        password: encryptedPassword,
        token: null, // Remove token after successful reset
        resetPasswordExpires: null, // Clear expiry time
      },
      { new: true }
    );
    res.json({
      success: true,
      message: `Password Reset Successful`,
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    });
  }
};
