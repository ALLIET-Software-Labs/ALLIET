// Service page content. Every claim here should be traceable to a case study (src/data/projects.ts),
// this website's own implementation, or copy already published elsewhere on the site.

export type ServiceContent = {
  title: string;
  /** <title> text (the site suffix is added automatically) and meta description. */
  seoTitle: string;
  seoDescription: string;
  /** Schema.org Service.serviceType */
  serviceType: string;
  intro: string;
  approach: string;
  builds: string[];
  /** Topic sections, each backed by real work. */
  topics: { heading: string; body: string }[];
  tech: string[];
  /** Project ids from src/data/projects.ts */
  relatedWork: string[];
  /** Insight article slug, if one exists for this service. */
  relatedInsight?: string;
  faqs: { q: string; a: string }[];
};

const aiSystems: ServiceContent = {
  title: "AI Systems",
  seoTitle: "AI Development, AI Agents, RAG & Chatbots",
  seoDescription: "LLM features, AI agents, retrieval over your own data and website AI assistants, built to be grounded, validated and ready for when the model gets it wrong.",
  serviceType: "AI development",
  intro: "We build language-model features and agent systems that behave like software: grounded in your data, observable, and designed for the moments when the model gets it wrong.",
  approach: "Getting a model to produce an impressive answer is easy. Getting it to produce a reliable one inside a real product is the work. We treat the model as one component — surrounded by retrieval, memory, validation and a fallback path — and build the risky parts first so you know early whether the idea holds up.",
  builds: [
    "LLM-driven features, such as the generated dialogue in MEMORABLE",
    "Multi-agent systems that coordinate through shared memory, as in Syntapse",
    "Knowledge-graph memory and retrieval with Cognee and Memgraph",
    "Hosted models through Groq, or open models run locally through Ollama",
  ],
  topics: [
    {
      heading: "AI agents and multi-agent systems",
      body: "Agents earn their place when a task has several distinct steps that each need their own context. In Syntapse, five specialised agents — ideation, product requirements, system architecture, stack evaluation and implementation planning — coordinate through one shared knowledge graph instead of a prompt chain, so changing one decision reaches every agent that depends on it. We design agent systems around explicit shared state like this, so their behaviour can be inspected and corrected rather than guessed at.",
    },
    {
      heading: "Retrieval and knowledge graphs (RAG)",
      body: "A language model only knows what it is given. Retrieval connects it to sources you control, so answers are grounded in your data instead of the model's memory. Syntapse uses a Cognee knowledge graph on Memgraph as its memory layer; each agent pulls the context it needs from the graph before it calls the model, and writes its results back.",
    },
    {
      heading: "AI chatbots and website assistants",
      body: "The assistant on this website is one of ours. It runs on Groq, answers only from verified information about ALLIET, keeps its API key on the server, validates every request, and ignores attempts to rewrite its instructions. We build assistants the same way for products and company websites: scoped to what they should know, and honest when they don't know something.",
    },
    {
      heading: "Hosted and local models",
      body: "We choose where a model runs based on latency, cost and where your data is allowed to go: fast hosted inference through Groq, as in MEMORABLE's generated dialogue and this site's assistant, or open models run locally through Ollama when data should stay on your own machines, as in Syntapse.",
    },
  ],
  tech: ["Python", "Groq", "Ollama", "Cognee", "Memgraph", "Redis", "Next.js"],
  relatedWork: ["syntapse", "memorable"],
  relatedInsight: "shared-memory-instead-of-prompt-chains",
  faqs: [
    {
      q: "Can you add an AI assistant to an existing website or product?",
      a: "Yes. The assistant on this site is a small server-side API route that calls the model, with its knowledge, rate limits and input validation kept on the server, so it can usually sit alongside an existing site rather than requiring a rebuild.",
    },
    {
      q: "Do you work with only one model provider?",
      a: "No. Our work so far uses Groq-hosted models and open models run locally through Ollama. The right choice depends on latency, cost and where your data is allowed to go.",
    },
    {
      q: "What happens when the model gets something wrong?",
      a: "We design for it: grounded context, validated output, and a fallback path. MEMORABLE, for example, switches to hand-written dialogue whenever the model is unavailable, so the game keeps working.",
    },
  ],
};

const digitalProducts: ServiceContent = {
  title: "Digital Products",
  seoTitle: "Web Development & Digital Products",
  seoDescription: "Company websites, web applications and offline-first PWAs, designed and engineered together with React and Next.js, then deployed and maintained after launch.",
  serviceType: "Web development",
  intro: "We design and build company websites, web apps, installable PWAs and interactive products — and we stay involved after launch.",
  approach: "Design and engineering happen together here, not in sequence. That way the interface is shaped by what the system can actually do, and the edge cases — empty states, slow networks, offline use — are decided before launch instead of after it.",
  builds: [
    "Full-stack web applications with React, Next.js and Node.js",
    "Company websites, built, deployed and maintained, as for M.M. Cartons",
    "Offline-first PWAs that keep data on the device, like DeskGlow",
    "Interactive and narrative experiences, like MEMORABLE",
  ],
  topics: [
    {
      heading: "Company websites",
      body: "A company website is often the first thing a prospective customer checks. For M.M. Cartons, a carton and custom packaging manufacturer, we built the frontend, deployed the site and continue to manage it — responsive layouts that hold up from small phones to wide screens, with close attention to how quickly pages load.",
    },
    {
      heading: "Web applications",
      body: "Full-stack web applications with React and Next.js on the front and Node.js behind them, taken from a first working prototype to production. This website is built the same way: Next.js, React, TypeScript and Tailwind CSS, with pages prerendered so they load fast and can be read by search engines without running any JavaScript.",
    },
    {
      heading: "Progressive web apps",
      body: "Installable apps that run in the browser and keep working offline. DeskGlow is one: an ambient desk clock with no backend at all, which keeps settings in LocalStorage and images and audio in IndexedDB, and installs on Android, iOS and desktop.",
    },
    {
      heading: "Interface design",
      body: "Interfaces designed in the same pass as the engineering, so states, motion and edge cases are decided up front rather than improvised at the end — including smaller interactive work such as MEMORABLE, a narrative game built in Python.",
    },
  ],
  tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite", "Zustand"],
  relatedWork: ["mm-cartons", "deskglow", "memorable"],
  faqs: [
    {
      q: "Do you look after websites after launch?",
      a: "Yes. Deployment and ongoing maintenance are part of the work, as with the M.M. Cartons website.",
    },
    {
      q: "Do you build native mobile apps?",
      a: "Our mobile work so far is web-based: responsive sites and installable PWAs such as DeskGlow. If you need a native app, email us and we'll tell you honestly whether we're the right fit.",
    },
  ],
};

