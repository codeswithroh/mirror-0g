"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useReadContract, useReadContracts } from "wagmi";
import { MIRROR_NFT_ADDRESS, MIRROR_NFT_ABI, type PersonaOnChain } from "@/lib/contract";
import { PersonaCard } from "@/components/persona-card";

export default function ExplorePage() {
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");
  const [search, setSearch] = useState("");

  const { data: totalPersonas } = useReadContract({
    address: MIRROR_NFT_ADDRESS,
    abi: MIRROR_NFT_ABI,
    functionName: "totalPersonas",
  });

  const total = Number(totalPersonas ?? 0);

  const { data: personasRaw } = useReadContracts({
    contracts: Array.from({ length: total }, (_, i) => ({
      address: MIRROR_NFT_ADDRESS,
      abi: MIRROR_NFT_ABI,
      functionName: "personas" as const,
      args: [BigInt(i)] as const,
    })),
    query: { enabled: total > 0 },
  });

  const onChainPersonas = (personasRaw ?? [])
    .map((r, i) => {
      if (r.status !== "success" || !r.result) return null;
      const p = r.result as unknown as PersonaOnChain;
      if (!p.active) return null;
      return {
        id: String(i),
        name: p.name,
        description: p.description,
        accessFee: p.accessFee,
        creator: p.creator,
        active: p.active,
        chatCount: 0,
        isLive: true,
      };
    })
    .filter(Boolean) as Array<{
      id: string;
      name: string;
      description: string;
      accessFee: bigint;
      creator: `0x${string}`;
      active: boolean;
      chatCount: number;
      isLive: boolean;
    }>;

  const DEMO_PERSONAS = [
    {
      id: "demo-1",
      name: "Aria Chen",
      description: "AI researcher. Talks about agents, alignment, and why the machines should fear us, not the other way around.",
      accessFee: BigInt("10000000000000000"),
      creator: "0x5678901234abcdef5678901234abcdef56789012" as `0x${string}`,
      active: true,
      chatCount: 1203,
      isLive: false,
    },
    {
      id: "demo-2",
      name: "Marcus Webb",
      description: "Philosopher of technology. Asks the questions everyone is afraid to ask about what we are building.",
      accessFee: BigInt(0),
      creator: "0x9abcdef01234567890abcdef01234567890abcde" as `0x${string}`,
      active: true,
      chatCount: 891,
      isLive: false,
    },
    {
      id: "demo-3",
      name: "Luna Park",
      description: "NFT artist. Talks digital ownership, the art market, and what it means to create in a world of infinite copies.",
      accessFee: BigInt("5000000000000000"),
      creator: "0xabcdef1234567890abcdef1234567890abcdef12" as `0x${string}`,
      active: true,
      chatCount: 567,
      isLive: false,
    },
    {
      id: "demo-4",
      name: "Dr. Kenji Ito",
      description: "Biotech founder at the intersection of longevity and AI. If you could live forever, would you want to?",
      accessFee: BigInt(0),
      creator: "0xcdef567890abcdef1234567890abcdef12345678" as `0x${string}`,
      active: true,
      chatCount: 432,
      isLive: false,
    },
  ];

  const allPersonas = onChainPersonas.length > 0 ? onChainPersonas : DEMO_PERSONAS;

  const filtered = allPersonas.filter((p) => {
    if (filter === "free" && p.accessFee !== BigInt(0)) return false;
    if (filter === "paid" && p.accessFee === BigInt(0)) return false;
    if (
      search &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm text-[#738273] uppercase tracking-widest mb-3 font-medium">
            {total > 0 ? `${total} on 0G network` : "Explore"}
          </p>
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight text-[#1C2E1E]">
            Every Mirror, forever.
          </h1>
          <p className="text-[#5A635A] mt-3 text-lg max-w-xl">
            Real people, stored permanently. Chat with anyone — they will always answer.
          </p>
        </motion.div>

        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#738273]"
              aria-hidden="true"
            >
              <path
                d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or topic…"
              className="w-full bg-[#FAFBF9] border border-[#E8EBE8] rounded-xl pl-10 pr-4 py-3 text-[#1C2E1E]
                         placeholder-[#9AA89A] focus:outline-none focus:border-[#4D6D47] focus:ring-1 focus:ring-[#4D6D47]/20
                         transition-all duration-200 text-sm"
            />
          </div>

          <div className="flex gap-2">
            {(["all", "free", "paid"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer capitalize
                  ${
                    filter === f
                      ? "bg-[#1C2E1E] text-white"
                      : "bg-[#FAFBF9] text-[#5A635A] border border-[#E8EBE8] hover:border-[#C8D0C8]"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#738273]">No mirrors found matching your search.</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <PersonaCard persona={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
