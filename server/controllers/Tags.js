const Tag = require("../models/Tags");

// Create a new tag handler
exports.createTag = async (req, res) => {
  try {
    // Fetch data
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name field is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description field is required",
      });
    }

    // Create entry in db
    const tagDetails = await Tag.create({ name, description });

    console.log(tagDetails);

    // Return response with created tag details
    return res.status(200).json({
      success: true,
      message: "Tag Created Successfully",
      data: tagDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all tags handler
exports.showAllTags = async (req, res) => {
  try {
    // Get all data from db
    const allTags = await Tag.find({}, { name: true, description: true });

    // Return the data
    return res.status(200).json({
      success: true,
      message: "All tags returned successfully",
      data: allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
