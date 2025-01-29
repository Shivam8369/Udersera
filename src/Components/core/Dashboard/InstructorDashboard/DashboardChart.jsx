import React from 'react'
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js';

const DashboardChart = ({ details, currentChart }) => {
    ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title,);

    const randomColor = (num) => {
        const colors = []
        for (let i = 0; i < num; i++) {
            colors.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`)
        }
        return colors;
    }

    const StudentsData = {
        labels: details?.map(course => course?.courseName),
        datasets: [
            {
                label: 'number of Students',
                data: details?.map(course => course?.totalStudents),
                backgroundColor: randomColor(details?.length),
                borderColor: randomColor(),
                borderWidth: 1,
            },
        ],
    };

    const RevenueData = {
        labels: details?.map(course => course?.courseName),
        datasets: [
            {
                label: '# of ₹',
                data: details?.map(course => course?.totalRevenue),
                backgroundColor: randomColor(details?.length),
                borderColor: randomColor(),
                borderWidth: 3,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 10,
                    boxHeight: 10,
                    padding: 20,
                    font: {
                        size: 18,
                    },
                },
            },
        },
        aspectRatio: 2,
    };

    const options2 = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Revenue from Each Courses',
            },
        },
    };


    return (
        <div>
            <div className='mt-8 '>
                {currentChart === 'revenue' ? <Pie data={RevenueData} options={chartOptions} />
                    : <Bar data={StudentsData} options={options2} />}
            </div>

        </div>
    )
}

export default DashboardChart