import "./App.css";
import { useEffect } from "react"
import { Routes, Route, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"   
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./Components/common/Navbar";
import VerifyEmail from "./pages/VerifyEmail";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { getUserDetails } from "./services/operations/ProfileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"
import PrivateRoute from "./Components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard"
import MyProfile from "./Components/core/Dashboard/MyProfile";
import Settings from "./Components/core/Dashboard/Settings"
import Cart from "./Components/core/Dashboard/Cart";
import EnrolledCourses from "./Components/core/Dashboard/EnrolledCourses";
import PurchaseHistory from "./Components/core/Dashboard/PurchaseHistory";

function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {                                                            
    if(localStorage.getItem("token")){
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
  }, [])
  return (
    <div className=" w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/update-password/:id" element={<UpdatePassword />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route element={ <PrivateRoute> <Dashboard /> </PrivateRoute> } >
         {/* children of a route */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
         
          <Route path="dashboard/settings" element={<Settings />} />

          {/* user only routes */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route
                path="dashboard/purchase-history"
                element={<PurchaseHistory />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<Error />} />

      </Routes>
    </div>
  );
}

export default App;
