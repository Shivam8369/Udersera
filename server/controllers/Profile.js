const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");
const RatingAndReview = require("../models/RatingAndReview");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { keyExists, getKey, setKey } = require("../utils/redisHelper");

// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      firstName,
      lastName,
      gender = "",
    } = req.body;
    const id = req.user.id;

    // Find the profile by id
    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    // Update the profile fields
    userDetails.firstName = firstName || userDetails.firstName;
    userDetails.lastName = lastName || userDetails.lastName;
    profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
    profile.about = about || profile.about;
    profile.gender = gender || profile.gender;
    profile.contactNumber = contactNumber || profile.contactNumber;

    // Save the updated profile
    await profile.save();
    await userDetails.save();
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    // TODO: Find More on Job Schedule
    // const job = schedule.scheduleJob("10 * * * * *", function () {
    // 	console.log("The answer to life, the universe, and everything!");
    // });
    // console.log(job);
    const id = req.user.id;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Delete Associated Profile with the User
    await Profile.findByIdAndDelete({ _id: user.additionalDetails });
    // TODO: Unenroll User From All the Enrolled Courses
    // Now Delete User
    await User.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User Cannot be deleted successfully",
      error: error.message,
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const enrolledCourses = await User.findById(id)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
        },
      })
      .populate("courseProgress")
      .exec();
    // console.log(enrolledCourses);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: enrolledCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const image = req.files?.displayPicture;

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME
    );

    console.log(uploadDetails);

    const updatedImage = await User.findByIdAndUpdate(
      { _id: id },
      { image: uploadDetails.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Fetch courses by instructor ID
    const courses = await Course.find({ instructor: instructorId });

    // Extract course details
    const courseDetails = courses.map((course) => {
      const totalStudents = course?.studentsEnrolled?.length || 0;
      const totalRevenue = (course?.price || 0) * totalStudents;

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudents,
        totalRevenue,
      };
    });

    // Send response with course details
    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    // Handle errors and send response
    console.error("Error fetching instructor dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAdminDashboardStats = async (req, res) => {
  try {
    // Get total number of students and instructors

    const cacheKey = "adminDashboardStats";

    // Check if the dashboard stats data exists in Redis
    if (await keyExists(cacheKey)) {
      const cachedData = await getKey(cacheKey);
      return res.status(200).json({
        success: true,
        message: "Admin dashboard stats fetched from Redis cache ✅",
        data: JSON.parse(cachedData),
      });
    }

    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$accountType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert userStats array to object for easier access
    const userCounts = userStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});


    // Calculate total revenue
    const totalRevenue = await Course.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "studentsEnrolled",
          foreignField: "_id",
          as: "enrolledStudents",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $multiply: ["$price", { $size: "$studentsEnrolled" }] },
          },
        },
      },
    ]);

    // Get courses count by category
    const coursesByCategory = await Category.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "courses",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $project: {
          name: 1,
          courseCount: { $size: "$courseDetails" },
        },
      },
    ]);


    // Get top rated courses (top 5)
    const topRatedCourses = await Course.aggregate([
      {
        $lookup: {
          from: "ratingandreviews",
          localField: "ratingAndReviews",
          foreignField: "_id",
          as: "ratings",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "instructor",
          foreignField: "_id",
          as: "instructorDetails",
        },
      },
      {
        $project: {
          courseName: 1,
          courseDescription: 1,
          "instructorDetails.firstName": 1,
          "instructorDetails.lastName": 1,
          averageRating: {
            $avg: "$ratings.rating",
          },
          totalStudents: { $size: "$studentsEnrolled" },
          price: 1,
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Get additional metrics
    const additionalMetrics = await Promise.all([
      // Total number of courses
      Course.countDocuments(),
      // Total number of published courses
      Course.countDocuments({ status: "Published" }),
      // Total number of reviews
      RatingAndReview.countDocuments(),
      // Average rating across all courses
      RatingAndReview.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]),
    ]);

    const dashboardStats = {
      users: {
        totalStudents: userCounts.Student || 0,
        totalInstructors: userCounts.Instructor || 0,
        totalAdmins: userCounts.Admin || 0,
      },
      courses: {
        total: additionalMetrics[0],
        published: additionalMetrics[1],
        categoryWise: coursesByCategory,
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
      },
      ratings: {
        totalReviews: additionalMetrics[2],
        averageRating: additionalMetrics[3][0]?.averageRating || 0,
        topRatedCourses,
      },
    };
    await setKey(cacheKey, JSON.stringify(dashboardStats), 600);
    
    return res.status(200).json({
      success: true,
      message: "Admin dashboard stats retrieved successfully",
      data: dashboardStats,
    });
  } catch (error) {
    console.error("Error in getAdminDashboardStats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve admin dashboard stats",
      error: error.message,
    });
  }
};
