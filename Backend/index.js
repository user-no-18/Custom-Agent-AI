import readline from "readline";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from '@langchain/langgraph';

// Hypothetical free tools
import { NewsSearch } from "@langchain/news";
import { WeatherSearch } from "@langchain/weather";
import { WikipediaSearch } from "@langchain/wikipedia";

// Initialize checkpointer
const checkpointer = new MemorySaver();

// Initialize Tavily tool
const tavilyTool = new TavilySearch({
    maxResults: 3,
    apiKey: process.env.TAVILY_API_KEY, 
    topic: 'general',
    includeAnswer: true,
    searchDepth: "basic",
});

// Initialize News tool
const newsTool = new NewsSearch({
    topic: 'technology',
    maxArticles: 5
});

// Initialize Weather tool
const weatherTool = new WeatherSearch({
    location: 'current' // can be dynamic later
});

// Initialize Wikipedia tool
const wikiTool = new WikipediaSearch({
    maxResults: 3
});

// Add all tools to the array
const tools = [tavilyTool, newsTool, weatherTool, wikiTool];
const toolNode = new ToolNode(tools);

// Initialize LLM
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxRetries: 2,
}).bindTools(tools);

// Node function
async function callModel(state) {
  console.log("Calling LLM...");
  const messages = state.messages.map((m) => ({
    role: m.role || "user",
    content: m.content || "",
  }));

  const response = await llm.invoke(messages);
  return { messages: [...messages, response] };
}

function shouldContinue(state) {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage.tool_calls.length > 0) return 'tools';
    return '__end__';
}

// Define workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addEdge("agent", "__end__")
  .addEdge('tools','agent')
  .addConditionalEdges('agent', shouldContinue);

const app = workflow.compile({ checkpointer });

// CLI
async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((res) => rl.question(q, res));

  console.log("Chatbot ready! Type '/bye' to exit.\n");

  while (true) {
    const userInput = await ask("You: ");
    if (userInput === "/bye") break;

    const finalState = await app.invoke(
      { messages: [{ role: "user", content: userInput }] },
      { configurable: { thread_id: "1" } }
    );

    const lastMessage = finalState.messages[finalState.messages.length - 1];
    console.log("AI:", lastMessage.content);
  }

  rl.close();
}

main();
