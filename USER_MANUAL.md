# Curated For You By You - User Manual

## Introduction

Welcome to "Curated For You By You"! This application helps you discover new music by finding artists based on your location and preferred genres. Whether you're looking for local talent or exploring music scenes in other cities, our app provides a simple way to find new artists.

This manual will guide you through the features of the application and how to use them.

## Getting Started with Docker (Recommended)

The easiest way to run "Curated For You By You" is with Docker Compose. This ensures that the application and its database run in a consistent environment on any computer (Windows, macOS, or Linux).

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system and ensure it is running.

### Running the Application

1.  **Open your terminal or command prompt.**

2.  **Navigate to the root directory of the project.**

3.  **Start the application:**
    Run the following command to build and start the frontend, backend, and database services:
    ```sh
    docker-compose up --build -d
    ```

4.  **Seed the database:**
    Once the services are running, you need to populate the database with music data. Run this command from the root project directory:
    ```sh
    docker-compose exec backend python seed_db.py
    ```

5.  **Access the application:**
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
    *   Check if the containers are running with the command `docker ps`. You should see containers for `frontend`, `backend`, and `mongodb`.
    *   If a container is not running, you can check its logs for errors. For example:
        ```sh
        docker-compose logs backend
        docker-compose logs frontend
        ```
*   **"Port is already allocated" error**: This means another service is using a required port (e.g., 8080, 8001, 27017). You can stop the conflicting service or change the port mapping in the `docker-compose.yml` file.
*   **No Search Results**: Make sure you have seeded the database by running `docker-compose exec backend python seed_db.py`. If you have, try broadening your search criteria.
*   **API Errors**: If the frontend is running but you see API errors, check the logs of the backend container (`docker-compose logs backend`) to see if it's running correctly.

## Contact & Feedback

We are always looking to improve "Curated For You By You." If you have any questions, feedback, or suggestions, please feel free to reach out to the development team.

Thank you for using our application!