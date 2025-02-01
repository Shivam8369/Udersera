// Import necessary modules
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create a new sub-section for a given section

const updateCourseDuration = async (sectionId) => {
  try {
    // Find the course that contains this section
    const course = await Course.findOne({ courseContent: sectionId }).populate({
      path: 'courseContent',
      populate: {
        path: 'subSection'
      }
    });

    if (!course) return;

    // Calculate total duration
    let totalTime = 0;
    for (const section of course.courseContent) {
      const populatedSection = await Section.findById(section._id).populate('subSection');
      for (const subSection of populatedSection.subSection) {
        totalTime += parseFloat(subSection.timeDuration || 0);
      }
    }

    // Update course with new total duration
    course.totalDuration = totalTime.toFixed(2);
    await course.save();
  } catch (error) {
    console.error("Error updating course duration:", error);
  }
};

exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description} = req.body;
    const video = req.files.videoFile;

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" });
    }

    const ifSection = await Section.findById(sectionId);
    if (!ifSection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_VIDEO
    );
    console.log(uploadDetails);
    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    await updateCourseDuration(sectionId);

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// UPDATE a sub-section
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_VIDEO
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();
    await updateCourseDuration(sectionId);

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate("subSection");

    console.log("updated section", updatedSection);

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, courseId } = req.body;
    const sectionId = req.body.sectionId;
    if (!subSectionId || !sectionId) {
      return res.status(404).json({
        success: false,
        message: "all fields are required",
      });
    }
    const ifSubSection = await SubSection.findById({ _id: subSectionId });
    const ifSection = await Section.findById({ _id: sectionId });
    if (!ifSubSection) {
      return res.status(404).json({
        success: false,
        message: "Sub-section not found",
      });
    }
    if (!ifSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }
    await SubSection.findByIdAndDelete(subSectionId);
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $pull: { subSection: subSectionId } },
      { new: true }
    );
    const updatedSection = await Section.findById(sectionId).populate("subSection");
    await updateCourseDuration(sectionId);

    return res.status(200).json({
      success: true,
      message: "Sub-section deleted",
      data: updatedSection,
    });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error deleting sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
