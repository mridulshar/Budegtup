# BudgetUp Backend (Spring Boot)

This is the backend service for BudgetUp, built using Java Spring Boot and MongoDB.

## Prerequisites

1.  **Java JDK 17+**: Ensure Java is installed (`java -version`).
2.  **Maven**: Ensure Maven is installed (`mvn -version`) or use the wrapper provided (if you generate one later).
3.  **MongoDB**: Ensure your MongoDB cluster is accessible. The connection string is in `src/main/resources/application.properties`.

## Project Structure

-   `src/main/java/com/budgetup`: Standard Java package structure.
    -   `config`: Configuration classes (e.g., CORS).
    -   `controller`: Handles HTTP requests (e.g., `UserController`).
    -   `model`: MongoDB Document classes (e.g., `User`).
    -   `repository`: Interfaces for database access (defines queries).
    -   `service`: Business logic layer.
-   `src/main/resources`: Configuration files.
    -   `application.properties`: Database connection string, server port, etc.

## How to Run

1.  Open the terminal in this directory (`Backend`).
2.  Run the application using Maven:
    ```bash
    mvn spring-boot:run
    ```
3.  The backend will start on **port 5000** (configured in `application.properties`).

## How to Add New Features

1.  **Create a Model**: Add a new class in `model` package annotated with `@Document`.
2.  **Create a Repository**: Create an interface extending `MongoRepository<YourModel, String>` in `repository`.
3.  **Create a Service**: Create a class in `service` to handle logic using the repository.
4.  **Create a Controller**: Create a class in `controller` with `@RestController` and add endpoints (GET, POST, etc.).

## Check if it works

-   Once running, visit `http://localhost:5000/api/users` in your browser or Postman to see the users (it will be empty initially).
-   To check database connection, check the console logs for MongoDB connection success.

## Environment Variables

Currently, the MongoDB URI is hardcoded in `application.properties` for simplicity. For production, consider using environment variables like `${MONGO_URI}`.
