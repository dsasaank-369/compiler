## Overview
The Online Coding Platform is a full-stack web application designed to provide an interactive environment for developers to write, compile, and test their code in multiple programming languages. It features user authentication, a problem management system, and real-time execution with automated test case validation.

## Features
- **User Authentication**: Secure login and registration system for users.
- **Multi-Language Compiler**: Supports C++, Python, Java, and JavaScript.
- **Problem Management System**: Allows users to solve coding problems and submit solutions.
- **Real-Time Execution**: Provides instant feedback on submitted code.
- **Test Case Coverage**: 95% test case coverage ensures robust validation of code submissions.
- **Submission Tracking**: Tracks and stores user submissions for performance analysis.

## Tech Stack
### Frontend:
- HTML
- CSS
- React.js
- JavaScript

### Backend:
- Node.js
- Express.js
- MongoDB
- RESTful APIs


## Installation & Setup
### Prerequisites:
- Node.js & npm installed
- MongoDB instance running

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/dsasaank-369/compiler.git
2. Change the backend url in config.js to const API_URI = "http://localhost:5000/api/v1";
3. Move all the package.json files inside backend folder.
4. Install dependencies:
   ```bash
   npm install
6. Start the backend server
   ```bash
   cd backend
   npm install
7. Start the frontend server
   ```bash
   cd frontend
   npm start

## Contribution
Contributions are welcome! Please submit a pull request or open an issue to discuss improvements.
