# Curated For You By You - User Manual

## Introduction

Welcome to "Curated For You By You"! This application helps you discover new music by finding artists based on your location and preferred genres. Whether you're looking for local talent or exploring music scenes in other cities, our app provides a simple way to find new artists.

This manual will guide you through the features of the application and how to use them.

## Getting Started with Docker (Recommended)

The easiest way to run "Curated For You By You" is with Docker. Docker ensures that the application runs in a consistent environment on any computer (Windows, macOS, or Linux).

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system and ensure it is running.

### Running the Application

1.  **Open your terminal or command prompt.**

2.  **Build the backend service:**
    Navigate to the `backend` directory and run the following command:
    ```sh
    docker build -t cfyby-backend .
    ```

3.  **Build the frontend service:**
    Navigate to the `frontend/cfyby` directory and run the following command:
    ```sh
    docker build -t cfyby-frontend .
    ```

4.  **Start the backend service:**
    After the images are built, run this command to start the backend:
    ```sh
    docker run -d -p 8000:8000 --name cfyby-api cfyby-backend
    ```

5.  **Start the frontend service:**
    Finally, run this command to start the frontend:
    ```sh
    docker run -d -p 8080:80 --name cfyby-frontend-app cfyby-frontend
    ```

6.  **Access the application:**
    Open your web browser and go to: **[http://localhost:8080](http://localhost:8080)**

## How to Use the Application

The application is designed to be simple and intuitive. Here’s a walkthrough of the main features:

### 1. Landing Page

When you first open the application, you'll see the landing page. This page provides a brief introduction to the application. From here, you can navigate to the search page to start discovering artists.

### 2. Searching for Artists

1.  Navigate to the **Search Page** from the landing page.
2.  On the search page, you'll find a search form with the following fields:
    *   **Genre**: Select a music genre from the dropdown list.
    *   **Country**: Enter the country where you want to search for artists.
    *   **City**: Enter the city where you want to search for artists.
3.  After filling in the search criteria, click the "Search" button.
4.  The application will display a list of artists that match your search.

### 3. Viewing Artist Details

From the search results, you can click on any artist's name to view more details about them. The **Artist Page** provides comprehensive information, including:

*   **Artist Bio**: A summary or description of the artist.
*   **Albums**: A list of albums released by the artist.
*   **Images**: Pictures of the artist.

## Troubleshooting

If you encounter any issues, here are a few things to check:

*   **Application Not Loading**:
    *   Make sure Docker Desktop is running.
    *   Check if the containers are running with the command `docker ps`. You should see `cfyby-api` and `cfyby-frontend-app` in the list.
    *   If a container is not running, you can check its logs for errors:
        ```sh
        docker logs cfyby-api
        docker logs cfyby-frontend-app
        ```
*   **"Port is already allocated" error**: This means another service is using port 8080 or 8000. You can stop the conflicting service or change the port mapping in the `docker run` command. For example, to use port 8081 for the frontend: `docker run -d -p 8081:80 ...`
*   **"Unable to find image" or "pull access denied" error**: This error means Docker cannot find the specified image locally. Make sure you have successfully built the Docker image for the service you are trying to run. For example, before running `cfyby-frontend`, you must first build it with `docker build -t cfyby-frontend .` inside the `frontend/cfyby` directory.
*   **Running without Docker**: The application is configured to work both in Docker and when run locally. If you run the backend with `uvicorn` and the frontend with `npm run dev`, the frontend will still correctly connect to the backend at `http://localhost:8000`.
*   **No Search Results**: This is likely not a setup issue. Try broadening your search criteria.
*   **API Errors**: If the frontend is running but you see API errors, check the logs of the backend container (`docker logs cfyby-api`) to see if it's running correctly.

## Contact & Feedback

We are always looking to improve "Curated For You By You." If you have any questions, feedback, or suggestions, please feel free to reach out to the development team.

Thank you for using our application!
