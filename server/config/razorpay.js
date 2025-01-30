const Razorpay = require("razorpay");

// creating an instance of it through which we communicate 
exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});