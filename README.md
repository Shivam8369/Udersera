# [Udersera - CodeTech Platform](https://udersera.onrender.com/)

Udersera is a fully functional code-tech learning platform that enables users to create, consume, and rate coding content. The platform is built using the `MERN stack`, which includes `ReactJS`, `NodeJS`, `MongoDB`, and `ExpressJS`.

---
### Udersera aims to provide:

- A seamless and interactive learning experience for students, making education more accessible and engaging.
- A platform for instructors to showcase their expertise and connect with learners across the globe.

---

# Features

- User Authentication: Udersera provides secure user registration and authentication using JWT (JSON Web Tokens). Users can sign up, log in, and manage their
  profiles with ease.
- Courses and Lessons: Instructors can create and edit created courses. Students can enroll in courses, access course materials, and track their progress.
- Progress Tracking: Udersera allows students to track their progress in enrolled courses. They can view completed lessons, scores on quizzes and
  assignments, and overall course progress.
- Payment Integration: Udersera integrates with Razorpay for payment processing. Users can make secure payments for course enrollment and other services
  using various payment methods supported by Razorpay.
- Instructor Dashboard: Instructors have access to a comprehensive dashboard to view information about their courses, students, and income. The
  dashboard provides charts and visualizations to present data clearly and intuitively. Instructors can monitor the total number of students enrolled in
  each course, track course performance, and view their income generated from course sales.

---

## API Design

The StudyNotion platform's API is designed following the REST architectural style. The API is implemented using Node.js and Express.js. It uses JSON for data exchange and follows standard HTTP request methods such as GET, POST, PUT, and DELETE.

## Installation

To install the StudyNotion platform, follow these steps:

- Clone the repository: `git clone https://github.com/Shivam8369/Udersera.git`
- Navigate to the project directory: `cd Udersera`
- Install backend dependencies: `cd Server && npm install`
- Install frontend dependencies: `cd .. && npm install`
- To run: npm run dev (it will start both frontend and backend)
- Set the configuration before running the application
- Open the project in your browser at http://localhost:3000 to view your project.

## Configuration

- Set up a MongoDB database and obtain the connection URL.
- Get up the Mail pass and Mail Port from Gmail.
- Set up a Razorpay account and obtain the key ,secret.
- Get jwt secret
- Set up a cloudinary account and obtain cloud name,api key and api secret.
- Create a `.env` file in the `Server` directory with the following environment variables in the ,env-example
- Create a `.env` file in the root folder and add the `REACT_APP_BASE_URL:<your-backend-url-or-your-localhost>`

## Preview


# Folder Structure Overview

## 2.1 Root Level Configuration

├── package.json <br>
├── tailwind.config.js <br>
├── .env_example <br>
└── README.md<br>

## 2.2 Backend Structure (./server)
server/<br>
├── config/           # Configuration modules <br>
├── controllers/      # Business logic<br>
├── middlewares/      # Request interceptors<br>
├── models/          # Database schemas<br>
├── routes/          # API endpoints<br>
├── utils/           # Helper functions<br>
└── mail/            # Email templates<br>



## 2.3 Frontend Structure (./src)
src/<br>
├── Components/     # UI components   <br>
├── assets/         # Static resources<br>
├── data/           # Static data/config<br>
├── hooks/          # Custom React hooks<br>
├── pages/          # Route components<br>
├── reducers/       # State management<br>
├── services/       # API integration<br>
├── slices/         # Redux state slices<br>
└── utils/          # Helper functions<br>

## Note

This project is intended as a learning tool and can be used as a sample project for educational or personal projects.

## Contributing

- Contributions are welcome! If you have any suggestions or find any issues, please feel free to open an issue or a pull request.
- Use the develop branch and create you own branch from that,
  than create a PR from your branch to develop 

## Contact

- Email: sahud8697@gmail.com
- LinkedIn: [Shivam Sahu](https://www.linkedin.com/in/shivam-sahu-code/)

---
<br>

# [Live Link 🛜](https://udersera.onrender.com/)
