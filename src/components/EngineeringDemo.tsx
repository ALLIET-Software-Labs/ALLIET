"use client";

import { useState, useEffect } from "react";
import FadeIn from "./FadeIn";

type NodeType = "entry" | "process" | "data" | "api" | "core" | "output";

interface NodeDef {
  id: string;
  label: string;
  type: NodeType;
  desc: string;
  dx: number;
  dy: number;
  info: string;
}

const NODES: Record<string, NodeDef> = {
  input: { id: "input", label: "USER INPUT", type: "entry", desc: "Natural language query", dx: 50, dy: 10, info: "Where a request enters the system. It is validated, rate-limited and tagged with who is asking before anything else runs." },
  router: { id: "router", label: "INTENT ROUTER", type: "process", desc: "Intent classification", dx: 50, dy: 26, info: "A fast, cheap classification step decides what kind of request this is, so the expensive parts of the system only run when they are needed." },
  rag: { id: "rag", label: "RETRIEVAL (RAG)", type: "data", desc: "Vector search", dx: 20, dy: 42, info: "Searches your own documents and data for passages relevant to the request, so the model answers from sources rather than from memory alone." },
  memory: { id: "memory", label: "MEMORY", type: "data", desc: "Persistent state", dx: 50, dy: 42, info: "Loads what the system already knows: earlier decisions, user preferences and session history. In multi-agent systems this is shared state, not a chat log." },
  tools: { id: "tools", label: "TOOLS / API", type: "api", desc: "External functions", dx: 80, dy: 42, info: "Live data from the systems the business already runs on: internal APIs, databases and third-party services." },
  orchestrator: { id: "orchestrator", label: "REASONING ORCHESTRATOR", type: "core", desc: "Planning & logic", dx: 50, dy: 58, info: "The model sees the assembled context and produces a structured plan rather than free text, so each step can be checked and carried out by ordinary code." },
  action: { id: "action", label: "ACTION ENGINE", type: "process", desc: "Tool execution", dx: 30, dy: 74, info: "Plain, testable code carries out the plan: API calls, database writes, messages. The model decides; it does not get direct access to production systems." },
  validation: { id: "validation", label: "VALIDATION", type: "process", desc: "Output verification", dx: 70, dy: 74, info: "Checks the output against the expected format, business rules and policy before it is returned. Anything that fails is retried or handed to a fallback." },
  result: { id: "result", label: "SYSTEM RESULT", type: "output", desc: "Final response", dx: 50, dy: 90, info: "The validated response or change, returned to the interface with enough of a trace to explain how it was produced." },
};

const PATHS = [
  { id: "p1", from: "input", to: "router" },
  { id: "p2", from: "router", to: "rag" },
  { id: "p3", from: "router", to: "memory" },
  { id: "p4", from: "router", to: "tools" },
  { id: "p5", from: "rag", to: "orchestrator" },
  { id: "p6", from: "memory", to: "orchestrator" },
  { id: "p7", from: "tools", to: "orchestrator" },
  { id: "p8", from: "orchestrator", to: "action" },
  { id: "p9", from: "orchestrator", to: "validation" },
  { id: "p10", from: "action", to: "result" },
  { id: "p11", from: "validation", to: "result" },
];

const SUGGESTIONS = [
  "Analyze this customer dispute",
  "Generate a technical architecture document",
  "Find relevant system context",
];

