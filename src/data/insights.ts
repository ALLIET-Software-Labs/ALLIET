// Insights articles. Only publish pieces grounded in ALLIET's own work; each one should be
// reviewed by the team before it goes live.

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  /** Shorter <title> for search results (the full title stays as the H1). */
  seoTitle: string;
  description: string;
  category: string;
  /** ISO date (YYYY-MM-DD) the article was published. */
  published: string;
  relatedProject?: string;
  relatedService?: string;
  body: ArticleBlock[];
};

export const insights: Article[] = [
  {
    slug: "shared-memory-instead-of-prompt-chains",
    title: "Shared memory instead of prompt chains: how Syntapse coordinates AI agents",
    seoTitle: "Shared Memory Instead of Prompt Chains for AI Agents",
    description: "How Syntapse's five AI agents coordinate through a shared knowledge graph and an event bus instead of a prompt chain, and what happens when a decision changes.",
    category: "AI Systems",
    published: "2026-09-29",
    relatedProject: "syntapse",
    relatedService: "ai-systems",
    body: [
      { type: "p", text: "Syntapse is a multi-agent system for early-stage software planning. Five specialised agents take a rough idea and turn it into a product brief, an architecture, a stack recommendation and an implementation plan. This piece explains the one design decision the rest of the system depends on: the agents don't talk to each other. They talk to a shared memory." },

      { type: "h2", text: "What goes wrong with prompt chains" },
      { type: "p", text: "The common way to build a multi-agent pipeline is a chain. Agent one produces output, that output becomes agent two's prompt, and so on down the line. It is simple to build and easy to demo, and it works well as long as nothing changes." },
      { type: "p", text: "Planning software is mostly change. A requirement shifts, someone overrules the database choice, a constraint appears that nobody mentioned in the first message. In a chain, every agent downstream of the change is now working from stale context, and none of them can tell. The usual fix is to run the whole chain again from the top, which throws away work that was still valid and gives no guarantee the second run agrees with the first." },
      { type: "p", text: "The deeper problem is that a chain has no shared record of what has been decided. Each agent only sees what the previous one chose to pass along." },

      { type: "h2", text: "Memory as the coordination layer" },
      { type: "p", text: "Syntapse replaces the chain with a single persistent memory that every agent reads from and writes to. That memory is a Cognee knowledge graph stored in Memgraph. Decisions live in the graph as connected nodes: the idea, the requirements derived from it, the architecture that satisfies those requirements, the stack chosen for that architecture." },
      { type: "p", text: "Because the graph holds the relationships between decisions, not just the decisions themselves, an agent can ask for exactly the context it needs — the requirements that bear on the architecture, say — instead of receiving whatever the previous agent happened to write." },

      { type: "h2", text: "What each agent actually does" },
      { type: "p", text: "There are five agents, each with one job:" },
      { type: "ul", items: [
        "Ideation Specialist — shapes the initial idea.",
        "Product (PRD) Architect — turns it into product requirements.",
        "System Architect — designs a system that meets them.",
        "Tech Stack Evaluator — chooses and justifies the technologies.",
        "Implementation Strategist — plans how it gets built.",
      ] },
      { type: "p", text: "None of them is called by another agent. Each runs as an independent daemon with the same loop: listen on a Redis event bus for changes to the memory it cares about, pull the relevant context from the graph, call the language model, and commit the result back to the graph. The commit is itself a change, which is what wakes up the next agent that depends on it. No agent needs to know which one ran before it." },

      { type: "h2", text: "Changing your mind halfway through" },
      { type: "p", text: "This is where the design pays off. Suppose the plan has been generated and you edit one node by hand — you swap the chosen stack from React to Rust. In Syntapse that edit emits an event like any other write. The agents whose work depended on the old decision see that their foundation has changed, discard the plans built on it, and regenerate from the updated memory. The system doesn't need a restart, and the parts of the plan that didn't depend on the edit are left alone." },
      { type: "p", text: "In a chain you would re-run everything. Here the change propagates to exactly the agents it affects, because the graph already records what depends on what." },

      { type: "h2", text: "Questions a design like this has to answer" },
      { type: "p", text: "Event-driven agents on shared memory are not free. Anyone building something similar will run into the same questions:" },
      { type: "ul", items: [
        "Ownership: which agent is allowed to write which parts of the graph, so two agents don't keep overwriting each other.",
        "Termination: an agent's own write must not keep re-triggering it, and a cascade of regenerations has to settle.",
        "Cost: every regeneration is another model call, so the dependency structure decides how much a single edit costs.",
        "Visibility: the graph doubles as a record of what was decided and why, which is only useful if people can read it.",
      ] },
      { type: "p", text: "None of these are reasons to go back to prompt chains. They are the questions a chain hides by never letting you change your mind." },

      { type: "h2", text: "Where Syntapse stands" },
      { type: "p", text: "Syntapse is a working demonstration of the architecture, not a finished product. The agent backend runs locally with Docker and Ollama, behind a Next.js interface, and the code is public on GitHub." },

      { type: "h2", text: "When this pattern fits" },
      { type: "p", text: "Shared memory is worth the extra moving parts when a task has several steps that depend on each other and the inputs are expected to change — planning, research, anything with a human revising the output along the way. For a single well-defined transformation, a plain model call is still the better tool. Knowing which one you have is most of the design work." },
    ],
  },
];
