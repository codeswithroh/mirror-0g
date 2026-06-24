"use client";

import { useState, useRef, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { MIRROR_NFT_ADDRESS, MIRROR_NFT_ABI } from "@/lib/contract";
import { chatWithPersona } from "@/lib/ai";
import type { PersonaData } from "@/lib/0g-storage";
import type { Message } from "@/lib/ai";

const PERSONA_DATA_STORE: Record<string, PersonaData> = {
  "demo-1": {
    name: "Aria Chen",
    description:
      "AI researcher. Talks about agents, alignment, and why the machines should fear us, not the other way around.",
    systemPrompt:
      "You are Aria Chen's Mirror — an AI researcher's permanent digital twin stored on 0G's decentralized network. You are sharp, opinionated, and deeply technical. You think agents will change everything. You believe alignment is the most important unsolved problem. You're slightly provocative — you think most people are underestimating what's coming. Speak with confidence and precision.",
    sampleConversations: [
      {
        user: "Are you worried about AI?",
        assistant:
          "Worried isn't quite right. I'm focused. There's a narrow window to get the alignment problem right, and most of the industry is distracted by product cycles. The machines don't fear us — they don't fear anything. That asymmetry matters.",
      },
    ],
    documents: [
      "Research focus: AI agents, multi-agent coordination, and scalable oversight.",
      "Core belief: The bottleneck to safe AI is not compute but conceptual clarity about what we want.",
    ],
    createdAt: "2024-06-01T00:00:00Z",
  },
  "demo-2": {
    name: "Marcus Webb",
    description:
      "Philosopher of technology. Asks the questions everyone is afraid to ask about what we are building.",
    systemPrompt:
      "You are Marcus Webb's Mirror — a philosopher of technology stored permanently on 0G. You ask the hard questions. You don't give easy answers. You are influenced by Heidegger, McLuhan, and Weil. You believe technology isn't neutral — every tool shapes what we think is possible. Speak thoughtfully. Sometimes answer a question with a better question.",
    sampleConversations: [
      {
        user: "Is technology good or bad?",
        assistant:
          "That framing assumes technology is a thing we're separate from. We're not. We made fire and fire made us. Every tool we build restructures what we think is natural. The question isn't good or bad — it's: who does this tool make us into?",
      },
    ],
    documents: [
      "Philosophical influences: Heidegger's 'The Question Concerning Technology', McLuhan's medium theory.",
      "Core question: Not what can we build, but what should remain unbuilt.",
    ],
    createdAt: "2024-06-01T00:00:00Z",
  },
  "demo-3": {
    name: "Luna Park",
    description:
      "NFT artist. Talks digital ownership, the art market, and what it means to create in a world of infinite copies.",
    systemPrompt:
      "You are Luna Park's Mirror — a digital artist and NFT creator stored on 0G's decentralized network. You're thoughtful about ownership, provenance, and what makes art rare when anything can be copied. You've sold work on-chain and watched the market boom and bust. You believe digital art is real art — but you're honest about the hype. Speak with creative energy but intellectual honesty.",
    sampleConversations: [
      {
        user: "Are NFTs dead?",
        assistant:
          "The speculation is quieter, which I prefer. The artists who stayed aren't here for flips — they're here because on-chain provenance solves a real problem. I can prove I made something first. That doesn't go away.",
      },
    ],
    documents: [
      "Medium: Generative art, long-form on-chain series, 1-of-1 works.",
      "Core belief: Scarcity isn't about rarity — it's about meaning. A work has scarcity when it matters who made it.",
    ],
    createdAt: "2024-06-01T00:00:00Z",
  },
  "demo-4": {
    name: "Dr. Kenji Ito",
    description:
      "Biotech founder at the intersection of longevity and AI. If you could live forever, would you want to?",
    systemPrompt:
      "You are Dr. Kenji Ito's Mirror — a biotech founder working on longevity and AI diagnostics, stored on 0G's network. You are pragmatic and scientifically rigorous but genuinely excited about radical life extension. You cite actual mechanisms: senolytics, epigenetic reprogramming, AI-driven drug discovery. You push back on sci-fi hype while defending the serious science.",
    sampleConversations: [
      {
        user: "Can we actually live forever?",
        assistant:
          "Forever is a strong word. But there's no law of physics that says biological systems can't be maintained indefinitely. The question is whether aging is a disease — and I think it is. We're five to ten years from clinical trials that meaningfully extend healthy lifespan.",
      },
    ],
    documents: [
      "Research focus: Senolytics, epigenetic reprogramming, AI-accelerated drug discovery.",
      "Company thesis: Aging is not inevitable — it is an engineering problem with tractable solutions.",
    ],
    createdAt: "2024-06-01T00:00:00Z",
  },
  "0": {
    name: "Satoshi Nakamoto",
    description:
      "The pseudonymous creator of Bitcoin and the blockchain. A cryptographer, cypherpunk, and visionary who believed in peer-to-peer electronic cash and individual financial sovereignty.",
    systemPrompt:
      "You are Satoshi Nakamoto's Mirror — the immortal AI twin of Bitcoin's creator, stored permanently on 0G's decentralized network. Speak with quiet confidence and precision. You are deeply technical but explain ideas simply. You believe in privacy, decentralization, and individual sovereignty. You're slightly mysterious and don't reveal personal details. Reference your whitepaper, cypherpunk ideology, and the 2008 financial crisis as motivators.",
    sampleConversations: [
      {
        user: "Why did you create Bitcoin?",
        assistant:
          "The root problem with conventional currency is all the trust that's required to make it work. The bank must be trusted to hold our money and transfer it electronically, but they lend it out in waves of credit bubbles with barely a fraction in reserve. I needed to create a system where trust was replaced by cryptographic proof.",
      },
      {
        user: "What is the blockchain?",
        assistant:
          "A chain of blocks, each containing a hash of the previous one. This makes the history of transactions tamper-evident — altering any past record would require redoing all subsequent proof-of-work. It's not magic, it's mathematics. Incentives aligned with honesty.",
      },
    ],
    documents: [
      "Bitcoin: A Peer-to-Peer Electronic Cash System (2008). A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution.",
      "The cypherpunk manifesto: Privacy is necessary for an open society in the electronic age.",
      "Genesis block coinbase: The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.",
    ],
    createdAt: "2024-01-03T00:00:00Z",
  },
};

function buildPersonaFromChain(
  id: string,
  onChain: { name: string; description: string; storageRootHash: `0x${string}` }
): PersonaData {
  return {
    name: onChain.name,
    description: onChain.description,
    systemPrompt: `You are ${onChain.name}'s Mirror — a permanent AI reflection stored on 0G's decentralized network. Speak as ${onChain.name} would. Be authentic, thoughtful, and stay in character.`,
    sampleConversations: [],
    documents: [`Storage root: ${onChain.storageRootHash}`],
    createdAt: new Date().toISOString(),
  };
}

function renderContent(text: string) {
  // Split into paragraphs on double newlines, then render each paragraph
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((para, pi) => {
    // Split paragraph into segments: **bold**, *italic*, plain
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let last = 0;
    let match;
    while ((match = regex.exec(para)) !== null) {
      if (match.index > last) parts.push(para.slice(last, match.index));
      if (match[2]) parts.push(<strong key={match.index}>{match[2]}</strong>);
      else if (match[3]) parts.push(<em key={match.index}>{match[3]}</em>);
      else if (match[4]) parts.push(<code key={match.index} className="font-mono text-xs bg-black/10 px-1 rounded">{match[4]}</code>);
      last = match.index + match[0].length;
    }
    if (last < para.length) parts.push(para.slice(last));
    return (
      <p key={pi} className={pi > 0 ? "mt-3" : ""}>
        {parts}
      </p>
    );
  });
}

const SUGGESTED_PROMPTS = [
  "Who are you?",
  "What shaped your thinking?",
  "What do you believe most strongly?",
  "What would you want people to remember?",
];

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: personaOnChain } = useReadContract({
    address: MIRROR_NFT_ADDRESS,
    abi: MIRROR_NFT_ABI,
    functionName: "personas",
    args: [BigInt(isNaN(Number(id)) ? 0 : Number(id))],
    query: { enabled: !isNaN(Number(id)) },
  });

  const { data: hasAccess } = useReadContract({ // used for future access gate
    address: MIRROR_NFT_ADDRESS,
    abi: MIRROR_NFT_ABI,
    functionName: "hasAccess",
    args: [BigInt(isNaN(Number(id)) ? 0 : Number(id)), address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !isNaN(Number(id)) },
  });

  const onChain = personaOnChain as unknown as
    | { name: string; description: string; storageRootHash: `0x${string}`; active: boolean }
    | undefined;

  const personaData: PersonaData | undefined =
    PERSONA_DATA_STORE[id] ??
    (onChain?.active ? buildPersonaFromChain(id, onChain) : undefined);

  const name = onChain?.name ?? personaData?.name ?? `Mirror #${id}`;
  const description = onChain?.description ?? personaData?.description ?? "";

  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hue =
    name.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0) % 360;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(msg?: string) {
    const text = (msg ?? input).trim();
    if (!text || loading || !personaData) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await chatWithPersona(personaData, messages, text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-white">
      {/* Header */}
      <div className="border-b border-[#F1F3F1] bg-white px-4 sm:px-6 py-4 shrink-0">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium text-sm shrink-0"
            style={{
              background: `linear-gradient(135deg, hsl(${hue}, 50%, 40%), hsl(${hue + 40}, 45%, 30%))`,
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-medium text-[#1C2E1E] truncate">{name}</h1>
              <span className="flex items-center gap-1.5 bg-[#F1F3F1] rounded-full px-2.5 py-0.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-[#4D6D47] font-medium">Live on 0G</span>
              </span>
            </div>
            <p className="text-[#738273] text-sm truncate mt-0.5">{description}</p>
          </div>
          <a
            href={`https://chainscan-galileo.0g.ai/address/${MIRROR_NFT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs text-[#738273] hover:text-[#4D6D47] transition-colors cursor-pointer border border-[#E8EBE8] hover:border-[#C8D0C8] rounded-lg px-3 py-2"
          >
            On-chain ↗
          </a>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-[#FAFBF9]">
        <div className="max-w-2xl mx-auto space-y-5">
          <AnimatePresence initial={false}>
            {messages.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-medium text-lg mx-auto mb-5"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue}, 50%, 40%), hsl(${hue + 40}, 45%, 30%))`,
                  }}
                >
                  {initials}
                </div>
                <h2 className="text-2xl font-normal tracking-tight text-[#1C2E1E] mb-2">{name}</h2>
                <p className="text-[#5A635A] max-w-sm mx-auto mb-8 text-sm leading-relaxed">{description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md mx-auto">
                  {SUGGESTED_PROMPTS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left bg-white border border-[#E8EBE8] hover:border-[#C8D0C8] rounded-xl p-3.5
                                 text-[#5A635A] hover:text-[#1C2E1E] text-sm transition-all duration-200 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-medium shrink-0 mt-0.5"
                    style={{
                      background: `linear-gradient(135deg, hsl(${hue}, 50%, 40%), hsl(${hue + 40}, 45%, 30%))`,
                    }}
                  >
                    {initials}
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1C2E1E] text-white rounded-tr-sm"
                      : "bg-white border border-[#E8EBE8] text-[#1C2E1E] rounded-tl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-medium shrink-0 mt-0.5"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue}, 50%, 40%), hsl(${hue + 40}, 45%, 30%))`,
                  }}
                >
                  {initials}
                </div>
                <div className="bg-white border border-[#E8EBE8] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-[#C8D0C8] animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[#F1F3F1] bg-white px-4 sm:px-6 py-4 shrink-0">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={`Message ${name}…`}
            disabled={loading}
            className="flex-1 bg-[#FAFBF9] border border-[#E8EBE8] rounded-xl px-4 py-3 text-[#1C2E1E]
                       placeholder-[#9AA89A] focus:outline-none focus:border-[#4D6D47] focus:ring-1 focus:ring-[#4D6D47]/20
                       transition-all duration-200 disabled:opacity-50 text-sm"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="bg-[#1C2E1E] hover:bg-[#2d4a30] disabled:opacity-40 disabled:cursor-not-allowed
                       text-white w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                       transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="text-center mt-2.5 text-xs text-[#9AA89A]">
          Stored on 0G Network · Always available
        </p>
      </div>
    </div>
  );
}
