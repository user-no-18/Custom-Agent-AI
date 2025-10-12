# 🤖 Custom AI Chatbot — Agentic AI with Web Search & Memory  

> Built with **Next.js + Bun.js + LangChain + LLM APIs**  
> An intelligent, conversational AI chatbot that can **search the web**, **fetch live news**, **query Wikipedia**, **check weather**, and **respond contextually** using built-in conversation memory.

---

## ✨ Features

- 🌐 **Web Search (Tavily API)** — Real-time answers from the internet  
- 🧠 **Conversational Memory** — Context-aware replies like ChatGPT  
- 📰 **Live News Fetcher** — Stay updated with the latest headlines  
- 🌦️ **Weather Lookup** — Get accurate, location-based weather info  
- 📚 **Wikipedia Summaries** — Instant information without leaving chat  
- ⚡ **Bun.js Backend** — Lightning-fast and scalable API execution  
- 🧩 **LangChain Tools Integration** — Smart multi-agent orchestration  
- 🪄 **Modern UI (Next.js + Tailwind)** — Clean, responsive, and fast  

---

## 🧭 Tech Stack

| Category | Tools Used |
|-----------|------------|
| **Frontend** | Next.js, React, Tailwind CSS |
| **Backend Runtime** | Bun.js |
| **AI/LLM** | OpenAI API (or compatible) |
| **Search Tools** | Tavily, Wikipedia, News, Weather API |
| **Memory Management** | LangChain MemorySaver |
| **Deployment** | Vercel / Bun.sh / Replit (optional) |

---

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/3efbbcde-9daf-447c-8590-40e609de986f"
    alt="AI Chatbot Screenshot"
    width="1000"
    height="1000"
    style="border-radius: 12px; box-shadow: 0 0 15px rgba(0,0,0,0.2); margin-top: 10px;"
  />
</p>

<p align="center">
  <em>📱 Sleek Next.js Chat UI — clean, modern, and responsive.</em>
</p>

---

## ⚙️ Installation & Setup

```bash
# Clone this repo
git clone https://github.com/yourusername/agent-ai-chatbot.git

# Move into project folder
cd agent-ai-chatbot

# Install dependencies
bun install

# Create .env file
cp .env.example .env
# Add your API keys:
# TAVILY_API_KEY=
# OPENAI_API_KEY=
# WEATHER_API_KEY=

# Run locally
bun run dev



