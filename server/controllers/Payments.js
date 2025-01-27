const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccess } = require("../mail/templates/paymentSuccess");
const mongoose = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
// import { paymentSuccess } from "../mail/templates/paymentSuccess";

exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body; // Get courses from the request body
    const userId = req.user.id; // Get the userId from req.user

    // Check if courses array is provided
    if (!courses || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course IDs",
      });
    }

    let totalAmount = 0; // Initialize total amount to 0

    // Loop through the courses and validate them
    for (const course_id of courses) {
      const course = await Course.findById(course_id); // Find the course by ID

      // Check if course exists
      if (!course) {
        return res.status(404).json({
          success: false,
          message: `Course with ID: ${course_id} not found`,
        });
      }

      // Check if the user is already enrolled in the course
      const uid = userId;
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: `User is already enrolled in the course: ${course.title}`,
        });
      }

      totalAmount += course.price; // Sum up the course price
    }

    // Create payment options for Razorpay
    const options = {
      amount: totalAmount * 100, // Convert to paise (smallest unit of currency)
      currency: "INR",
      receipt: Math.random(Date.now()).toString(), // Random receipt for identification
    };

    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log("Payment Response:", paymentResponse);

    // Return payment details in the response
    return res.status(200).json({
      success: true,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      data: paymentResponse,
    });
  } catch (error) {
    console.error("Payment Error:", error); // Log the error
    return res.status(500).json({
      success: false,
      message: "An error occurred during payment processing",
      error: error.message,
    });
  }
};

//verify the signature
exports.verifySignature = async (req, res) => {
  //get the payment details
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const { courses } = req.body;
  const userId = req.user.id;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Payment details are incomplete",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  try {
    //verify the signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      await enrollStudents(courses, userId, res);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Payment Failed",
    });
  }
};

// Function to enroll a user in multiple courses, update user and course records, track progress, and send confirmation email.
const enrollStudents = async (courses, userId, res) => {
  // Validate if courses and userId are provided
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid course IDs and user ID.",
    });
  }

  // Loop through each course to enroll the student
  for (const courseId of Object.values(courses)) {
    try {
      // Add the user to the course's enrolled students list
      const enrolledCourse = await Course.findByIdAndUpdate(
        courseId,
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      // Check if the course exists
      if (!enrolledCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // Create a new course progress record for the student
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userID: userId,
        completedVideos: [],
      });

      // Add the course and course progress to the student's profile
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      // Send enrollment confirmation email to the student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName}`
        )
      );

      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      console.error("Error during enrollment:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: "Successfully enrolled in courses",
  });
};

//send email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { amount, paymentId, orderId } = req.body;
  const userId = req.user.id;
  if (!amount || !paymentId) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid payment details",
    });
  }
  try {
    const enrolledStudent = await User.findById(userId);
    console.log("hello jee");
    await mailSender(
      enrolledStudent.email,
      `Udersera Payment successful`,
      paymentSuccess(
        amount / 100,
        paymentId,
        orderId,
        enrolledStudent.firstName,
        enrolledStudent.lastName
      )
    );

    return res.status(200).json({
      success: true,
      message: "Email Send Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
