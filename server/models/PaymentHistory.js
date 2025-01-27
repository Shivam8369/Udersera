const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  orderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "INR",
  },
  status: {
    type: String,
    enum: ["pending", "successful", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "razorpay",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);

