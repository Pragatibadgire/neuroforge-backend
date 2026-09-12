# NeuroForge Enterprise SDLC Platform

An enterprise-oriented **Software Development Life Cycle (SDLC) management platform** designed to manage and streamline software development activities from **requirements and project planning to testing, bug tracking, code management, and deployment**.

NeuroForge provides a centralized platform for different SDLC roles to manage projects, requirements, tasks, repositories, code commits, test cases, bugs, and deployments through a web-based interface and REST APIs.

---

## Overview

Software development involves multiple teams, activities, and stages. Managing these activities across separate tools can make it difficult to track project progress and maintain consistency.

**NeuroForge Enterprise SDLC Platform** brings major SDLC activities together into a single platform.

The system provides:

* Project and requirement management
* Task assignment and progress tracking
* Repository and code commit management
* Test case management
* Bug tracking
* Deployment management
* User and role management
* Dashboard-based project monitoring
* REST APIs for backend operations
* Swagger/OpenAPI API documentation

---

## Key Features

### User Management

* Create, view, update, and manage users
* Role-based user information
* Supports SDLC roles such as Administrator, Business Analyst, Project Manager, Developer, QA Engineer, DevOps Engineer, and Client

### Project Management

* Create and manage software projects
* Track project status
* Maintain project start and end dates
* Associate project activities with projects

### Requirement Management

* Manage software requirements
* Maintain requirement priority and status
* Track requirements throughout the development process

### Task Management

* Create and manage development tasks
* Track task status and due dates
* Associate tasks with projects

### Repository Management

* Maintain repository information
* Store repository links and related project information

### Code Commit Management

* Track code commits
* Maintain commit messages and dates
* Record changed files and repository links

### Test Case Management

* Create and manage test cases
* Maintain test steps and expected results
* Record actual results and execution status

### Bug Tracking

* Report and manage software bugs
* Track bug severity and status
* Associate bugs with test cases

### Deployment Management

* Maintain deployment information
* Track application deployment activities and status

### Dashboard

The dashboard provides a centralized view of important project information, including:

* Total projects
* Total requirements
* Total tasks
* Total bugs
* Overall project activity

---

## System Architecture

NeuroForge follows a layered architecture that separates presentation, business logic, data management, and infrastructure responsibilities.

```text
                    ┌──────────────────────────┐
                    │     Presentation Layer    │
                    │     React Web Frontend    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     Application Layer     │
                    │     Spring Boot Backend   │
                    │  Business Logic + REST   │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       Data Layer          │
                    │ Spring Data JPA / Hibernate│
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      MySQL Database       │
                    │ neuroforge_enterprise_sdlc│
                    └──────────────────────────┘
```

### Backend Architecture

The backend follows a layered structure:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Entity
    ↓
MySQL Database
```

This separation helps keep the application organized, maintainable, and easier to extend.

---

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3
* REST API integration

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* Maven
* REST APIs
* Swagger / OpenAPI

### Database

* MySQL

### Development Tools

* Visual Studio Code
* IntelliJ IDEA / Eclipse
* Git
* GitHub
* MySQL Workbench
* Swagger UI

---

## Main Modules

```text
NeuroForge Enterprise SDLC
│
├── Dashboard
├── User Management
├── Project Management
├── Requirement Management
├── Task Management
├── Repository Management
├── Code Commit Management
├── Test Case Management
├── Bug Tracking
└── Deployment Management
```

---

## Database

NeuroForge uses **MySQL** as its relational database.

### Database Name

```text
neuroforge_enterprise_sdlc
```

The database stores information related to:

* Users
* Projects
* Requirements
* Tasks
* Repositories
* Code commits
* Test cases
* Bugs
* Deployments

---

## Project Structure

The repository contains both the backend and frontend applications.

```text
neuroforge-backend/
│
├── backend/
│   ├── .mvn/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/neuroforge/neuroforge_backend/
│   │   │   │       ├── controller/
│   │   │   │       ├── entity/
│   │   │   │       ├── repository/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── README.md
├── LICENSE
└── .gitignore
```

---

## Backend API Documentation

The backend provides REST APIs for managing the different SDLC modules.

After starting the backend, Swagger UI can be accessed at:

```text
http://localhost:8080/swagger-ui/index.html
```

Swagger provides an interactive interface for viewing and testing the available REST endpoints.

---

# Getting Started

## Prerequisites

Make sure the following software is installed:

* Java 21
* MySQL
* Git
* Node.js and npm
* Maven (optional because Maven Wrapper is included)

---

## 1. Clone the Repository

```bash
git clone https://github.com/Pragatibadgire/neuroforge-backend.git
```

Move into the project directory:

```bash
cd neuroforge-backend
```

---

# 2. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE neuroforge_enterprise_sdlc;
```

Configure the database connection in:

```text
backend/src/main/resources/application.properties
```

Make sure the MySQL username and password match your local MySQL configuration.

---

# 3. Start the Backend

Open a terminal in the project root and run:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend will start on:

```text
http://localhost:8080
```

### Swagger UI

Once the backend is running:

```text
http://localhost:8080/swagger-ui/index.html
```

---

# 4. Start the Frontend

Open another terminal from the project root:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the URL in a web browser to access the NeuroForge application.

---

## Application Flow

The general workflow of the platform is:

```text
User Login
     ↓
Dashboard
     ↓
Create / Manage Project
     ↓
Manage Requirements
     ↓
Create and Assign Tasks
     ↓
Repository & Code Commit Management
     ↓
Create & Execute Test Cases
     ↓
Report & Track Bugs
     ↓
Deployment Management
     ↓
Project Monitoring
```

---

## REST API Modules

The backend exposes REST endpoints for the major application modules:

| Module       | Purpose                               |
| ------------ | ------------------------------------- |
| Users        | User and role management              |
| Projects     | Project creation and tracking         |
| Requirements | Requirement management                |
| Tasks        | Task management and progress tracking |
| Repositories | Repository information                |
| Code Commits | Commit tracking                       |
| Test Cases   | Test case management                  |
| Bugs         | Bug reporting and tracking            |
| Deployments  | Deployment management                 |

---

## Future Enhancements

The platform can be further extended with:

* AI-assisted SRS and requirement generation
* Advanced role-based authentication and authorization
* JWT-based security
* Real-time project notifications
* Advanced project analytics
* CI/CD pipeline integration
* Cloud deployment
* AI-assisted code review
* Automated testing integration
* Project progress and performance analytics

---

## Project Status

**Current Status:** Active Development

The current implementation provides a working web-based SDLC management platform with a React frontend, Spring Boot backend, MySQL database, and REST APIs.

---

## License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

## Author

**Pragati Badgire**

GitHub: [@Pragatibadgire](https://github.com/Pragatibadgire)

---

## Repository

**NeuroForge Enterprise SDLC Platform**

[GitHub Repository](https://github.com/Pragatibadgire/neuroforge-backend)
