# Curated For You By You

This project consists of a frontend (React/Vite) and a backend (FastAPI) application. This README provides instructions on how to set up and run the entire application using Docker Compose.

## Table of Contents
- [Getting Started](#getting-started)
- [Services](#services)
- [Seeding the Database](#seeding-the-database)
- [Development](#development)

## Getting Started

The easiest way to run the entire application is with Docker Compose.

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system and ensure it is running.

### Running the Application

1.  **Clone the repository.**

2.  **Start the services:**
    From the root directory of the project, run:
    ```sh
    docker-compose up --build -d
    ```
    This command will build the images for the frontend and backend services and start all the necessary containers in detached mode.

3.  **Seed the database:**
    The backend service uses a MongoDB database. To populate it with initial data, run the following command after the services have started:
    ```sh
    docker-compose exec backend python seed_db.py
    ```

4.  **Access the application:**
    - Frontend application: **[http://localhost:8080](http://localhost:8080)**
    - Backend API: **[http://localhost:8001](http://localhost:8001)**
    - Mongo Express (database admin): **[http://localhost:8081](http://localhost:8081)**

To stop all the services, run:
```sh
docker-compose down
```

## Services

The `docker-compose.yml` file defines the following services:

- **frontend**: The React/Vite frontend application.
- **backend**: The FastAPI backend application.
- **mongodb**: The MongoDB database.
- **mongo-express**: A web-based admin interface for MongoDB.

## Development

### Backend-only Development

If you want to work only on the backend, you can use the `docker-compose.yml` file located in the `backend` directory. This will start the backend service along with the MongoDB database and Mongo Express.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Start the services:
   ```bash
   docker-compose up --build -d
   ```
This setup uses a volume mount for the backend code, allowing for hot-reloading. Refer to `backend/README.md` for more details.