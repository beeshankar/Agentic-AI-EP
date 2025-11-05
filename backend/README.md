# Backend
This directory contains the backend services for the application. It is built using FastAPI and Python.

## Functionality
- **LLM Integration**: Integrates with Large Language Models (LLMs) for various AI-powered functionalities. (e.g., Groq and OpenAI)
- **API Endpoints**: Provides RESTful APIs for the frontend to interact with, likely including endpoints for LLM interactions and other backend logic.
- **Example Endpoints**: Contains example endpoints in `examples.py` demonstrating usage and integration patterns.

## Setup

### Prerequisites
- Python 3.9+
- `pip` (Python package installer)

### Installation

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment (recommended):
    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```
3.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### Environment Variables
The application requires certain environment variables to be set, particularly for LLM API keys.

-   `GROQ_API_KEY`: Your API key for Groq services.
-   `OPENAI_API_KEY`: Your API key for OpenAI services (if used).

You can set these in your shell or use a `.env` file.

### Running the Application

1.  Ensure your virtual environment is active and dependencies are installed.
2.  Run the FastAPI application using Uvicorn:
    ```bash
    uvicorn app.main:app --reload
    ```
    The `--reload` flag enables live-reloading, which is useful for development.

The backend server will typically run on `http://127.0.0.1:8000`. You can access the API documentation (Swagger UI) at `http://127.0.0.1:8000/docs`.
