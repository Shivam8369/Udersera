const Category = require("../models/Category");
const Course = require("../models/Course");
const { keyExists, getKey, setKey } = require("../utils/redisHelper");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const cacheKey = "allCategories";

    // Check if data exists in Redis
    if (await keyExists(cacheKey)) {
      const cachedData = await getKey(cacheKey);
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedData), // Parse JSON string from Redis
        message: "Data fetched from Redis cache ✅",
      });
    }

    // If not in Redis, fetch from MongoDB
    const allCategory = await Category.find({}, { name: 1, description: 1 });

    // Store result in Redis for 10 minutes (600 seconds)
    await setKey(cacheKey, JSON.stringify(allCategory), 6000);

    return res.status(200).json({
      success: true,
      data: allCategory,
      message: "Data fetched from MongoDB and stored in Redis ✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Define a single Redis cache key for this category
    const cacheKeySelectedCategory = `category:${categoryId}`;

    // Check if the category data exists in Redis
    if (await keyExists(cacheKeySelectedCategory)) {
      const cachedData = await getKey(cacheKeySelectedCategory);
      const parsedData = JSON.parse(cachedData);

      return res.status(200).json({
        selectedCourses: parsedData.selectedCourses,
        differentCourses: parsedData.differentCourses,
        mostSellingCourses: parsedData.mostSellingCourses,
        success: true,
        message: "Category data fetched from Redis cache ✅",
      });
    }

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
      })
      .exec();

    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(200).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    const selectedCourses = selectedCategory.courses;

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).populate({
      path: "courses",
      match: { status: "Published" },
      populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
    });

    let differentCourses = [];
    for (const category of categoriesExceptSelected) {
      differentCourses.push(...category.courses);
    }

    // Get top-selling courses across all categories
    const allCategories = await Category.find().populate({
      path: "courses",
      match: { status: "Published" },
      populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
    });

    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // Prepare the data to store in Redis
    const cacheData = {
      selectedCourses,
      differentCourses,
      mostSellingCourses,
    };

    await setKey(cacheKeySelectedCategory, JSON.stringify(cacheData), 6000);

    // Return the response
    res.status(200).json({
      selectedCourses: selectedCourses,
      differentCourses: differentCourses,
      mostSellingCourses: mostSellingCourses,
      success: true,
    });
  } catch (error) {
    console.error("❌ Error fetching category details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addCourseToCategory = async (req, res) => {
  const { courseId, categoryId } = req.body;
  // console.log("category id", categoryId);
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    if (category.courses.includes(courseId)) {
      return res.status(200).json({
        success: true,
        message: "Course already exists in the category",
      });
    }
    category.courses.push(courseId);
    await category.save();
    return res.status(200).json({
      success: true,
      message: "Course added to category successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
