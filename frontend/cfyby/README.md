# CFYBY Frontend - "Curated For You By You"

This project is the frontend for the CFYBY application, built with React, TypeScript, and Vite.

## Table of Contents

- [Running with Docker (Recommended)](#running-with-docker-recommended)
  - [Prerequisites](#prerequisites)
  - [Building the Docker Image](#building-the-docker-image)
  - [Running the Docker Container](#running-the-docker-container)
- [Troubleshooting](#troubleshooting)
- [Local Development Setup](#local-development-setup)
- [Project Tools](#project-tools)

## Running with Docker (Recommended)

Using Docker is the recommended way to run the frontend application, as it provides a consistent and isolated environment across different operating systems (Linux, macOS, and Windows).

### Prerequisites

- **Docker Desktop**: You must have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your system.

### `.dockerignore` File

This directory contains a `.dockerignore` file, which is crucial for building an efficient and secure Docker image. It prevents local development files, such as `node_modules`, environment files (`.env*.local`), and build artifacts (`dist`), from being copied into the Docker image. This results in a smaller image and faster build times.

### Building the Docker Image

To build the frontend Docker image, run the following command from the `frontend/cfyby` directory:

```sh
docker build -t cfyby-frontend .
```

- `docker build`: Command to build a Docker image.
- `-t cfyby-frontend`: Tags the image with the name `cfyby-frontend` for easy reference.
- `.`: Specifies the current directory as the build context.

### Running the Docker Container

After the image is built, you can run it as a container:

```sh
docker run -d -p 8080:80 --name cfyby-frontend-app cfyby-frontend
```

- `-d`: Runs the container in detached mode (in the background).
- `-p 8080:80`: Maps port 8080 on your local machine to port 80 inside the container. You can access the application at `http://localhost:8080`.
- `--name cfyby-frontend-app`: Assigns a convenient name to the container.
- `cfyby-frontend`: The name of the image to run.

You can now access the application by navigating to `http://localhost:8080` in your web browser.

## Troubleshooting

### "Unable to find image 'cfyby-frontend:latest' locally"

If you encounter this error when running `docker run`, it means the Docker image was not built locally. You must first build the image using the `docker build` command before you can run a container from it.

**Solution:**
1.  Make sure you are in the `frontend/cfyby` directory.
2.  Run the build command:
    ```sh
    docker build -t cfyby-frontend .
    ```
3.  Once the build is successful, you can run the container.

## Local Development Setup

If you prefer to run the application directly on your machine, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

3.  **Build for production:**
    ```bash
    npm run build
    ```
    This command builds the application for production in the `dist` folder.

4.  **Lint the code:**
    ```bash
    npm run lint
    ```
    This runs ESLint to check for code quality and style issues.

## Project Tools

This project uses a variety of modern web development tools:

-   **[Vite](https://vitejs.dev/):** A next-generation frontend tooling that provides a faster and leaner development experience.
-   **[React](https://react.dev/):** A JavaScript library for building user interfaces.
-   **[TypeScript](https://www.typescriptlang.org/):** A typed superset of JavaScript that compiles to plain JavaScript.
-   **[Material-UI (MUI)](https://mui.com/):** A popular React UI framework for faster and easier web development.
-   **[React Router](https://reactrouter.com/):** A standard library for routing in React.
-   **[ESLint](https://eslint.org/):** A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
