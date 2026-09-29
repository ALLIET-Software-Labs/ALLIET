# ALLIET Software Labs

[![Website](https://img.shields.io/badge/Website-alliet.company-blue)](https://alliet.company)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black)](https://nextjs.org/)

This is the official repository for the **ALLIET Software Labs** website. 

ALLIET is an independent engineering and product studio based in Hyderabad, India. We build AI systems, web products, and automation tools for clients, and we develop our own software alongside client work under the philosophy: *"We build what we believe should exist."*

## 💡 Our Philosophy
> *"We build software. Carefully, and in the open."*

Our core engineering principles are:
- **Build the risky part first.** Tackle the hardest engineering challenges upfront.
- **Architectural clarity.** Keep the codebase clean, modular, and maintainable.
- **Honest about AI.** Grounded context, validated outputs, and sensible fallbacks. No empty hype.

## 🛠️ Services

We specialize in four key areas of software engineering:
1. **AI Systems:** LLM features and intelligent agents, robust memory and retrieval pipelines (knowledge graphs, RAG), working with hosted models (Groq) and local open-source models (Ollama).
2. **Digital Products:** End-to-end web applications (React, Next.js, Node.js), company websites, progressive web apps (PWAs), interface design, and interactive fiction.
3. **Automation & Integration:** Workflow automation, third-party API integration, scheduled cron jobs, and complex email/notification pipelines.
4. **Software Engineering:** Secure backend services and APIs (Node.js, Express), resilient data modeling, deployment, and ongoing infrastructure maintenance.

## 💼 Featured Work

- **Syntapse:** A multi-agent system for early-stage software planning. Five agents coordinate through a shared Cognee knowledge graph on Memgraph, using a Redis event bus.
- **M.M. Cartons:** Client work. A highly performant, responsive website for a carton manufacturing company that has maintained a #1 Google ranking for over 2 years.
- **DeskGlow:** An offline-first, ambient desk clock Progressive Web App (PWA) with zero backend reliance.
- **MEMORABLE:** A cyberpunk interactive fiction game built in Python/pygame, featuring AI dialogue generated via Groq, with handwritten fallbacks when offline.
- **PayLoop:** A backend API architecture for tracking subscriptions and automating email reminders prior to renewal.

## 🚀 Running Locally

To run the ALLIET website locally on your machine:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the necessary API keys for the AI chatbot and contact form:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   RESEND_API_KEY=your_resend_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📬 Contact

- **Email:** [contact@alliet.company](mailto:contact@alliet.company)
- **Website:** [alliet.company](https://alliet.company)
