import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { FaUserAlt, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';
import { getAdminStatsData } from '../../../services/operations/courseDetailsAPI'
import { useSelector } from 'react-redux'
// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminStatsData(token);
        if (res) {
          setData(res);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!data) {
    return <div className="flex justify-center items-center h-screen">No data available</div>;
  }

  // Prepare data for category-wise courses pie chart
  const categoryData = {
    labels: data.courses.categoryWise.map(category => category.name),
    datasets: [{
      data: data.courses.categoryWise.map(category => category.courseCount),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0'
      ]
    }]
  };

  // Prepare data for top courses bar chart
  const coursesData = {
    labels: data.ratings.topRatedCourses.map(course => course.courseName),
    datasets: [{
      label: 'Students Enrolled',
      data: data.ratings.topRatedCourses.map(course => course.totalStudents),
      backgroundColor: '#9297ab'
    }]
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="border-2 border-[#020d3e] bg-richblack-800 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110">
      <div className=" flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <Icon className={`text-3xl ${color}`} />
      </div>
    </div>
  );

  const chartOptions = {
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 20,
          font: {
            size: 13,
          },
        },
      },
    },
    aspectRatio: 1,
  };

  return (
    <div className=" text-white p-6 space-y-6 flex-1 overflow-y-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={data.users.totalStudents}
          icon={FaUserAlt}
          color="text-white-500"
        />
        <StatCard
          title="Total Instructors"
          value={data.users.totalInstructors}
          icon={FaChalkboardTeacher}
          color="text-green-500"
        />
        <StatCard
          title="Total Admins"
          value={data.users.totalAdmins}
          icon={FaUserShield}
          color="text-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${data.revenue.total}`}
          icon={MdAttachMoney}
          color="text-white-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid border-2 bg-richblack-800  border-[#023e27] grid-cols-1 lg:grid-cols-2 gap-6 transition-transform duration-300 hover:scale-105 ">
        {/* Category Distribution */}
        <div className="bg-gray-800 p-6 border-2 border-[#061610] rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Course Categories</h3>
          <div className="h-[300px] flex justify-center">
            <Pie data={categoryData} options={chartOptions} />
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Top Courses</h3>
          <div className="h-[300px]">
            <Bar
              data={coursesData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Top Courses till Date',
                  },
                },
                aspectRatio: 1.5,
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Rated Courses Table */}
      <div className="bg-richblack-800 border-2 border-[#023e27] p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
        <h3 className="text-xl font-semibold mb-4">Top Rated Courses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4">Rank</th>
                <th className="text-left py-3 px-4">Course Name</th>
                <th className="text-left py-3 px-4">Instructor</th>
                <th className="text-left py-3 px-4">Rating</th>
                <th className="text-left py-3 px-4">Students</th>
                <th className="text-left py-3 px-4">Price</th>
              </tr>
            </thead>
            <tbody>
              {data.ratings.topRatedCourses.map((course,index) => (
                <tr  key={course._id} className="border-b text-[#9799a1] border-gray-700 ">
                  <td className="py-3 px-4">{index+1}</td>
                  <td className="py-3 px-4">{course.courseName}</td>
                  <td className="py-3 px-4">
                    {`${course.instructorDetails[0].firstName} ${course.instructorDetails[0].lastName}`}
                  </td>
                  <td className="py-3 px-4">{course.averageRating || 'N/A'}</td>
                  <td className="py-3 px-4">{course.totalStudents}</td>
                  <td className="py-3 px-4">₹{course.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;