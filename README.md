# Stratos - Aircraft Fleet Management System

Stratos is a full-stack web application for managing aircraft fleet operations. It provides role-based dashboards for administrators and engineers to manage aircraft, flights, users, and maintenance records.

## Features

### Authentication & Security
- JWT-based authentication with role-encoded tokens
- TOTP two-factor authentication with QR code setup for authenticator apps
- Password reset flow with OTP verification
- bcrypt password hashing

### Role-Based Access Control
Three user roles with distinct permissions:
- **Admin** - full access to users, aircraft, flights, and maintenance audit logs
- **Engineer** - access to maintenance records for assigned aircraft
- **Pilot** - account type supported, dashboard not yet implemented

### Aircraft Management
- Register aircraft with registration number, type, and operational status
- Full CRUD operations

### Flight Management
- Create and manage flights with departure/arrival airports (IATA codes) and aircraft assignment
- Automatic arrival time estimation based on aircraft cruising speed, range, and inter-airport distance
- Validation rules: aircraft must be operational, have sufficient range, no scheduling conflicts, and departure times must be in the future

### Maintenance Records
- Engineers can create, edit, and delete maintenance records for aircraft
- Records include type (Routine, Repair, Overhaul, Incident) and status (Pending, Scheduled, In Progress, Completed)
- Full audit trail: every create, update, and delete action is logged with before/after values

### General
- Filtering and sorting across all major entities
- RESTful API with a clear controller/service/repository architecture
- Global exception handling and CORS configuration

## Tech Stack

**Frontend**
- React 19 with TypeScript
- Vite
- Material-UI (MUI)
- React Router
- Axios

**Backend**
- Java 21
- Spring Boot 3
- Spring Data JPA
- PostgreSQL
- JJWT

## Project Structure

```
stratos/
├── frontend/       # React + TypeScript client
└── backend/        # Spring Boot REST API
```

## Running the Project

### Prerequisites
- Node.js
- Java 21
- PostgreSQL

### Backend
Set the following environment variable:
```
DB_HOST=<your_postgres_host>
```
Then run:
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend to be running on `http://localhost:8080`.
