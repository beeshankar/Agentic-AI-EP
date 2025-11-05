# Agentic AI Educational Portal

End-to-end scaffold: React + Tailwind (frontend) with FastAPI (backend) and Groq LLM integration for generating and explaining agent code.

## Overview
This repository contains a full-stack application for an Agentic AI Educational Portal. It consists of a React-based frontend and a FastAPI-based backend, designed to interact with Large Language Models (LLMs) to generate and explain agent code.

## Prerequisites
- Node 18+
- Python 3.10+
- Groq API key

## Backend
This directory contains the backend services for the application. It is built using FastAPI and Python.

### Functionality
-   **LLM Integration**: Integrates with Large Language Models (LLMs) for various AI-powered functionalities. (e.g., Groq and OpenAI)
-   **API Endpoints**: Provides RESTful APIs for the frontend to interact with, likely including endpoints for LLM interactions and other backend logic.
-   **Example Endpoints**: Contains example endpoints in `examples.py` demonstrating usage and integration patterns.

### Backend Setup

#### Prerequisites
- Python 3.9+
- `pip` (Python package installer)

#### Installation

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

#### Environment Variables
The application requires certain environment variables to be set, particularly for LLM API keys.

-   `GROQ_API_KEY`: Your API key for Groq services.
-   `OPENAI_API_KEY`: Your API key for OpenAI services (if used).

You can set these in your shell or use a `.env` file.

#### Running the Backend Application

1.  Ensure your virtual environment is active and dependencies are installed.
2.  Run the FastAPI application using Uvicorn:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
    The `--reload` flag enables live-reloading, which is useful for development.

    The backend server will typically run on `http://127.0.0.1:8000`. You can access the API documentation (Swagger UI) at `http://127.0.0.1:8000/docs`.

#### Backend Endpoints
- POST `/generate_code`
  - body: `{ framework, model, goal, num_agents, tools, memory }`
  - returns: `{ code }`
- POST `/explain`
  - body: `{ code }`
  - returns: `{ explanation }`
- GET `/examples/langchain` -> returns `{ code }` example

Health check: GET http://localhost:8000/health

## Frontend
This directory contains the frontend application, built with React, TypeScript, and Vite.

### Functionality
-   **User Interface**: Provides the interactive user interface for the application.
-   **LLM Interaction**: Communicates with the backend services to send requests to and display responses from the LLMs.
-   **Component-based Architecture**: Utilizes React components for modular and reusable UI elements.

### Frontend Setup

#### Prerequisites
-   Node.js (118 or later recommended)
-   npm or yarn

#### Installation

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

#### Running the Frontend Application

1.  Ensure all dependencies are installed.
2.  Start the development server:
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```

    Open http://localhost:5173

## Notes
- The backend uses Groq chat completions. Set `GROQ_API_KEY` before running.
- The UI provides framework/model dropdowns, inputs, and syntax-highlighted preview.
- Adjust CORS origins in `backend/app/main.py` as needed.

