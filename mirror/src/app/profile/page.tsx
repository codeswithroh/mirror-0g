"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MIRROR_NFT_ADDRESS, MIRROR_NFT_ABI } from "@/lib/contract";
import { PersonaCard } from "@/components/persona-card";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();

  const { data: myPersonaIds } = useReadContract({
    address: MIRROR_NFT_ADDRESS,
    abi: MIRROR_NFT_ABI,
    functionName: "getCreatorPersonas",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#F1F3F1] flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#4D6D47]" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-normal tracking-tight text-[#1C2E1E] mb-3">
            Your Mirrors are waiting.
          </h1>
          <p className="text-[#5A635A] mb-7 text-sm leading-relaxed">
            Connect your wallet to see the AI twins you've created on 0G.
          </p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-sm text-[#738273] uppercase tracking-widest mb-3 font-medium">Your collection</p>
            <h1 className="text-4xl font-normal tracking-tight text-[#1C2E1E]">My Mirrors</h1>
            <p className="text-[#738273] font-mono text-sm mt-1">
              {address?.slice(0, 8)}…{address?.slice(-6)}
            </p>
          </div>
          <Link
            href="/create"
            className="bg-[#1C2E1E] hover:bg-[#2d4a30] text-white font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
          >
            + New Mirror
          </Link>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: "Mirrors created", value: myPersonaIds?.length?.toString() ?? "0" },
            { label: "Network", value: "0G Galileo" },
            { label: "Storage", value: "Decentralized" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-[#E8EBE8] rounded-2xl p-5 text-center"
            >
              <p className="text-2xl font-normal text-[#1C2E1E] mb-1">{stat.value}</p>
              <p className="text-xs text-[#738273] uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {!myPersonaIds || myPersonaIds.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20 border border-[#F1F3F1] rounded-2xl bg-[#FAFBF9]"
          >
            <p className="text-[#5A635A] text-lg mb-2">No Mirrors yet.</p>
            <p className="text-[#9AA89A] text-sm mb-7">Create your first AI twin and store it forever on 0G.</p>
            <Link
              href="/create"
              className="inline-block bg-[#1C2E1E] hover:bg-[#2d4a30] text-white font-medium px-7 py-3 rounded-xl transition-colors cursor-pointer text-sm"
            >
              Create your Mirror
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {myPersonaIds.map((id) => (
              <PersonaTokenLoader key={id.toString()} tokenId={id} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PersonaTokenLoader({ tokenId }: { tokenId: bigint }) {
  const { data } = useReadContract({
    address: MIRROR_NFT_ADDRESS,
    abi: MIRROR_NFT_ABI,
    functionName: "personas",
    args: [tokenId],
  });

  if (!data) {
    return <div className="border border-[#E8EBE8] rounded-2xl h-48 animate-pulse bg-[#FAFBF9]" />;
  }

  const [name, description, , accessFee, creator, , active] = data;

  return (
    <PersonaCard
      persona={{
        id: tokenId.toString(),
        name,
        description,
        accessFee,
        creator,
        active,
        isLive: true,
      }}
    />
  );
}
