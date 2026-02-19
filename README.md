# Task Management System

## Introduction

The Task Management System is a full-stack web application that allows
users to:

- Register and login
- Create tasks
- Assign tasks to registered users
- Update tasks
- Delete tasks
- Logout securely

This repository contains both the **Frontend (FE)** and **Backend (BE)**
in a single project.

---

## Table of Contents

- Project Overview
- Architecture
- Tech Stack
- Folder Structure
- Setup & Run Instructions
- API Overview
- Trade-offs and Assumptions
- Future Improvements
- License

---

## Project Overview

This system enables authenticated users to manage tasks efficiently.
Users can create tasks and assign them to registered users. All task
operations require authentication.

---

## Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │  HTTP   │                 │  Query  │                 │
│    Frontend     │ ──────► │    Backend      │ ──────► │   PostgreSQL    │
│   (Next.js)     │ ◄────── │  (Node/Express) │ ◄────── │   Database      │
│                 │  JSON   │                 │  Data   │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Request Flow

```
User Action (Browser)
       │
       ▼
Next.js Frontend (React Components)
       │
       │  HTTP REST API (Axios)
       ▼
Express.js Backend
       │
       ├── Auth Middleware (JWT Verification)
       │
       ├── Route Handler
       │
       ├── Controller (Business Logic)
       │
       ▼
Prisma ORM
       │
       ▼
PostgreSQL Database
```

### Tech Stack

| Layer    | Technology                           |
| -------- | ------------------------------------ |
| Frontend | Next.js, React, Formik               |
| Styling  | Tailwind CSS, Shadcn UI, Lucide icon |
| Backend  | Node.js, Express.js                  |
| Database | PostgreSQL                           |
| ORM      | Prisma                               |
| Auth     | JWT, Bcrypt                          |
| API Docs | Swagger UI                           |

### Frontend Responsibilities

- Render UI
- Handle authentication state
- Send API requests to backend
- Display tasks and user information

### Backend Responsibilities

- Provide RESTful APIs
- Handle authentication (login/logout)
- Validate requests
- Manage business logic
- Connect to database
- Authorize task operations

---

## Folder Structure

## Project Structure

```
root/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   │   ├── sign-in/         # Login page
│   │   │   │   └── sign-up/         # Register page
│   │   │   └── (main)/
│   │   │       ├── layout.tsx       # Main layout (header + task view)
│   │   │       └── home/            # Home / dashboard page
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── data-table.tsx   # Shadcn table component
│   │   │   │   ├── header.tsx       # Header component
│   │   │   │   └── text-field.tsx   # Reusable input component
│   │   │   ├── task/
│   │   │   │   ├── delete-task.tsx  # Handle task deletion
│   │   │   │   ├── task-form.tsx    # Handle create and update
│   │   │   │   └── task-table.tsx   # Task list table
│   │   │   └── ui/                  # Shadcn installed components
│   │   ├── lib/
│   │   │   └── api.ts               # Axios client instances
│   │   └── middleware.ts            # Route protection
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/              # Database migrations
│   │   └── schema.prisma            # Prisma schema definition
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                # Prisma client instance
│   │   │   └── swagger.js           # Swagger configuration
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register and login logic
│   │   │   ├── taskController.js    # Task CRUD logic
│   │   │   └── userController.js    # Get users logic
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification
│   │   │   └── errorMiddleware.js   # Centralized error handling
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/v1/auth
│   │   │   ├── taskRoutes.js        # /api/v1/tasks
│   │   │   └── userRoutes.js        # /api/v1/users
│   │   └── app.js                   # Express app setup
│   ├── .env                         # Environment variables
│   ├── prisma.config.ts             # Prisma datasource config
│   ├── server.js                    # Entry point
│   └── package.json
│
└── README.md
```

---

## Setup & Run Instructions

### Prerequisites

- Node.js (v20 or above)
- npm or pnpm
- Database installed and running
- Git

---

## Database Migrations

```bash
# Apply all migrations
npx prisma migrate deploy

# Create new migration (development only)
npx prisma migrate dev --name <migration_name>

# Reset database (development only — drops all data)
npx prisma migrate reset
```

---

### Backend Setup

1. Navigate to backend directory:

```bash
cd task_management-be
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root of the backend:

```env
PORT=8080
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/task_management"
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

4. Run Prisma migrations:

```bash
npx prisma migrate deploy
```

5. Generate Prisma client:

```bash
npx prisma generate
```

6. Start the backend server:

```bash
npm run dev        # development
```

Backend runs on: http://localhost:8080

API Documentation: http://localhost:8080/api-docs

---

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd task_management-fe
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root of the frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Start the frontend:

```bash
npm run dev        # development
```

Frontend runs on: http://localhost:3000

---

## Features

- User Registration
- User Login
- Create Task
- Assign Task to Registered User
- Update Task
- Delete Task
- View All Tasks
- Authentication & Authorization

---

## API Overview

### Authentication

| Method | Endpoint              | Description         | Auth |
| ------ | --------------------- | ------------------- | ---- |
| POST   | /api/v1/auth/register | Register a new user | ❌   |
| POST   | /api/v1/auth/login    | Login user          | ❌   |

### Tasks

| Method | Endpoint             | Description               | Auth |
| ------ | -------------------- | ------------------------- | ---- |
| GET    | /api/v1/tasks        | Get all tasks (paginated) | ✅   |
| POST   | /api/v1/tasks        | Create a task             | ✅   |
| PUT    | /api/v1/tasks        | Update a task             | ✅   |
| DELETE | /api/v1/tasks/:id    | Delete a task             | ✅   |
| GET    | /api/v1/tasks/filter | Filter by status/priority | ✅   |

### Users

| Method | Endpoint      | Description   | Auth |
| ------ | ------------- | ------------- | ---- |
| GET    | /api/v1/users | Get all users | ✅   |

---

### API Documentation

The backend provides interactive API documentation using Swagger.
After starting the backend server, access Swagger UI at:
Swagger UI: http://localhost:8080/api-docs/

## Trade-offs and Assumptions

### Assumptions

- Users must be registered before being assigned tasks.
- All task operations require authentication.
- Each task is assigned to one registered user.
- Designed for small to medium scale usage.

### Trade-offs

1.  Monorepo structure simplifies development but limits independent
    scaling.
2.  Basic authorization without advanced role-based access control.
3.  REST API chosen for simplicity over GraphQL.
4.  Simple authentication suitable for development use.

---

## Future Improvements

- Role-based access control (Admin/User)
- Unit and integration tests
- Docker support
- CI/CD pipeline

---
