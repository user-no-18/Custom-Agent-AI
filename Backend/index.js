
import readline from "readline";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from '@langchain/langgraph';
import axios from 'axios';
import { Tool } from "@langchain/core/tools";

// NewsAPI Tool
class NewsApiTool extends Tool {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.name = "news_api";
    this.description = "Fetches news articles from NewsAPI";
  }

  async call(query) {
    if (!this.apiKey) return "NewsAPI key missing!";
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${this.apiKey}`;
    try {
      const response = await axios.get(url);
      const articles = response.data.articles.slice(0, 3);
      return articles.length
        ? articles.map(a => `${a.title}: ${a.url}`).join("\n")
        : "No news found.";
    } catch (err) {
      return `Error fetching news: ${err.message}`;
    }
  }
}

// Initialize checkpointer
const checkpointer = new MemorySaver();

// Initialize tools
const tavilyTool = new TavilySearch({
    maxResults: 3,
    apiKey: process.env.TAVILY_API_KEY, 
    topic: 'general',
    includeAnswer: true,
    searchDepth: "basic",
});
const newsApiTool = new NewsApiTool(process.env.NEWS_API_KEY);
const tools = [tavilyTool, newsApiTool];
const toolNode = new ToolNode(tools);

// Initialize LLM
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxRetries: 2,
}).bindTools(tools);

// LLM call function
async function callModel(state) {
  const messages = state.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  console.log("Calling LLM...");
  const response = await llm.invoke(messages);
  console.log("LLM Response:", response);
  return { messages: [...state.messages, response] };
}

// Tool execution node with output appended to messages
async function toolNodeHandler(state) {
  const lastMessage = state.messages[state.messages.length - 1];
  if (!lastMessage.tool_calls?.length) {
    return state;
  }
  let updatedMessages = [...state.messages];
  for (const toolCall of lastMessage.tool_calls) {
    const tool = tools.find(t => t.name === toolCall.name);
    if (!tool) {
      updatedMessages.push({
        role: "tool",
        content: `Tool "${toolCall.name}" not found.`,
      });
      continue;
    }
    console.log(`Calling tool: ${toolCall.name} with argument:`, toolCall.args);
    let toolResult;
    try {
      toolResult = await tool.call(toolCall.args || toolCall.input || "");
    } catch (e) {
      toolResult = `Error with tool "${toolCall.name}": ${e.message}`;
    }
    updatedMessages.push({
      role: "tool",
      content: toolResult,
      name: toolCall.name,
    });
    console.log("Tool result:", toolResult);
  }
  return { ...state, messages: updatedMessages };
}

// Conditional edge only triggers tool node if last message is an agent/assistant with tool_calls
function shouldContinue(state) {
  const lastMessage = state.messages[state.messages.length - 1];
  if (
    lastMessage.role === "assistant" &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls.length > 0
  ) {
    return 'tools';
  }
  return '__end__';
}

// Workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNodeHandler)
  .addEdge("__start__", "agent")
  .addEdge("agent", "__end__")
  .addEdge('tools','agent')
  .addConditionalEdges('agent', shouldContinue);

const app = workflow.compile({ checkpointer });

// Main loop
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

    // Find the last assistant message (the final answer)
    const lastAssistant = [...finalState.messages].reverse().find(m => m.role === "assistant");
    if (lastAssistant) {
      console.log("AI:", lastAssistant.content);
    } else {
      console.log("AI: (No response)");
    }
  }

  rl.close();
}

main();