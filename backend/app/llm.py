import os
from typing import Optional
from .schemas import CodeGenRequest


# Lazy import to avoid import error if package not installed yet
_groq_client = None


def _get_groq_client():
    global _groq_client
    if _groq_client is None:
        try:
            from groq import Groq  # type: ignore
        except Exception as exc:  # pragma: no cover
            raise RuntimeError("groq package not installed. Run `pip install groq`.") from exc
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY env var is required")
        _groq_client = Groq(api_key=api_key)
    return _groq_client


def _build_codegen_prompt(payload: CodeGenRequest) -> str:
    tools_text = ", ".join(payload.tools) if payload.tools else "none"
    memory_text = payload.memory or "none"
    return (
        "You are an expert agentic AI developer educator. "
        "Generate clean, idiomatic Python code with inline comments that sets up the requested agent framework. "
        "Constraints: No placeholders for API keys other than environment variables, runnable as-is when keys are set, and include a minimal example run.\n\n"
        f"Framework: {payload.framework}\n"
        f"LLM Model: {payload.model}\n"
        f"Goal/Role: {payload.goal}\n"
        f"Number of agents: {payload.num_agents}\n"
        f"Tools: {tools_text}\n"
        f"Memory: {memory_text}\n\n"
        "Output only Python code inside one block; no extra explanations."
    )


def generate_code_with_llm(payload: CodeGenRequest) -> str:
    client = _get_groq_client()
    prompt = _build_codegen_prompt(payload)

    # Use chat.completions API compatible interface
    completion = client.chat.completions.create(
        model=payload.model,
        messages=[
            {"role": "system", "content": "You write production-quality Python for agent frameworks."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
        max_tokens=1600,
    )
    content = completion.choices[0].message.content or ""
    return content.strip()


def _build_explain_prompt(code: str) -> str:
    return (
        "Explain the following Python code for an educational audience. "
        "Use clear sections, bullet points, and mention how to run it.\n\n"
        f"```python\n{code}\n```"
    )


def explain_code_with_llm(code: str, model: Optional[str] = None) -> str:
    client = _get_groq_client()
    chosen_model = model or os.environ.get("GROQ_MODEL", "llama3-8b-8192")
    prompt = _build_explain_prompt(code)

    completion = client.chat.completions.create(
        model=chosen_model,
        messages=[
            {"role": "system", "content": "You are a helpful educator who explains Python agent code."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=1200,
    )
    content = completion.choices[0].message.content or ""
    return content.strip()