export default function EngineeringDemo() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("ONLINE");
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [activePaths, setActivePaths] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    // Reset selected node when clicking outside nodes handled by stopPropagation
    const handleGlobalClick = () => setSelectedNode(null);
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const simulate = () => {
    if (status !== "ONLINE" && status !== "COMPLETE") return;
    if (!input) setInput(SUGGESTIONS[0]);
    
    setSelectedNode(null);
    setResultData(null);
    
    // Step 1: Input
    setActiveNodes(["input"]);
    setActivePaths([]);
    setStatus("RECEIVING REQUEST");
    
    // Step 2: Routing
    setTimeout(() => {
      setActiveNodes(["input", "router"]);
      setActivePaths(["p1"]);
      setStatus("CLASSIFYING INTENT");
    }, 800);
    
    // Step 3: Context Gathering
    setTimeout(() => {
      setActiveNodes(["router", "rag", "memory", "tools"]);
      setActivePaths(["p2", "p3", "p4"]);
      setStatus("GATHERING CONTEXT");
    }, 1800);
    
    // Step 4: Reasoning (Core)
    setTimeout(() => {
      setActiveNodes(["rag", "memory", "tools", "orchestrator"]);
      setActivePaths(["p5", "p6", "p7"]);
      setStatus("REASONING & PLANNING");
    }, 3200);
    
    // Step 5: Execution & Validation
    setTimeout(() => {
      setActiveNodes(["orchestrator", "action", "validation"]);
      setActivePaths(["p8", "p9"]);
      setStatus("EXECUTING ACTIONS");
    }, 4800);
    
    // Step 6: Result compilation
    setTimeout(() => {
      setActiveNodes(["action", "validation", "result"]);
      setActivePaths(["p10", "p11"]);
      setStatus("COMPILING RESPONSE");
    }, 6200);
    
    // Step 7: Complete
    setTimeout(() => {
      setActiveNodes(["result"]);
      setActivePaths([]);
      setStatus("COMPLETE");
      setResultData({
        context: "4 relevant sources found",
        reasoning: "Decision path validated",
        action: "Recommendation generated successfully",
        latency: "1,240ms"
      });
    }, 7500);
  };

  const getPathData = (from: NodeDef, to: NodeDef) => {
    return `M ${from.dx} ${from.dy} C ${from.dx} ${(from.dy + to.dy) / 2}, ${to.dx} ${(from.dy + to.dy) / 2}, ${to.dx} ${to.dy}`;
  };

  return (
    <div className="w-full font-mono text-sm">
      {/* MAIN TOPOLOGY CONTAINER */}
      <div 
        className="relative w-full bg-surface-alt border border-border rounded-lg overflow-hidden shadow-inner mb-6 min-h-[700px] md:min-h-[800px]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* SVG CONNECTIONS (DESKTOP ONLY) */}
        <div className="hidden lg:block absolute inset-0 w-full h-full">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" className="text-accent" />
                <stop offset="100%" stopColor="currentColor" className="text-accent/50" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {PATHS.map(path => {
              const fromNode = NODES[path.from];
              const toNode = NODES[path.to];
              const isActive = activePaths.includes(path.id);
              
              return (
                <g key={path.id}>
                  <path 
                    d={getPathData(fromNode, toNode)} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="0.2" 
                    className={`transition-colors duration-500 ${isActive ? "text-accent/30" : "text-border"}`} 
                  />
                  {isActive && (
                    <>
                      <path 
                        id={`path-${path.id}`}
                        d={getPathData(fromNode, toNode)} 
                        fill="none" 
                        stroke="transparent" 
                      />
                      <circle r="0.8" fill="currentColor" className="text-accent" filter="url(#glow)">
                        <animateMotion dur="1s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                          <mpath href={`#path-${path.id}`} />
                        </animateMotion>
                      </circle>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* STATUS PANEL */}
        <div className="hidden md:block absolute top-6 right-6 border border-border bg-background/90 backdrop-blur-md p-4 rounded text-xs w-56 shadow-lg z-20 pointer-events-none">
          <h4 className="font-bold text-primary mb-3 uppercase tracking-widest border-b border-border pb-2">Simulation Status</h4>
          <div className="flex justify-between mb-2">
            <span className="text-text-secondary">STATE</span>
            <span className={`font-bold transition-colors ${status === "PROCESSING" || status !== "ONLINE" && status !== "COMPLETE" ? "text-accent animate-pulse" : "text-primary"}`}>
              {status}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-text-secondary">LATENCY</span>
            <span>{status === "ONLINE" || status === "COMPLETE" ? "~45ms" : "---"}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-text-secondary">ACTIVE NODES</span>
            <span>{activeNodes.length} / {Object.keys(NODES).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">CONTEXT</span>
            <span className="text-primary">LOADED</span>
          </div>
        </div>

        {/* NODES (DESKTOP) */}
        <div className="hidden lg:block absolute inset-0 w-full h-full">
          {Object.values(NODES).map((node) => {
            const isActive = activeNodes.includes(node.id);
            const isSelected = selectedNode === node.id;
            
            // Generate visual style based on node type
            let nodeStyle = "";
            let innerContent = null;
            
            if (node.type === "entry") {
              nodeStyle = `rounded-full w-32 h-32 flex items-center justify-center border-2 border-dashed ${isActive ? "border-accent text-accent shadow-[0_0_20px_rgba(43,89,195,0.2)] bg-accent/5" : "border-border text-primary bg-background"}`;
            } else if (node.type === "process") {
              nodeStyle = `rounded border-l-4 w-40 p-4 bg-background ${isActive ? "border-accent border-y border-r shadow-lg text-accent" : "border-border text-primary"}`;
            } else if (node.type === "data") {
              nodeStyle = `rounded bg-surface p-4 border w-36 ${isActive ? "border-accent text-accent shadow-md" : "border-border text-primary"}`;
            } else if (node.type === "api") {
              nodeStyle = `rounded-full px-6 py-3 border w-36 text-center ${isActive ? "border-accent text-accent bg-accent/10" : "border-border text-primary bg-background"}`;
            } else if (node.type === "core") {
              nodeStyle = `rounded-lg w-56 p-6 border bg-background relative ${isActive ? "border-accent text-accent shadow-[0_0_30px_rgba(43,89,195,0.3)]" : "border-border text-primary"}`;
              innerContent = (
                <div className="absolute inset-2 border border-border/50 rounded pointer-events-none opacity-50 flex items-center justify-center">
                  {isActive && <div className="w-full h-full bg-accent/10 animate-pulse"></div>}
                </div>
              );
            } else if (node.type === "output") {
              nodeStyle = `rounded border-2 w-48 p-4 text-center font-bold tracking-widest ${isActive ? "border-accent text-accent shadow-[0_0_20px_rgba(43,89,195,0.4)] bg-background" : "border-border text-primary bg-surface-alt"}`;
            }

            return (
              <div 
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 cursor-pointer"
                style={{ left: `${node.dx}%`, top: `${node.dy}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node.id === selectedNode ? null : node.id);
                }}
                data-cursor="cta"
              >
                <div className={`transition-all duration-500 hover:scale-105 relative flex flex-col items-center justify-center ${nodeStyle}`}>
                  {innerContent}
                  <span className={`relative z-10 font-bold ${node.type === "core" ? "text-lg mb-1" : "text-sm"} tracking-wide text-center leading-tight`}>{node.label}</span>
                  {node.type !== "entry" && node.type !== "output" && node.type !== "api" && (
                     <span className={`relative z-10 text-[10px] mt-1 text-center ${isActive ? "text-accent/80" : "text-text-secondary"}`}>{node.desc}</span>
                  )}
                </div>
                
                {/* Highlight ring when selected */}
                {isSelected && (
                  <div className="absolute inset-[-12px] border border-primary/30 rounded-lg pointer-events-none animate-in zoom-in-95 duration-200"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* MOBILE STACK (VERTICAL) */}
        <div className="lg:hidden relative w-full p-6 pb-24 flex flex-col items-center">
           {/* Render nodes in vertical order */}
           {[
             NODES.input, 
             NODES.router, 
             { type: "wrapper", items: [NODES.rag, NODES.memory, NODES.tools] },
             NODES.orchestrator,
             { type: "wrapper", items: [NODES.action, NODES.validation] },
             NODES.result
           ].map((item, idx) => {
             if (item.type === "wrapper") {
               return (
                 <div key={idx} className="flex flex-col items-center w-full relative">
                   <div className="flex flex-wrap gap-2 w-full justify-center max-w-sm px-2">
                     {item.items.map((node: any) => {
                     const isActive = activeNodes.includes(node.id);
                     const isSelected = selectedNode === node.id;
                     return (
                       <div 
                         key={node.id} 
                         onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id === selectedNode ? null : node.id); }}
                         className={`flex-grow basis-[28%] min-w-[85px] p-2 sm:p-3 text-center border rounded-lg cursor-pointer flex flex-col items-center justify-center transition-all ${isActive ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(43,89,195,0.2)]" : "border-border bg-surface"} ${isSelected ? "ring-2 ring-primary/30" : ""}`}
                       >
                         <div className={`font-bold text-[9px] sm:text-[10px] leading-tight ${isActive ? "text-accent" : "text-primary"}`}>{node.label}</div>
                       </div>
                     );
                   })}
                 </div>
                 {idx < 5 && (
                   <div className={`h-8 w-[2px] my-2 transition-colors ${activeNodes.length > 0 ? "bg-accent" : "bg-primary/20"}`}></div>
                 )}
               </div>
             );
           }

             const node = item as NodeDef;
             const isActive = activeNodes.includes(node.id);
             const isSelected = selectedNode === node.id;
             let nodeStyle = `w-full max-w-xs p-4 border rounded-lg text-center cursor-pointer transition-all ${isActive ? "border-accent text-accent shadow-[0_0_20px_rgba(43,89,195,0.3)] bg-background" : "border-border text-primary bg-surface"} ${isSelected ? "ring-2 ring-primary/30" : ""}`;
             
             if (node.type === "entry") {
               nodeStyle = `w-32 h-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${isActive ? "border-accent text-accent shadow-[0_0_20px_rgba(43,89,195,0.2)] bg-accent/5" : "border-border text-primary bg-background"} ${isSelected ? "ring-2 ring-primary/30" : ""}`;
             } else if (node.type === "core") {
               nodeStyle = `w-full max-w-xs p-6 border rounded-lg text-center cursor-pointer transition-all ${isActive ? "border-accent text-accent shadow-[0_0_30px_rgba(43,89,195,0.4)] bg-background" : "border-border text-primary bg-surface"} ${isSelected ? "ring-2 ring-primary/30" : ""}`;
             } else if (node.type === "output") {
               nodeStyle = `w-full max-w-xs p-4 border-2 rounded-lg text-center cursor-pointer font-bold tracking-widest transition-all ${isActive ? "border-accent text-accent shadow-[0_0_20px_rgba(43,89,195,0.4)] bg-background" : "border-border text-primary bg-surface-alt"} ${isSelected ? "ring-2 ring-primary/30" : ""}`;
             }

             return (
               <div key={node.id} className="flex flex-col items-center w-full relative">
                 <div onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id === selectedNode ? null : node.id); }} className={nodeStyle}>
                   <div className={`font-bold ${node.type === "core" ? "text-base mb-1" : "text-sm"} leading-tight`}>{node.label}</div>
                   {node.type !== "entry" && node.type !== "output" && (
                      <div className={`text-[10px] mt-1 ${isActive ? "text-accent/80" : "text-text-secondary"}`}>{node.desc}</div>
                   )}
                 </div>
                 {idx < 5 && (
                   <div className={`h-8 w-[2px] my-2 transition-colors ${activeNodes.length > 0 ? "bg-accent" : "bg-primary/20"}`}></div>
                 )}
               </div>
             );
           })}
        </div>

        {/* SELECTED NODE INFO PANEL */}
        {selectedNode && (
          <div 
            className="absolute bottom-4 left-4 md:bottom-6 md:left-6 border border-border bg-background/95 backdrop-blur-md p-6 rounded-lg text-sm w-72 md:w-96 shadow-2xl z-30 animate-in slide-in-from-bottom-4 md:slide-in-from-left-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
               <h4 className="font-bold text-primary tracking-widest uppercase">{NODES[selectedNode].label}</h4>
               <button onClick={() => setSelectedNode(null)} className="text-text-secondary hover:text-primary">✕</button>
            </div>
            <div className="inline-block border border-border text-text-secondary text-[10px] px-2 py-1 rounded mb-4 uppercase">
              NODE TYPE: {NODES[selectedNode].type}
            </div>
            <p className="text-text-secondary leading-relaxed">
              {NODES[selectedNode].info}
            </p>
            {activeNodes.includes(selectedNode) && (
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-accent text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-accent"></span> PROCESSING
              </div>
            )}
          </div>
        )}
        
        {/* RESULT DATA PANEL */}
        {resultData && status === "COMPLETE" && (
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-border p-8 rounded-lg shadow-2xl z-40 animate-in zoom-in-95 duration-500 w-[90%] md:w-[500px]">
              <h3 className="text-xl font-bold mb-6 text-primary tracking-tight">Simulation complete</h3>
              <div className="space-y-4">
                 <div className="flex justify-between border-b border-border/50 pb-2">
                   <span className="text-text-secondary">Context</span>
                   <span className="text-primary font-medium">{resultData.context}</span>
                 </div>
                 <div className="flex justify-between border-b border-border/50 pb-2">
                   <span className="text-text-secondary">Reasoning</span>
                   <span className="text-primary font-medium">{resultData.reasoning}</span>
                 </div>
                 <div className="flex justify-between border-b border-border/50 pb-2">
                   <span className="text-text-secondary">Action</span>
                   <span className="text-primary font-medium">{resultData.action}</span>
                 </div>
                 <div className="flex justify-between pt-2">
                   <span className="text-text-secondary">Simulated latency</span>
                   <span className="text-accent font-bold">{resultData.latency}</span>
                 </div>
              </div>
              <button 
                onClick={() => {
                  setResultData(null);
                  setStatus("ONLINE");
                  setActiveNodes([]);
                }}
                className="mt-8 w-full py-3 bg-surface border border-border hover:border-primary transition-colors rounded text-primary font-medium"
              >
                Reset Demo
              </button>
           </div>
        )}
      </div>

      {/* INPUT CONTROLS */}
      <FadeIn delay={200} className="bg-background border border-border p-6 rounded-lg flex flex-col gap-4">
         <label className="block text-xs font-bold text-text-secondary tracking-widest uppercase">Try a request</label>
         
         <div className="flex flex-col md:flex-row gap-4 items-stretch">
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             disabled={status !== "ONLINE" && status !== "COMPLETE"}
             placeholder="Type a request (e.g. Analyze this customer dispute...)"
             className="flex-grow bg-surface-alt border border-border rounded px-4 py-4 text-primary focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
           />
           <button 
              onClick={simulate}
              disabled={status !== "ONLINE" && status !== "COMPLETE"}
              className="w-full md:w-auto px-8 py-4 bg-primary text-surface rounded font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide whitespace-nowrap"
              data-cursor="cta"
           >
              {status !== "ONLINE" && status !== "COMPLETE" ? "PROCESSING..." : "SIMULATE EXECUTION"}
           </button>
         </div>

         <div className="flex gap-2 flex-wrap mt-1">
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i} 
                onClick={() => setInput(s)}
                disabled={status !== "ONLINE" && status !== "COMPLETE"}
                className="text-[11px] px-3 py-1.5 border border-border rounded-full text-text-secondary hover:text-primary hover:bg-surface-alt transition-colors disabled:opacity-50"
              >
                {s}
              </button>
            ))}
         </div>
      </FadeIn>
    </div>
  );
}
