# NeuroForge Enterprise SDLC Platform

An AI-powered enterprise Software Development Life Cycle (SDLC) platform designed to support software development activities from requirements to deployment.

## Features

- User management
- Project management
- Requirement management
- Task management
- Repository management
- Code commit management
- Test case management
- Bug tracking
- Deployment management
- REST APIs for backend operations

## Technology Stack

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- REST API

## Backend Architecture

The backend follows a layered architecture:

**Controller → Service → Repository → Entity → MySQL Database**

### Main Backend Modules

- User
- Project
- Requirement
- Task
- Repository
- Code Commit
- Test Case
- Bug
- Deployment

## Database

Database name:

`neuroforge_enterprise_sdlc`

The application uses MySQL for persistent data storage.

## Running the Project

### Prerequisites

- Java
- MySQL
- Maven
- Git

### Database Configuration

Set your MySQL database password as an environment variable:

```powershell
$env:DB_PASSWORD="your_database_password"
```

### Start the Backend

From the project directory, run:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs by default on:

`http://localhost:8080`

## Project Structure

```text
src
└── main
    └── java
        └── com.neuroforge.neuroforge_backend
            ├── controller
            ├── entity
            ├── repository
            └── service
```

## License

This project is licensed under the MIT License.
