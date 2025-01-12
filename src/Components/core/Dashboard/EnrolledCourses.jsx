import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../services/operations/ProfileAPI";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  
  const dummyData = [
    {
      "_id": "course001",
      "courseName": "Introduction to Python",
      "courseDescription": "A beginner-friendly course to learn Python programming from scratch.",
      "thumbnail": "https://via.placeholder.com/150",
      "totalDuration": "15 hours",
      "progressPercentage": 20,
      "courseContent": [
        {
          "_id": "section1",
          "subSection": [
            {
              "_id": "subSection1"
            }
          ]
        }
      ]
    },
    {
      "_id": "course002",
      "courseName": "Web Development Bootcamp",
      "courseDescription": "Learn HTML, CSS, and JavaScript to build your own website.",
      "thumbnail": "https://via.placeholder.com/150",
      "totalDuration": "20 hours",
      "progressPercentage": 60,
      "courseContent": [
        {
          "_id": "section2",
          "subSection": [
            {
              "_id": "subSection2"
            }
          ]
        }
      ]
    },
    {
      "_id": "course003",
      "courseName": "Data Structures and Algorithms",
      "courseDescription": "Master the fundamentals of data structures and algorithms.",
      "thumbnail": "https://via.placeholder.com/150",
      "totalDuration": "25 hours",
      "progressPercentage": 80,
      "courseContent": [
        {
          "_id": "section3",
          "subSection": [
            {
              "_id": "subSection3"
            }
          ]
        }
      ]
    },
    {
      "_id": "course004",
      "courseName": "Machine Learning Basics",
      "courseDescription": "An introductory course to machine learning concepts and techniques.",
      "thumbnail": "https://via.placeholder.com/150",
      "totalDuration": "30 hours",
      "progressPercentage": 50,
      "courseContent": [
        {
          "_id": "section4",
          "subSection": [
            {
              "_id": "subSection4"
            }
          ]
        }
      ]
    },
    {
      "_id": "course005",
      "courseName": "Introduction to Databases",
      "courseDescription": "Learn about relational databases and SQL.",
      "thumbnail": "https://via.placeholder.com/150",
      "totalDuration": "12 hours",
      "progressPercentage": 30,
      "courseContent": [
        {
          "_id": "section5",
          "subSection": [
            {
              "_id": "subSection5"
            }
          ]
        }
      ]
    },
    {
      "_id": "course006",
      "courseName": "Cybersecurity Essentials",
      "courseDescription": "Understand the basics of cybersecurity and how to protect systems.",
      "thumbnail": "https://via.placeholder.com/150",
      "totalDuration": "18 hours",
      "progressPercentage": 10,
      "courseContent": [
        {
          "_id": "section6",
          "subSection": [
            {
              "_id": "subSection6"
            }
          ]
        }
      ]
    },
    {
      "_id": "course007",
      "courseName": "Cloud Computing with AWS",
      "courseDescription": "Get started with cloud computing using Amazon Web Services.",
      "thumbnail": "https://via.placeholder.com/150",
      "totalDuration": "22 hours",
      "progressPercentage": 70,
      "courseContent": [
        {
          "_id": "section7",
          "subSection": [
            {
              "_id": "subSection7"
            }
          ]
        }
      ]
    },
    {
      "_id": "course008",
      "courseName": "Full-Stack Development",
      "courseDescription": "Learn to build both front-end and back-end of web applications.",
      "thumbnail": "https://via.placeholder.com/150",
      "totalDuration": "40 hours",
      "progressPercentage": 90,
      "courseContent": [
        {
          "_id": "section8",
          "subSection": [
            {
              "_id": "subSection8"
            }
          ]
        }
      ]
    },
    {
      "_id": "course009",
      "courseName": "React Native for Mobile Apps",
      "courseDescription": "Develop cross-platform mobile applications using React Native.",
      "thumbnail": "https://via.placeholder.com/150",
      "totalDuration": "35 hours",
      "progressPercentage": 40,
      "courseContent": [
        {
          "_id": "section9",
          "subSection": [
            {
              "_id": "subSection9"
            }
          ]
        }
      ]
    },
    {
      "_id": "course010",
      "courseName": "DevOps Fundamentals",
      "courseDescription": "Learn the essentials of DevOps and continuous integration/continuous deployment.",
      "thumbnail": "https://via.placeholder.com/150",
      "totalDuration": "28 hours",
      "progressPercentage": 60,
      "courseContent": [
        {
          "_id": "section10",
          "subSection": [
            {
              "_id": "subSection10"
            }
          ]
        }
      ]
    }
  ]
  
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(dummyData)  /// for testing purpose
      // setEnrolledCourses(res); 
    } catch (error) {
      console.log("Could not fetch enrolled courses.");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          {" "}
          You have not enrolled in any course yet.{" "}
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  );
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
