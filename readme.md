# 🌏 PH Tour Management System Backend

**Version:** 1.0  
**Prepared By:** Next Level Team

## 📖 Introduction

The **PH Tour Management System Backend** is a scalable, secure, and modular Node.js-based backend designed to manage and book tours across Bangladesh. It provides APIs for user registration, authentication, tour browsing, booking, and payment processing via **SSLCommerz**, along with robust admin functionalities for managing users, tours, and transactions.

---

## 🎯 Purpose

To deliver a **scalable, secure, and user-friendly backend** that enables:

- Tour booking for travelers
- Complete admin management for tour operators
- Secure payment integration with **SSLCommerz**
- Role-based access control (RBAC) for system security

---

## 📌 Scope

The backend includes modules for:

- **User Registration & Authentication** (Email/Google)
- **Tour Listing & Filtering**
- **Booking & Payment Processing**
- **Admin Panel Features**
- **Integration with SSLCommerz** for online payments

---

## 🧾 Definitions

- **JWT** – JSON Web Token for authentication
- **RBAC** – Role-Based Access Control
- **CRUD** – Create, Read, Update, Delete
- **SPA** – Single Page Application

---

## 🏗️ System Architecture Overview

**Backend:** Node.js (Express), MongoDB, Redis  
**Frontend:** React/Next.js (Separate SPA)  
**Auth:** JWT, OTP via SMS/Email  
**Payment Gateway:** SSLCommerz  
**Deployment:** Vercel / Cloud VPS

---

## 👥 User Classes

- **Visitor:** Unauthenticated users browsing tours
- **User:** Registered users booking tours
- **Admin:** Manages users, tours, bookings, and transactions

---

## ✅ Functional Requirements

1. User registration (Email/Google) & OTP verification
2. User login (Email/Google)
3. Profile view & update
4. Admin management of users (list, update, deactivate)
5. Tour management (create, update, delete)
6. Tour search & filtering by division, price, keywords
7. Booking creation with status `pending`
8. Booking history for users
9. Admin booking status update (confirm, cancel)
10. Payment initiation via SSLCommerz
11. Success & failure redirect handling
12. Automatic update of payment & booking status after validation
13. Admin guide assignment to tours
14. Division listing management

---

## 📊 Non-Functional Requirements

- Response time: ≤ 500ms for 95% of requests
- Support ≥ 1,000 concurrent users
- Horizontal scalability support
- Secure password hashing (bcrypt)
- JWT storage & validation
- Strict RBAC enforcement
- Payment data secured with HTTPS
- 99.5% uptime guarantee
- Fault-tolerant Redis for transient data (OTPs)
- Modular MVC architecture

---

## 🔗 API Structure

All API endpoints are prefixed with:

**/api/v1**

### Example Categories:

- **Auth**: `/api/v1/auth`
- **Users**: `/api/v1/users`
- **Tours**: `/api/v1/tours`
- **Bookings**: `/api/v1/bookings`
- **Payments**: `/api/v1/payments`

---

## 🗄️ Data Model Overview

**User**

```json
{
  "name": "John Doe",
  "phone": "017xxxxxxxx",
  "email": "john@example.com",
  "password": "hashed",
  "role": "user",
  "verified": true
}
```

**Tour**

```json
{
  "title": "Sundarbans Adventure",
  "description": "Explore the world's largest mangrove forest.",
  "price": 5000,
  "images": ["img1.jpg", "img2.jpg"],
  "division": "Khulna",
  "slug": "sundarbans-adventure"
}
```

**Payment**

```json
{
  "userId": "ObjectId",
  "tourId": "ObjectId",
  "date": "2025-08-20",
  "status": "pending",
  "paymentStatus": "unpaid"
}
```

**Booking**

```json
{
  "bookingId": "ObjectId",
  "transactionId": "TXN123456",
  "status": "success",
  "amount": 5000
}
```

## 📜 Use Case: Booking a Tour

1. User registers and verifies via **OTP**
2. User logs in and browses tours
3. User selects a tour and submits booking
4. System creates booking with status **pending**
5. User is redirected to **SSLCommerz** for payment
6. On payment success, booking status updates to **confirmed**

---

## 🎯 Acceptance Criteria

- Users can **register**, **log in**, and **book tours**
- Admins can **manage tours, users, and bookings**
- Payment status **automatically updates** booking status
- APIs are **secured and role-protected**
- Meets **NFRs** for performance & security

---

## 🚀 Tech Stack

- **Node.js & Express.js** – Backend framework
- **MongoDB** – Database
- **Redis** – Transient data store (OTPs, sessions)
- **JWT** – Authentication
- **SSLCommerz** – Payment gateway integration
- **Vercel / Cloud VPS** – Deployment

---

## 🛡️ Security

- Passwords hashed with **bcrypt**
- **JWT** authentication with expiry & refresh token support
- **HTTPS** for payment transactions
- **Role-based route protection (RBAC)**

📦 Installation & Setup

# Clone repository

git clone <repo-url>

# Install dependencies

npm install

# Create .env file

cp .env.example .env

# Run development server

npm run dev

# Run production build

npm start






Author : Tafhimul Islam
