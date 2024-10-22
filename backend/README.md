# Backend Service

This is the backend service for our application. It is built using FastAPI, a modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- Python 3.6+
- pip (Python package installer)
- virtualenv (optional, but recommended)

### Installation

1. Create and activate a virtual environment (optional but recommended):
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

2. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

### Running the Application

To start the backend server, run the following command:
    ```sh
    uvicorn main:app --reload
    ```

The server will start and you can access the API documentation at `http://127.0.0.1:8000/docs`.

### Project Structure

- `main.py`: The entry point of the application.
- `app/`: Directory containing the main application code.
- `requirements.txt`: File listing the dependencies required for the project.

### Learn More

To learn more about FastAPI, visit the [FastAPI documentation](https://fastapi.tiangolo.com/).
