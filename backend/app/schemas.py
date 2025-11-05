from typing import List, Optional
from pydantic import BaseModel, Field


class CodeGenRequest(BaseModel):
    framework: str = Field(..., description="Agent framework, e.g., LangChain, CrewAI, Google ADK")
    model: str = Field(..., description="LLM model identifier for Groq")
    goal: str = Field(..., description="Overall goal or role description for the agent(s)")
    num_agents: int = Field(1, ge=1, le=10, description="Number of agents to create")
    tools: List[str] = Field(default_factory=list, description="List of tool names to include")
    memory: Optional[str] = Field(None, description="Memory configuration or notes")


class CodeGenResponse(BaseModel):
    code: str


class ExplainRequest(BaseModel):
    code: str


class ExplainResponse(BaseModel):
    explanation: str



