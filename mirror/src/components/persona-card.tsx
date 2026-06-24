"use client";

import Link from "next/link";
import { formatEther } from "viem";

type PersonaCardProps = {
  persona: {
    id: string;
    name: string;
    description: string;
    accessFee: bigint;
    creator: `0x${string}`;
    active: boolean;
    chatCount?: number;
    isLive?: boolean;
  };
};

export function PersonaCard({ persona }: PersonaCardProps) {
  const isFree = persona.accessFee === BigInt(0);
  const initials = persona.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Deterministic hue from name
  const hue = persona.name
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div className="bg-white border border-[#E8EBE8] rounded-2xl overflow-hidden hover:border-[#C8D0C8] hover:shadow-sm transition-all duration-200 group flex flex-col">
      {/* Avatar banner */}
      <div
        className="h-16 relative"
        style={{
          background: `linear-gradient(135deg, hsl(${hue}, 35%, 88%), hsl(${hue + 60}, 30%, 80%))`,
        }}
      >
        <div
          className="absolute -bottom-6 left-5 w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium text-sm border-2 border-white shadow-sm"
          style={{
            background: `linear-gradient(135deg, hsl(${hue}, 50%, 40%), hsl(${hue + 40}, 45%, 30%))`,
          }}
        >
          {initials}
        </div>

        {persona.isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-[#1C2E1E] font-medium">Live on 0G</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-9 px-5 pb-5 flex-1 flex flex-col">
        <h3 className="font-medium text-[#1C2E1E] text-[17px] mb-0.5">{persona.name}</h3>
        <p className="text-xs text-[#738273] font-mono mb-3">
          {persona.creator.slice(0, 6)}…{persona.creator.slice(-4)}
        </p>
        <p className="text-[#5A635A] text-sm leading-relaxed mb-5 line-clamp-2 flex-1">
          {persona.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              isFree
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-amber-50 text-amber-700 border border-amber-100"
            }`}
          >
            {isFree ? "Free" : `${formatEther(persona.accessFee)} 0G/day`}
          </span>

          <Link
            href={`/chat/${persona.id}`}
            className="bg-[#1C2E1E] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#2d4a30] transition-colors cursor-pointer"
          >
            Chat →
          </Link>
        </div>
      </div>
    </div>
  );
}
