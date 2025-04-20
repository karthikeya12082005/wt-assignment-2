# Student Management System

A full-stack MERN application for managing student information. This application allows users to create, view, update, and delete student records.

## Features

- View all students in the system
- Add new students with personal details
- Edit existing student information
- Delete student records
- Responsive interface

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Project Structure

```
student-management-system/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── StudentCard.js
│       │   └── StudentForm.js
│       ├── pages/
│       │   └── Home.js
│       └── App.js
└── backend/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── studentController.js
    ├── models/
    │   └── Student.js
    ├── routes/
    │   └── studentRoutes.js
    ├── .env
    └── server.js
```

## Installation

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local installation or MongoDB Atlas account)

### Setup Instructions

1. Clone the repository
   ```
   git clone https://github.com/yourusername/student-management-system.git
   cd student-management-system
   ```

2. Backend Setup
   ```
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory with the following:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

3. Frontend Setup
   ```
   cd ../frontend
   npm install
   ```

## Running the Application

1. Start the backend server
   ```
   cd backend
   npm start
   ```

2. Start the frontend application in a new terminal
   ```
   cd frontend
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

## Available Scripts

In the frontend directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.

## Troubleshooting

If you encounter issues with the delete functionality:
1. Check server console logs for detailed error messages
2. Verify that the MongoDB connection is stable
3. Ensure that student IDs are in the correct format
4. Check network requests in browser developer tools

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.