// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature,sendPaymentSuccessEmail, getPaymentHistory } = require("../controllers/Payments")
const { auth, isStudent } = require("../middlewares/auth")


router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment", auth, verifySignature)
router.post("/sendPaymentSuccessEmail", auth, sendPaymentSuccessEmail)
router.get("/payment-history", auth, getPaymentHistory);

module.exports = router;