const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      status,
      instructions,
    } = req.body;

    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnailImage;

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    console.log(thumbnailImage);
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions: instructions,
    });

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();
    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec();

    if (courseDetails.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        totalDurationInSeconds += parseInt(subSection?.timeDuration);
      });
    });

    // Convert total duration to a readable format
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
    return res.status(200).json({
      success: true,
      message: "Course fetched successfully now",
      data: { courseDetails, totalDuration },
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

// Function to get all courses of a particular instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Find all courses of the instructor
    const allCourses = await Course.find({ instructor: userId });

    // Return all courses of the instructor
    res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    // Handle any errors that occur during the fetching of the courses
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    //Delete course id from Category
    await Category.findByIdAndUpdate(course.category._id, {
      $pull: { courses: courseId },
    });

    //Delete course id from Instructor
    await User.findByIdAndUpdate(course.instructor._id, {
      $pull: { courses: courseId },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.searchCourse = async (req, res) => {
  try {
    const { searchQuery } = req.body;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Perform the search operation on multiple fields
    const courses = await Course.find({
      $or: [
        { courseName: { $regex: searchQuery, $options: "i" } },
        { courseDescription: { $regex: searchQuery, $options: "i" } },
        { tag: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .populate("instructor", "firstName lastName") // Populate instructor with only required fields
      .populate("category", "name") // Populate category with its name
      .populate("ratingAndReviews")
      .exec();

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error during course search:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.markLectureAsComplete = async (req, res) => {
  const { courseId, subSectionId, userId } = req.body;

  // Validate required fields
  if (!courseId || !subSectionId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Check if the progress entry already exists
    const progress = await CourseProgress.findOne({
      userID: userId,
      courseID: courseId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    const { completedVideos } = progress;

    // Check if the lecture is already marked complete
    if (completedVideos.includes(subSectionId)) {
      return res.status(400).json({
        success: false,
        message: "Lecture already marked as complete",
      });
    }

    // Add the sub-section ID to the completed videos list
    completedVideos.push(subSectionId);

    // Update the course progress
    await CourseProgress.updateOne(
      { userID: userId, courseID: courseId },
      { completedVideos }
    );

    return res.status(200).json({
      success: true,
      message: "Lecture marked as complete",
    });
  } catch (error) {
    console.error("Error marking lecture as complete:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    // Extract courseId from request body and userId from authenticated user
    const { courseId } = req.body;
    const userId = req.user.id;

    // Fetch course details with necessary population
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    // Check if course exists
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // Fetch course progress for the user
    const courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
    });

    console.log("Course Progress: ", courseProgress);

    // Calculate total course duration in seconds
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        totalDurationInSeconds += parseInt(subSection.timeDuration);
      });
    });

    // Convert total duration to a readable format
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    // Prepare the response data
    const completedVideos = courseProgress?.completedVideos || ["none"];

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos,
      },
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
