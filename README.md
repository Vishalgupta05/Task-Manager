# 📋 Task Manager — Full-Stack Task Management System

A full-stack task management web application with secure JWT-based authentication, built with **Spring Boot 3 + Spring Security** on the backend and **React 18 (Vite) + Tailwind CSS** on the frontend. Every user gets their own private, searchable, filterable task list.

---

## ✨ Features

- 🔐 **JWT authentication** — register & login, passwords hashed with BCrypt
- 👤 **Per-user task isolation** — every user only sees and manages their own tasks
- ✅ **Full CRUD** — create, read, update, delete tasks
- 🔄 **One-click completion toggle**
- 🏷️ **Priority levels** — `LOW` / `MEDIUM` / `HIGH` (defaults to `MEDIUM`)
- 📅 **Due dates** with overdue highlighting on the frontend
- 🔍 **Search & filter** — by keyword, priority, and completion status (server-side)
- 📊 **Auto-logout** on token expiry (401 response) via an Axios interceptor
- 🛡️ **Centralized error handling** — validation errors, 404s, and access-denied cases return clean JSON

---

## 📸 Screenshots

**Dashboard — empty state**
![Dashboard empty state]<img width="960" height="600" alt="Screenshot 2026-09-10 114121" src="https://github.com/user-attachments/assets/b999d47f-f5ae-4397-9f2c-e9d7ba98b7fb" />


**Dashboard — task list with priorities & due dates**
![Dashboard with tasks]<img width="958" height="595" alt="Screenshot 2026-09-10 114642" src="https://github.com/user-attachments/assets/55e59c84-53f7-4991-91ce-81bb65ae4934" />


**Dashboard — progress tracking & status filter**
![Dashboard progress tracking]<img width="960" height="600" alt="Screenshot 2026-09-10 114719" src="https://github.com/user-attachments/assets/a7257087-39cd-4751-aeff-7416c0ee8032" />


---

## 🧱 Tech Stack

| Layer        | Technology |
|--------------|------------|
| Backend      | Java 17, Spring Boot 3.3.2, Spring Security, Spring Data JPA / Hibernate |
| Auth         | JWT (`jjwt` 0.12.5), BCrypt password hashing |
| Database     | MySQL 8 |
| Frontend     | React 18, Vite 5, React Router 6, Axios |
| Styling      | Tailwind CSS 3 |
| Build tools  | Maven (backend), npm (frontend) |

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/taskmanager/
│       │   ├── TaskManagerApplication.java
│       │   ├── config/          # SecurityConfig — Spring Security & CORS
│       │   ├── controller/      # AuthController, TaskController
│       │   ├── dto/             # AuthRequest, AuthResponse, RegisterRequest, TaskRequest, TaskResponse
│       │   ├── entity/          # User, Task, Priority
│       │   ├── exception/       # GlobalExceptionHandler
│       │   ├── repository/      # TaskRepository, UserRepository
│       │   ├── security/        # JwtAuthFilter, JwtUtil, CustomUserDetailsService
│       │   └── service/         # TaskService
│       └── resources/
│           └── application.properties
│
├── frontend/
│   ├── package.json / vite.config.js / tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   └── axios.js         # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── TaskForm.jsx
│       │   ├── TaskItem.jsx
│       │   └── TaskList.jsx
│       ├── context/
│       │   └── AuthContext.jsx  # login/register/logout state
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           └── Dashboard.jsx
│
└── screenshots/                 # App screenshots used in this README
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+ running locally
- Node.js 18+

### 1. Backend Setup

The database `task_manager_db` is created automatically on first run.

1. Open `backend/src/main/resources/application.properties` and set your local MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=<your-mysql-password>
   ```
2. Run the backend from the `backend/` folder:
   ```bash
   mvn spring-boot:run
   ```
3. The API starts on **http://localhost:8080**.

> ⚠️ **Security note:** `application.properties` currently contains a hardcoded JWT secret and DB password for local development. Before deploying to production, move `jwt.secret`, `spring.datasource.password`, and `app.cors.allowed-origins` into environment variables.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on **http://localhost:5173** and talks to the backend at `http://localhost:8080/api` (configured in `src/api/axios.js`).

### 3. Using the App

1. Go to `http://localhost:5173` and register a new account.
2. Log in — you'll land on the dashboard.
3. Add a task with a title, description, priority, and due date.
4. Use the search box and priority/status filters to narrow the list.
5. Check the box to mark a task complete, or edit/delete it from the row.

---

## 🔌 API Reference

Base URL: `http://localhost:8080/api`

### Auth (`/auth`) — no token required

| Method | Endpoint         | Description                    |
|--------|------------------|---------------------------------|
| POST   | `/auth/register` | Register a new user, returns JWT |
| POST   | `/auth/login`    | Log in, returns JWT              |

### Tasks (`/tasks`) — requires `Authorization: Bearer <token>`

| Method | Endpoint             | Description                                         |
|--------|-----------------------|------------------------------------------------------|
| GET    | `/tasks`              | List tasks (supports `keyword`, `priority`, `completed` query params) |
| GET    | `/tasks/{id}`         | Get a single task                                    |
| POST   | `/tasks`               | Create a new task                                    |
| PUT    | `/tasks/{id}`         | Update a task                                        |
| PATCH  | `/tasks/{id}/toggle`  | Toggle completion status                             |
| DELETE | `/tasks/{id}`         | Delete a task                                        |

**Example — create a task:**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Finish README", "priority": "HIGH", "dueDate": "2026-09-20"}'
```

---

## 🗄️ Data Model

**User**
- `id`, `username` (unique), `email` (unique), `password` (BCrypt-hashed), `createdAt`

**Task**
- `id`, `title`, `description`, `priority` (`LOW`/`MEDIUM`/`HIGH`), `dueDate`, `completed`, `createdAt`, `updatedAt`, `user` (owning user, foreign key)

Each task belongs to exactly one user (`@ManyToOne`), and all task queries are scoped by the authenticated user's ID — so users can never see or modify each other's tasks.

---

## 🛠️ Roadmap / Possible Improvements

- [ ] Move secrets (JWT key, DB password) to environment variables for production
- [ ] Add refresh tokens for longer-lived sessions without re-login
- [ ] Add pagination to `GET /api/tasks` for large task lists
- [ ] Add automated tests (unit + integration)
- [ ] Dockerize backend + frontend + MySQL for one-command setup

---

## 📄 License

No license specified yet — add one (e.g. MIT) if you plan to open-source this project publicly.
