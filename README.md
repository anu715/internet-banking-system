# Internet Banking System

A full-stack Internet Banking application built using Spring Boot, React, JWT Authentication, MySQL, Railway, Render, and Vercel.

## Live Demo

Frontend:
[https://internet-banking-system-pi.vercel.app](https://internet-banking-system-pi.vercel.app)

Backend Swagger API:
[https://internet-banking-backend.onrender.com/swagger-ui/index.html](https://internet-banking-backend.onrender.com/swagger-ui/index.html)

GitHub Repository:
[https://github.com/anu715/internet-banking-system](https://github.com/anu715/internet-banking-system)

---

# Features

## User Features

* User Registration
* Secure Login with JWT Authentication
* Deposit Money
* Withdraw Money
* Transfer Money
* Transaction History
* Account Balance Tracking
* Protected Dashboard

## Admin Features

* Admin Login
* User Management
* Freeze / Unfreeze Accounts
* View Total Users
* View Total Bank Balance
* View Transactions
* Audit Logs
* Analytics Dashboard

## Security Features

* JWT Authentication
* Password Encryption using BCrypt
* Role-Based Access Control
* Protected APIs
* Secure REST Endpoints

---

# Tech Stack

## Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* Maven

## Frontend

* React
* Vite
* Axios
* Recharts
* CSS

## Database

* MySQL
* Railway Cloud Database

## Deployment

* Render for Backend
* Vercel for Frontend
* Railway for Database

---

# API Endpoints

## Authentication APIs

* POST `/api/register`
* POST `/api/login`

## Banking APIs

* POST `/api/deposit/{email}/{amount}`
* POST `/api/withdraw/{email}/{amount}`
* POST `/api/transfer`

## User APIs

* GET `/api/user/{email}`
* GET `/api/users`

## Transaction APIs

* GET `/api/transactions`
* GET `/api/transactions/{userId}`

## Admin APIs

* POST `/api/freeze/{userId}`
* POST `/api/unfreeze/{userId}`
* GET `/api/audit-logs`

---

# Screenshots

Add screenshots here:

* Login Page
* Register Page
* Dashboard
* Admin Dashboard
* Analytics Dashboard
* Swagger UI
* Audit Logs

---

# Project Architecture

Frontend (React + Vercel)
↓
Backend APIs (Spring Boot + Render)
↓
Database (MySQL + Railway)

---

# Future Improvements

* Forgot Password with OTP
* Email Notifications
* PDF Bank Statements
* Dark Mode
* Mobile Responsive Design
* Docker Compose
* CI/CD Pipeline
* Unit Testing
* Redis Caching

---

# How to Run Locally

## Backend

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Author

Anushree Naidu

GitHub:
[https://github.com/anu715](https://github.com/anu715)

LinkedIn:
Add your LinkedIn profile link here.
