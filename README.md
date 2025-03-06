# LoyalTea – Gamified Loyalty Web Platform for Cafes & Bars

## Project Overview
This project was developed at the **Technical University of Munich (TUM)** as part of the **Software Engineering for Business Applications** course during the **Summer Semester 2024**.

**LoyalTea** is an innovative **React-based web application** designed to enhance customer loyalty and engagement for cafes and bars. By integrating **gamification elements**, a **digital rewards system**, and a **streamlined ordering process**, LoyalTea provides an engaging way for customers to interact with their favorite establishments while allowing business owners to gather insights and optimize their offerings.

## Features

- **Digital Loyalty Program** – Customers earn points through purchases, check-ins, and engagement.
- **Gamification & Challenges** – Users participate in quizzes, games, and social challenges.
- **Leaderboards & Rankings** – Encourages friendly competition among customers.
- **Online Order System** – Allows direct ordering via the platform.
- **Admin Dashboard** – Business owners can track customer activity and send notifications.
- **User Authentication** – Secure login and role-based access control.
- **Multi-Device Responsive UI** – Accessible from mobile and desktop devices.

## Important Notes

- **MongoDB Credentials Required**: To run the application, users must enter valid MongoDB database credentials and seed the database accordingly.

## Image

![img.png](README_addition/S1.png)

## Tech Stack

### Frontend
- **React.js** – JavaScript library for building the user interface.
- **React Bootstrap & Material UI** – For responsive design and styling.
- **React Router** – Manages navigation within the app.

### Backend
- **Express.js** – Node.js framework for handling backend operations.
- **MongoDB** – NoSQL database for storing user, order, and challenge data.
- **Mongoose** – ODM (Object Data Modeling) library for MongoDB.
- **JWT Authentication** – Secure user authentication.

### Hosting & Infrastructure
- **Cloud Hosting (AWS/GCP/Azure)** – Ensures scalability and performance.
- **Payment Integration (Stripe/PayPal)** – Enables secure online transactions.

## Important Files

### Frontend
- `LandingPage.js` – Main landing page with login/signup options.
- `LoginPage.js` – Handles user authentication.
- `App.js` – Root component managing routing and state.

### Backend
- `app.js` – Express.js server configuration.
- `authMiddleware.js` – Middleware for handling authentication and authorization.
- `userModel.js` – Defines the schema for user accounts.
- `orderModel.js` – Manages order data and status.
- `challengeModel.js` – Handles gamified challenges and user participation.
- `gameModel.js` – Stores game-related data.
- `itemModel.js` – Defines menu items, prices, and categories.

## Setup & Installation

### Prerequisites

- **Node.js 16+**
- **MongoDB Atlas or Local MongoDB instance**
- **npm or yarn** (for package management)

### Cloning the Repository
```bash
git clone <https://github.com/cristiangavriliu/loyal-tea.git>
cd <repository-directory>
```

### Setting Up the Backend

1. **Navigate to the backend folder:**
```bash
cd backend
```
2. **Install dependencies:**
```bash
npm install
```
3. **Set up environment variables:** Create a `.env` file and add your MongoDB connection string and JWT secret:
```bash
MONGO_URI=your-mongodb-url
JWT_SECRET=your-secret-key
```
4. **Run the backend server:**
```bash
npm start
```

### Setting Up the Frontend

1. **Navigate to the frontend folder:**
```bash
cd frontend
```
2. **Install dependencies:**
```bash
npm install
```
3. **Start the frontend server:**
```bash
npm start
```

### Running the Application

The frontend will be available at:
**http://localhost:3000/**

The backend API will be available at:
**http://localhost:5000/**

## Future Enhancements

- **Mobile App Integration** – Develop a native app for iOS/Android.
- **Expanded Gamification Features** – More diverse challenges and achievements.
- **Enhanced Business Analytics** – Provide more detailed customer insights.

## Team Members

| Member     | Current Position               |
| ------ |----------------|
| Cristian Gavriliu | M.Sc Information Systems          | 
| Leonard Steindorf | M.Sc Information Systems |
| Kevin Nguyen | M.Sc Information Systems |
| Philipp Eichhorn | M.Sc Information Systems |

## License

This project is for **personal use only** and is intended as a reference point for the projects I have completed during my studies.

---

For further details, refer to the **final project documentation and business model report**.

