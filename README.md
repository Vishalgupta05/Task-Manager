# Task Manager — Full-Stack Task Management System

A full-stack task management application with secure JWT-based authentication
and personalized task management, built with Spring Boot + Spring Security on
the backend and React + Tailwind CSS on the frontend.

## Features
- JWT-based authentication (register/login), passwords hashed with BCrypt
- Personalized task lists — every user only sees their own tasks
- Full CRUD: create, update, delete, and toggle completion
- Priority levels (Low / Medium / High) and due-date management
- Responsive dashboard with search, filtering (priority/status), and progress tracking

## Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security, JWT (jjwt), Hibernate/JPA, MySQL
- **Frontend:** React 18 (Vite), React Router, Axios, Tailwind CSS

## Project Structure
```
task-manager/
├── backend/     # Spring Boot REST API
└── frontend/    # React + Tailwind SPA
```

## 1. Backend Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+ running locally

### Steps
1. Create a MySQL user/password matching `application.properties`, or edit
   `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```
   The database `task_manager_db` is auto-created on first run
   (`createDatabaseIfNotExist=true`).

2. From the `backend/` folder, run:
   ```bash
   mvn spring-boot:run
   ```
   The API starts on **http://localhost:8080**.

3. (Recommended for production) Move the JWT secret and DB credentials to
   environment variables instead of the properties file.

### API Endpoints
| Method | Endpoint                    | Description                       | Auth |
|--------|------------------------------|-----------------------------------|------|
| POST   | `/api/auth/register`         | Register a new user               | No   |
| POST   | `/api/auth/login`            | Log in, returns JWT                | No   |
| GET    | `/api/tasks`                 | List/search/filter tasks          | Yes  |
| GET    | `/api/tasks/{id}`            | Get one task                      | Yes  |
| POST   | `/api/tasks`                 | Create task                       | Yes  |
| PUT    | `/api/tasks/{id}`            | Update task                       | Yes  |
| PATCH  | `/api/tasks/{id}/toggle`     | Toggle completion                 | Yes  |
| DELETE | `/api/tasks/{id}`            | Delete task                       | Yes  |

`GET /api/tasks` supports optional query params: `keyword`, `priority`
(`LOW`/`MEDIUM`/`HIGH`), `completed` (`true`/`false`).

Authenticated requests need header: `Authorization: Bearer <token>`

## 2. Frontend Setup

### Prerequisites
- Node.js 18+

### Steps
```bash
cd frontend
npm install
npm run dev
```
The app runs on **http://localhost:5173** and talks to the backend at
`http://localhost:8080/api` (see `src/api/axios.js` to change this).

## 3. Using the App
1. Open http://localhost:5173, click **Create one** to register.
2. Log in — you'll land on the dashboard.
3. Add tasks with a title, description, priority, and due date.
4. Use the search box and dropdown filters to narrow the list.
5. Check the box to mark a task complete; watch the progress bar update.
6. Edit or delete tasks with the buttons on each row.

## Notes / Next Steps
- For production, set `jwt.secret`, DB credentials, and
  `app.cors.allowed-origins` via environment variables.
- Add refresh tokens if you want longer-lived sessions without re-login.
- Add pagination to `/api/tasks` if task lists grow large.
