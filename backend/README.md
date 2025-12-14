# Curated For You, By You - Backend API

This directory contains the Python backend for the "Curated For You, By You" application. It is built using the [FastAPI](https://fastapi.tiangolo.com/) framework and serves data about music artists and their albums.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running with Docker (Recommended)](#running-with-docker-recommended)
  - [Prerequisites for Docker](#prerequisites-for-docker)
  - [Building the Docker Image](#building-the-docker-image)
  - [Running the Docker Container](#running-the-docker-container)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes. While running locally is supported, the recommended method is to use Docker.

### Prerequisites

- Python 3.9+
- `pip` (Python package installer)
- `git`

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd F2025-Async/backend
    ```

2.  **Set up a virtual environment (optional but recommended):**
    ```sh
    python -m venv .venv
    source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

## Running with Docker (Recommended)

Using Docker is the recommended way to run the backend application, as it ensures a consistent environment across different operating systems (Linux, macOS, and Windows).

### Prerequisites for Docker

- **Docker Desktop**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system (macOS, Windows, or Linux).

### `.dockerignore` File

This directory includes a `.dockerignore` file, which works like a `.gitignore` file but for Docker. It lists files and directories that should be excluded from the Docker image. This is important for:
-   **Security**: Prevents sensitive files (like `.env`) from being included in the image.
-   **Performance**: Reduces the build context size and image size by excluding unnecessary files like virtual environments (`.venv`), IDE configurations (`.vscode`, `.idea`), and cache files (`__pycache__`).

### Building the Docker Image

The following command builds the Docker image. It should be run from the `backend` directory.

```sh
docker build -t cfyby-backend .
```

This command:
-   `docker build`: Initiates the Docker image build process.
-   `-t cfyby-backend`: Tags the image with the name `cfyby-backend`, making it easy to reference later.
-   `.`: Specifies that the build context (the set of files to be sent to the Docker daemon) is the current directory.

### Running the Docker Container

Once the image is built, you can run it as a container with the following command:

```sh
docker run -d -p 8000:8000 --name cfyby-api cfyby-backend
```

This command:
-   `docker run`: Creates and starts a new container from an image.
-   `-d`: Runs the container in detached mode (in the background).
-   `-p 8000:8000`: Maps port 8000 on your local machine to port 8000 inside the container.
-   `--name cfyby-api`: Assigns a memorable name to the container.
-   `cfyby-backend`: The name of the image to run.

The API will be available at `http://localhost:8000`.

To view the container's logs, use:
```sh
docker logs cfyby-api
```

To stop the container:
```sh
docker stop cfyby-api
```

## Running Locally

If you prefer to run the application without Docker, you can do so after completing the installation steps.

1.  **Configure environment variables:**
    ```sh
    # Copy the example environment file
    cp .env.example .env
    
    # Edit .env with your actual values (e.g., AWS_URL, AWS_TOKEN)
    ```

2.  **Run the application:**
    ```sh
    uvicorn main:app --host 127.0.0.1 --port 8000 --reload
    ```
    The API will be available at `http://127.0.0.1:8000`. The `--reload` flag enables hot-reloading for development.

## API Endpoints

The API provides several endpoints to access music data. Once the application is running, you can explore the interactive API documentation (Swagger UI) at `http://localhost:8000/docs`.

-   `GET /`: Provides basic information about the API.
-   `GET /artists`: Returns a list of artists, with optional filters for `genre`, `country`, and `city`.
-   `GET /artists/{name}`: Returns information for a specific artist.
-   `GET /cloud/artists`: Fetches artist data from the external cloud service.

## Running Tests

The project includes a suite of tests written with `pytest`.

1.  **Install testing dependencies:**
    ```sh
    pip install pytest "fastapi[all]"
    ```
2.  **Run the tests:**
    From the root of the project (`F2025-Async`), run:
    ```sh
    pytest
    ```

