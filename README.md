# BedWatch Backend – Hospital Bed & Resource Management System

## Overview

BedWatch Backend is a scalable Node.js + Express + TypeScript backend system developed for managing hospital beds, admissions, discharges, transfers, and ward operations.

The backend follows a modular Domain-Driven Design (DDD) architecture with role-based access control and enterprise-level project structure.

The system handles:

- Authentication & Authorization
- Patient Admissions
- Bed Allocation
- Patient Discharge
- Inter-Ward Transfers
- Staff Management
- Ward Management
- Operational Reporting

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- MySQL
- TypeORM
- JWT Authentication
- TypeDI
- CORS
- Nodemon

---

# Backend Features

## Authentication & Authorization

- JWT-based authentication
- Middleware-based route protection
- Role-based access control
- Secure API handling

---

## Bed Management

- Bed availability tracking
- Bed occupancy handling
- Bed cleaning status workflow
- Real-time bed updates

---

## Patient Management

- Patient admission workflow
- Patient discharge handling
- Admission status management
- Bed assignment validation

---

## Inter-Ward Transfers

- Transfer request creation
- Senior staff approval workflow
- Transfer status handling
- Ward movement tracking

---

## Forgot Password System

- Forgot password API
- Token generation
- Password reset workflow

---

# Architecture

The backend follows Domain-Driven Design (DDD).

Each domain contains:

- Controller
- Routes
- Services
- Entity
- Utility files

---

# Folder Structure

```bash
src/
│
├── common/
│
├── config/
│   └── backblaze.ts
│
├── db/
│   └── data-source.ts
│
├── domains/
│   │
│   ├── admission/
│   ├── auth/
│   ├── bed/
│   ├── bedStatusLogger/
│   │
│   ├── forgot-password/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── patient/
│   │   └── entity/
│   │
│   ├── SrStaff/
│   │   ├── controller/
│   │   ├── routes/
│   │   └── service/
│   │
│   ├── transfers/
│   ├── user/
│   └── ward/
│
├── Http_Response/
├── types/
│
├── app.ts
└── .env
```

---

# Main API Modules

## Auth Module

Handles:

- Login
- JWT generation
- Authentication middleware
- User validation

---

## Ward Module

Handles:

- Ward management
- Ward listing
- Ward administration

---

## User Module

Handles:

- Staff management
- User operations
- Admin controls

---

## Transfer Module

Handles:

- Inter-ward transfer requests
- Transfer approvals
- Transfer status workflow

---

## Bed Module

Handles:

- Bed status updates
- Occupancy tracking
- Bed allocation system

---

## Forgot Password Module

Handles:

- Password reset requests
- Token management
- Secure password reset flow

---

# API Route Structure

Base URL:

```bash
/api/v1
```

---

## Authentication Routes

```bash
/api/v1/auth
```

---

## Ward Routes

```bash
/api/v1/wards
/api/v1/wardsAdmin
```

---

## User Routes

```bash
/api/v1/users
/api/v1/usersAdmin
```

---

## Transfer Routes

```bash
/api/v1/transfers
/api/v1/staff/transfers
```

---

## Senior Staff Routes

```bash
/api/v1/senior-staff
```

---

## Bed Routes

```bash
/api/v1/beds
```

---

## Forgot Password Routes

```bash
/api/v1/authF
```

---

# Middleware

## Authentication Middleware

The backend uses middleware-based route protection.

Features:

- JWT validation
- User authentication
- Protected API access
- Role verification

---

# Database

- MySQL Database
- TypeORM Integration
- SQL-first migration structure
- Normalized relational schema

---

# Environment Variables

Create a `.env` file in root directory:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_NAME=bedwatch

JWT_SECRET=your_secret_key

ALLOWED_ORIGINS=http://localhost:5173
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

---

# Project Highlights

- Enterprise-level backend architecture
- Modular DDD structure
- Clean service-controller separation
- Role-based authorization
- Scalable API structure
- Secure authentication workflow
- Real-world hospital management implementation

---

# Author

Developed as part of the BedWatch Hospital Bed & Resource Management System project.
