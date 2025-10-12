import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from '@langchain/langgraph';

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

// Remove hypothetical tools for now - add real implementations later
const tools = [tavilyTool];
const toolNode = new ToolNode(tools);

// Initialize LLM with Groq
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile", // Valid Groq model
  temperature: 0.7,
  apiKey: process.env.GROQ_API_KEY,
  maxRetries: 2,
}).bindTools(tools);

// Node function
async function callModel(state) {
  console.log("🤖 Calling LLM...");
  const messages = state.messages;
  const response = await llm.invoke(messages);
  return { messages: [response] };
}

// Routing function
function shouldContinue(state) {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        return 'tools';
    }
    return '__end__';
}

// Define workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges('agent', shouldContinue)
  .addEdge('tools', 'agent');

const app = workflow.compile({ checkpointer });

// ==================== HTTP SERVER FOR NEXT.JS ====================

const PORT = process.env.PORT || 3001;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    
    // CORS headers for Next.js frontend
    const headers = {
      'Access-Control-Allow-Origin': 'http://localhost:3000', // Next.js default port
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // Health check endpoint
    if (url.pathname === '/health' && req.method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'ok', message: 'Jaervice backend is running! 😎' }), 
        { headers }
      );
    }

    // Main chat endpoint
    if (url.pathname === '/api/chat' && req.method === 'POST') {
      try {
        const body = await req.json();
        const { message, threadId = 'default-session' } = body;

        if (!message || !message.trim()) {
          return new Response(
            JSON.stringify({ error: 'Message is required' }),
            { status: 400, headers }
          );
        }

        console.log(`\n📨 [Thread: ${threadId}] User: ${message}`);

        // Invoke the LangGraph agent
        const finalState = await app.invoke(
          { messages: [{ role: "user", content: message }] },
          { configurable: { thread_id: threadId } }
        );

        const lastMessage = finalState.messages[finalState.messages.length - 1];
        const responseText = lastMessage.content || "I'm not sure how to respond to that.";

        console.log(`✅ [Thread: ${threadId}] AI: ${responseText.substring(0, 100)}...`);

        return new Response(
          JSON.stringify({ 
            response: responseText,
            threadId: threadId,
            timestamp: new Date().toISOString()
          }),
          { headers }
        );

      } catch (error) {
        console.error('❌ Error processing message:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to process message',
            details: error.message 
          }),
          { status: 500, headers }
        );
      }
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers }
    );
  },
});

console.log(`\n🚀 Jaervice Backend Server Started!`);
console.log(`📡 Server: http://localhost:${PORT}`);
console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
console.log(`❤️  Health: http://localhost:${PORT}/health\n`);