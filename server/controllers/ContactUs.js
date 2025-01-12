const mailSender = require("../utils/mailSender");
const contactUsEmail = require("../mail/templates/contactFormRes");

exports.contactUs = async (req, res) => {
  try {
    // Destructure and validate required fields
    const { firstName, lastName, email, message, phoneNo } = req.body;
    if (!firstName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "First name, email, and message are required.",
      });
    }

    // Prepare data for email template
    const data = {
      firstName,
      lastName,
      email,
      message,
      phoneNo,
    };

    // Send email
    const info = await mailSender(data.email,"FeedBack Review Form ", contactUsEmail(data));

    // Handle response based on mail sending success
    if (info) {
      return res.status(200).json({
        success: true,
        message: "Your message has been sent successfully.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send your message. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error in contactUs:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
};