const automation: ServiceContent = {
  title: "Automation & Integration",
  seoTitle: "Workflow & Business Automation, API Integration",
  seoDescription: "Workflow automation, scheduled jobs, reminders and third-party API integrations: durable workflows that survive restarts and stop when they should.",
  serviceType: "Workflow automation",
  intro: "We automate the repetitive work that sits between your tools, and connect systems that should already be talking to each other.",
  approach: "Most automation fails quietly: a script runs until the day it doesn't, and nobody notices. We build workflows that are durable and easy to change — scheduled steps that survive restarts, clear stopping conditions, and messages that go out when they should.",
  builds: [
    "Scheduled and event-driven workflows, such as PayLoop's renewal reminders",
    "Integrations with third-party APIs for email, scheduling and data",
    "Transactional email and notification pipelines",
  ],
  topics: [
    {
      heading: "Workflow automation",
      body: "PayLoop is a working example. Adding a subscription starts a durable workflow on Upstash that emails reminders seven, five, two and one day before renewal, and stops on its own once the subscription is no longer active. The schedule lives in the workflow, not in someone's calendar.",
    },
    {
      heading: "Integrations between systems",
      body: "Most useful automation is really integration: connecting an application to the services around it. This website is a small example — its contact form sends mail through Resend, calls are booked through Cal.com, and questions are answered through Groq — each behind server-side code with its own validation and limits.",
    },
    {
      heading: "Adding AI to automated workflows",
      body: "Where a step needs judgement, such as classifying a request or drafting a reply, a language model can sit inside the workflow. We treat that step like any other unreliable dependency: its output is checked against expected formats and rules before anything acts on it, and there is a defined path for when it fails.",
    },
  ],
  tech: ["Node.js", "Upstash Workflow", "Nodemailer", "Resend", "Day.js", "REST APIs"],
  relatedWork: ["payloop"],
  faqs: [
    {
      q: "What do you use to build automations?",
      a: "Code rather than drag-and-drop tools: Node.js services, Upstash Workflow for durable scheduling, Nodemailer or Resend for email, and REST APIs to connect other systems.",
    },
  ],
};

const softwareEngineering: ServiceContent = {
  title: "Software Engineering",
  seoTitle: "Custom Software & Backend Development",
  seoDescription: "Custom backend development: REST APIs, data models, authentication and security, deployed and maintained on Vercel, Render and Docker.",
  serviceType: "Custom software development",
  intro: "We build the foundations products depend on — APIs, data models, authentication and security — and we deploy and maintain what we build.",
  approach: "Good backend work is mostly invisible. We aim for systems with few moving parts, plain data models and security handled from the first commit — rate limiting, bot protection, proper authentication — so the software can be maintained by whoever inherits it, not just by us.",
  builds: [
    "REST APIs and backend services with Node.js and Express",
    "Deployment and ongoing maintenance on Vercel, Render and Docker",
    "Authentication and request protection with JWT, bcrypt and Arcjet",
    "Data modelling on MongoDB, Redis and graph databases",
  ],
  topics: [
    {
      heading: "Backend services and APIs",
      body: "PayLoop's API is Node.js and Express on MongoDB via Mongoose, documented for integration and deployed on Render. We keep services small and their data models plain, so the next engineer can read them without us in the room.",
    },
    {
      heading: "Security from the first commit",
      body: "Authentication with JWTs and bcrypt-hashed passwords, and every request passing through Arcjet for rate limiting and bot detection, as in PayLoop. This website's own API routes follow the same habits: strict input validation, request size limits, rate limiting, and no provider errors or secrets returned to the browser.",
    },
    {
      heading: "Deployment and maintenance",
      body: "We ship what we build: this site and DeskGlow on Vercel, PayLoop on Render, and Syntapse's agent backend with Docker. After launch we handle fixes, updates and performance work, so the software keeps up as the business changes.",
    },
  ],
  tech: ["Node.js", "Express", "MongoDB", "Redis", "Arcjet", "Docker", "Vercel"],
  relatedWork: ["payloop", "syntapse"],
  faqs: [
    {
      q: "Which databases do you work with?",
      a: "In our work so far: MongoDB, Redis, and graph databases such as Memgraph. The data model comes first; the database is chosen for how the data is actually read and written.",
    },
  ],
};

export const serviceContent: Record<string, ServiceContent> = {
  "ai-systems": aiSystems,
  "digital-products": digitalProducts,
  "automation": automation,
  "software-engineering": softwareEngineering,
};

export const serviceSlugs = Object.keys(serviceContent);
