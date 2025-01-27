import { apiConnector } from "../apiconnector";
import { studentEndpoints } from "../apis";
import { toast } from "react-hot-toast";
import logo from "../../assets/Logo/logo-light-full.png";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API, GET_PAYMENT_HISTORY } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}


export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Please wait while we redirect you to payment gateway", {
        position: "bottom-center",
        autoClose: false,
    });
    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, { courses }, {
            Authorization: `Bearer ${token}`,
        })
        if (!orderResponse.data.success) {
            toast.error(orderResponse.data.message)
            console.log("buyCourse -> orderResponse", orderResponse)
            toast.dismiss(toastId);
            return
        }
        console.log("buyCourse -> orderResponse", orderResponse)
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            currency: orderResponse.data.currency,
            amount: orderResponse.data.amount.toString(),
            order_id: orderResponse.data.orderId,
            name: "Study Notion",
            description: "Thank you for purchasing the course",
            image: logo,
            prefill: {
                name: userDetails?.firstName + " " + userDetails?.lastName,
                email: userDetails?.email,
            },
            handler: async function (response) {
                console.log("buyCourse -> response", response)
                sendPaymentSuccessEmail(response, orderResponse.data.amount, token);
                verifyPayment(response, courses, token, navigate, dispatch);
            },
            theme: {
                color: "#686CFD",
            },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Payment Failed");
        });
        toast.dismiss(toastId);

    } catch (error) {
        toast.dismiss(toastId);
        toast.error("Something went wrong");
        console.log("buyCourse -> error", error)
    }
}



async function sendPaymentSuccessEmail(response, amount, token) {

    const res = await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
        amount,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
    }, {
        Authorization: `Bearer ${token}`,
    });
    if (!res.success) {
        console.log(res.message);
        toast.error(res.message);
    }
}

async function verifyPayment(response, courses, token, navigate, dispatch,) {
    const toastId = toast.loading("Please wait while we verify your payment");
    console.log("verifyPayment -> courses", courses.courses);
    try {

        const res = await apiConnector("POST", COURSE_VERIFY_API, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            courses: courses.courses || courses,
        }, {
            Authorization: `Bearer ${token}`,
        });
        console.log("verifyPayment -> res", res)
        if (!res.data.success) {
            toast.error(res.message);
            return;
        }

        toast.success("Payment Successful");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }
    catch (err) {
        toast.error("Payment Failed");
        console.log(err);
    }
    toast.dismiss(toastId);
}

export async function getPaymentHistory(token   ) {
    const toastId = toast.loading("Loading payment history...");
    try {
        const response = await apiConnector("GET", GET_PAYMENT_HISTORY, null, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message);
        }

        toast.success("Payment history fetched successfully");
        return response?.data?.data;

    } catch (error) {
        console.log("GET_PAYMENT_HISTORY API ERROR............", error);
        toast.error(error.message || "Could not fetch payment history");
        return null;
    } finally {
        toast.dismiss(toastId);
    }
}


