from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import CodeGenRequest, CodeGenResponse, ExplainRequest, ExplainResponse
from .llm import generate_code_with_llm, explain_code_with_llm
from .examples import example_langchain_agent
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    # dotenv is optional; ignore if missing
    pass


app = FastAPI(title="Agentic AI Code Portal Backend", version="0.1.0")

# CORS (allow local dev frontends; tighten for prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/generate_code", response_model=CodeGenResponse)
def generate_code(payload: CodeGenRequest) -> CodeGenResponse:
    try:
        code = generate_code_with_llm(payload)
        return CodeGenResponse(code=code)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/explain", response_model=ExplainResponse)
def explain(payload: ExplainRequest) -> ExplainResponse:
    try:
        explanation = explain_code_with_llm(payload.code)
        return ExplainResponse(explanation=explanation)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/examples/langchain", response_model=CodeGenResponse)
def get_example_langchain() -> CodeGenResponse:
    return CodeGenResponse(code=example_langchain_agent())


