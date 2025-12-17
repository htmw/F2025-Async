# Curated For You, By You - Backend API

This directory contains the Python backend for the "Curated For You, By You" application. It is built using the [FastAPI](https://fastapi.tiangolo.com/) framework and serves data about music artists and their albums from a MongoDB database.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
- [Running with Docker (Recommended)](#running-with-docker-recommended)
  - [Prerequisites for Docker](#prerequisites-for-docker)
  - [Running the Services](#running-the-services)
  - [Seeding the Database](#seeding-the-database)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes. While running locally is supported, the recommended method is to use Docker.

### Prerequisites

- Python 3.9+
- `pip` (Python package installer)

## Running with Docker (Recommended)

Using Docker Compose is the recommended way to run the backend application, as it ensures a consistent environment and manages the required database service.

### Prerequisites for Docker

- **Docker Desktop**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system (macOS, Windows, or Linux).

### Running the Services

A `docker-compose.yml` file is provided in this directory to manage the backend service and its dependencies.

1.  **Start the services:**
    From the `backend` directory, run:
    ```sh
    docker-compose up --build -d
    ```

    This command will:
    - Build the Docker image for the backend application.
    - Start the backend service.
    - Start a MongoDB service.
    - Start a Mongo Express service (a web-based admin tool for MongoDB).

2.  **Access the services:**
    - Backend API: **[http://localhost:8001](http://localhost:8001)**
    - Mongo Express: **[http://localhost:8081](http://localhost:8081)**

### Seeding the Database

To populate the MongoDB database with initial data, run the following command after the services are running:
```sh
docker-compose exec backend python seed_db.py
```

To stop all the services, run:
```sh
docker-compose down
```

## Running Locally

If you prefer to run the application without Docker, you can do so after completing the installation steps.

1.  **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

2.  **Set up a MongoDB instance:**
    Ensure you have a running MongoDB instance. You can install it locally or use a cloud service.

3.  **Configure environment variables:**
    ```sh
    # Copy the example environment file
    cp .env.example .env
    ```
    Edit the `.env` file and set `MONGO_URL` to your MongoDB connection string (e.g., `mongodb://localhost:27017/`). If you are using the cloud service, also set `AWS_URL` and `AWS_TOKEN`.

4.  **Seed the database:**
    ```sh
    python seed_db.py
    ```

5.  **Run the application:**
    ```sh
    uvicorn main:app --host 127.0.0.1 --port 8000 --reload
    ```
    The API will be available at `http://127.0.0.1:8000`.

## API Endpoints

The API provides several endpoints to access music data. Once the application is running, you can explore the interactive API documentation (Swagger UI) at `http://localhost:8001/docs` (if using Docker) or `http://localhost:8000/docs` (if running locally).

-   `GET /`: Provides basic information about the API.
-   `GET /artists`: Returns a list of artists, with optional filters for `genre`, `country`, and `city`.
-   `GET /artists/{name}`: Returns information for a specific artist.
-   `POST /artists/register`: Register a new artist.
-   `POST /artists/register/discography`: Add albums to an existing artist.
-   `GET /cloud/artists`: Fetches artist data from the external cloud service.

## Running Tests

The project includes a suite of tests written with `pytest`. The tests require a running MongoDB instance.

The recommended way to run the tests is inside the Docker container, as this provides an isolated environment with access to the database service.

From the `backend` directory, run:
```sh
docker-compose exec backend pytest
```