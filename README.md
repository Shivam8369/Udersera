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

## [Architectural Diagram 💁](https://excalidraw.com/#json=JGLvyl5-sfDeH_wcmIqgG,IYLGCjXyqCsJyulHzM3Vyg) 

## Preview

![Screenshot 2025-01-31 092940](https://github.com/user-attachments/assets/3db1606b-2a4c-47ae-b79c-ab1b728c963c) 
<br> <br> <br>
![Screenshot 2025-01-31 093054](https://github.com/user-attachments/assets/ffb196b3-9599-4a6a-baff-06a616e7db8a) 
<br> <br> <br>
![Screenshot 2025-01-31 093008](https://github.com/user-attachments/assets/67773b3a-0030-4512-9ac9-f993d6f75b95)  
<br> <br> <br>
![Screenshot 2025-01-31 093348](https://github.com/user-attachments/assets/3e450a81-4877-4875-996f-7dfdfd6c6051)
<br> <br> <br>
![Screenshot 2025-01-31 093313](https://github.com/user-attachments/assets/b50ff83b-b1b9-4fc1-aeb4-5163220551e4)
<br> <br> <br>
![Screenshot 2025-01-31 093258](https://github.com/user-attachments/assets/cbcc32ed-8325-4c8b-919b-60c508987fcf)
<br> <br> <br>
![Screenshot 2025-01-31 093151](https://github.com/user-attachments/assets/4c888eba-ac93-4763-a006-db93bf9a0668)
<br> <br> <br>
![Screenshot 2025-01-31 093117](https://github.com/user-attachments/assets/89a73ec3-172d-4783-9b05-e00d69e8a805)
<br> <br> <br>


# Folder Structure Overview

## 2.1 Root Level Configuration

├── package.json <br>
├── tailwind.config.js <br>
├── .env_example <br>
└── README.md<br>

## 2.2 Backend Structure (./server)
server/<br>
├── config/      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Configuration modules <br>
├── controllers/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Business logic<br>
├── middlewares/  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  # Request interceptors<br>
├── models/     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  # Database schemas<br>
├── routes/     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     # API endpoints<br>
├── utils/      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     # Helper functions<br>
└── mail/     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       # Email templates<br>



## 2.3 Frontend Structure (./src)
src/<br>
├── Components/   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   # UI components   <br>
├── assets/     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     # Static resources<br>
├── data/       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      # Static data/config<br>
├── hooks/      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      # Custom React hooks<br>
├── pages/       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     # Route components<br>
├── reducers/    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     # State management<br>
├── services/     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   # API integration<br>
├── slices/        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   # Redux state slices<br>
└── utils/         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   # Helper functions<br>

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
