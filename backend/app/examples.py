def example_langchain_agent() -> str:
    return (
        '''
import os
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import tool
from langchain import hub

# Requires OPENAI_API_KEY set in environment
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

@tool
def search_tool(query: str) -> str:
    """Pretend search tool that echoes the query."""
    return f"Results for: {query}"

tools = [search_tool]

prompt = hub.pull("hwchase17/react")
agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = agent_executor.invoke({"input": "Find the capital of France."})
print(result["output"])  # Should mention Paris
        '''.strip()
    )


