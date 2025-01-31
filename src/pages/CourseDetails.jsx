import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import ConfirmationModal from "../Components/common/ConfirmationModal"
import Footer from "../Components/common/Footer"
import RatingStars from "../Components/common/RatingStars"
import CourseAccordionBar from "../Components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../Components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import Spinner from "../Components/common/Spinner"

function CourseDetails() {
    const { user } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const { loading } = useSelector((state) => state.profile)
    const { paymentLoading } = useSelector((state) => state.course)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { courseId } = useParams()
    const [response, setResponse] = useState(null)
    const [confirmationModal, setConfirmationModal] = useState(null)
    const [avgReviewCount, setAvgReviewCount] = useState(0)
    const [isActive, setIsActive] = useState([])
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchCourseDetails(courseId)
                setResponse(res)
            } catch (error) {
                console.log("Could not fetch Course Details")
            }
        }
        fetchData()
    }, [courseId])

    useEffect(() => {
        const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
        setAvgReviewCount(count)
    }, [response])

    useEffect(() => {
        let lectures = 0
        response?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0
        })
        setTotalNoOfLectures(lectures)
    }, [response])

    const handleActive = (id) => {
        setIsActive(!isActive.includes(id) 
            ? isActive.concat([id]) 
            : isActive.filter((e) => e !== id))
    }

    const handleBuyCourse = async () => {
        if (token) {
            await buyCourse(token, [courseId], user, navigate, dispatch)
            return
        }
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        })
    }

    if (loading || !response) {
        return <Spinner />
    }

    if (paymentLoading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <Spinner />
            </div>
        )
    }

    const {
        courseName,
        courseDescription,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
    } = response.data?.courseDetails

    return (
        <div className="min-h-screen bg-richblack-900">
            {/* Hero Section */}
            <div className="bg-richblack-800">
                <div className="mx-auto max-w-maxContentTab px-4 py-8 lg:max-w-maxContent">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Course Info */}
                        <div className="lg:col-span-8">
                            <h1 className="text-3xl font-bold text-richblack-5 sm:text-4xl">
                                {courseName}
                            </h1>
                            <p className="mt-4 text-richblack-200">
                                {courseDescription}
                            </p>
                            
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="text-yellow-25">{avgReviewCount}</span>
                                <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
                                <span className="text-richblack-200">
                                    ({ratingAndReviews.length} reviews)
                                </span>
                                <span className="text-richblack-200">
                                    {studentsEnrolled.length} students
                                </span>
                            </div>

                            <div className="mt-4 text-richblack-200">
                                <p>Created by {`${instructor.firstName} ${instructor.lastName}`}</p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4 text-richblack-200">
                                <span className="flex items-center gap-2">
                                    <BiInfoCircle />
                                    Created {formatDate(createdAt)}
                                </span>
                                <span className="flex items-center gap-2">
                                    <HiOutlineGlobeAlt />
                                    English
                                </span>
                            </div>
                        </div>

                        {/* Course Details Card */}
                        <div className="lg:col-span-4 ">
                            <div className=" top-4 lg:top-12 lg:absolute lg:ml-14">
                                <CourseDetailsCard 
                                    course={response?.data?.courseDetails}
                                    setConfirmationModal={setConfirmationModal}
                                    handleBuyCourse={handleBuyCourse}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="md:mx-auto max-w-maxContentTab px-4 py-8 lg:max-w-[950px] lg:ml-6">
                {/* What you'll learn */}
                <div className="border border-richblack-600 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-richblack-5">
                        What you'll learn
                    </h2>
                    <div className="mt-4 text-richblack-200">
                        <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
                    </div>
                </div>

                {/* Course Content */}
                <div className="mt-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-richblack-5">
                            Course Content
                        </h2>
                        <button 
                            className="text-yellow-25 text-sm"
                            onClick={() => setIsActive([])}
                        >
                            Collapse all sections
                        </button>
                    </div>

                    <div className="mt-4 text-richblack-200">
                        <span>{courseContent.length} sections</span>
                        <span className="mx-2">•</span>
                        <span>{totalNoOfLectures} lectures</span>
                        <span className="mx-2">•</span>
                        <span>{response.data?.totalDuration} total length</span>
                    </div>

                    <div className="mt-4">
                        {courseContent?.map((course, index) => (
                            <CourseAccordionBar
                                key={index}
                                course={course}
                                isActive={isActive}
                                handleActive={handleActive}
                            />
                        ))}
                    </div>
                </div>

                {/* Author */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-richblack-5">
                        Author
                    </h2>
                    <div className="mt-4 flex items-center gap-4">
                        <img
                            src={instructor.image || `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`}
                            alt={instructor.firstName}
                            className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-richblack-5">
                                {`${instructor.firstName} ${instructor.lastName}`}
                            </p>
                            <p className="text-sm text-richblack-200">
                                {instructor?.additionalDetails?.about}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    )
}

export default CourseDetails