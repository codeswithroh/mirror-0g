"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundVideo } from "@/components/background-video";
import { PersonaCard } from "@/components/persona-card";

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

const DEMO_PERSONAS = [
  {
    id: "0",
    name: "Satoshi Nakamoto",
    description: "The creator of Bitcoin. Ask him about decentralization, cryptography, or why he disappeared.",
    accessFee: BigInt(0),
    creator: "0xB16cF845e65A428AA9D4F4C1e2852aDc8FB1BF27" as `0x${string}`,
    active: true,
    chatCount: 2847,
    isLive: true,
  },
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
];

export default function Home() {
  const { displayed, done } = useTypewriter("your thoughts,\nforever.");

  return (
    <div className="relative bg-white text-[#1C2E1E] font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* Hero */}
      <section className="relative lg:min-h-screen flex flex-col">
        <BackgroundVideo />

        <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
          <main className="w-full max-w-7xl mx-auto px-6 pt-32 pb-12 flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-[80px] font-normal tracking-tight text-[#1C2E1E] leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap max-w-2xl">
                {displayed}
                {!done && (
                  <span className="inline-block w-[3px] h-[1.1em] bg-[#1C2E1E] align-middle ml-[3px] animate-blink" />
                )}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-10 max-w-xl">
                Train an AI version of yourself. Store it permanently on a decentralized network.
                <br className="hidden sm:block" />
                No company owns it. No server can delete it.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center gap-2 bg-[#1C2E1E] text-white text-[17px] font-medium px-7 py-3.5 rounded-xl hover:bg-[#2d4a30] transition-colors cursor-pointer"
                >
                  Create your Mirror
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#1C2E1E] text-[17px] font-medium px-7 py-3.5 rounded-xl border border-[#E2E6E2] hover:bg-[#F1F3F1] transition-colors cursor-pointer"
                >
                  Explore Mirrors
                </Link>
              </div>
            </motion.div>

            {/* Network badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-[#738273]">
                Live on 0G Galileo testnet · 1 Mirror minted
              </span>
            </motion.div>
          </main>
        </div>
      </section>

      {/* What is Mirror */}
      <section className="py-24 px-6 border-t border-[#F1F3F1]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm text-[#738273] uppercase tracking-widest mb-4 font-medium">What is this?</p>
              <h2 className="text-4xl md:text-5xl font-normal tracking-tight text-[#1C2E1E] leading-tight mb-6">
                An AI twin that outlives you.
              </h2>
              <p className="text-[#5A635A] text-lg leading-relaxed mb-6">
                Mirror lets you build an AI version of yourself — trained on your words, your ideas,
                your personality. Then it stores that AI permanently on 0G's decentralized network.
              </p>
              <p className="text-[#5A635A] text-lg leading-relaxed">
                No startup controls it. No server goes offline. Your Mirror is an NFT you own — and it talks to anyone, forever.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { n: "01", title: "Write your story", body: "Add your writing, Q&As, and documents. This becomes your AI's memory." },
                { n: "02", title: "Mint it on-chain", body: "Your Mirror is minted as an NFT on 0G. The data is stored on the decentralized network — not a company's server." },
                { n: "03", title: "It talks forever", body: "Anyone can chat with your Mirror. Set a price or make it free. It runs forever — no subscription needed." },
              ].map((item) => (
                <div key={item.n} className="flex gap-5 p-5 rounded-2xl border border-[#F1F3F1] bg-[#FAFBF9]">
                  <span className="text-2xl font-light text-[#C8D0C8] shrink-0">{item.n}</span>
                  <div>
                    <h3 className="font-medium text-[#1C2E1E] mb-1">{item.title}</h3>
                    <p className="text-sm text-[#5A635A] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Mirrors */}
      <section className="py-24 px-6 bg-[#FAFBF9] border-t border-[#F1F3F1]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm text-[#738273] uppercase tracking-widest mb-3 font-medium">Live now</p>
              <h2 className="text-4xl font-normal tracking-tight text-[#1C2E1E]">
                Meet the Mirrors
              </h2>
            </div>
            <Link
              href="/explore"
              className="hidden sm:block text-[#4D6D47] text-[15px] underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              View all
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_PERSONAS.map((p) => (
              <PersonaCard key={p.id} persona={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why decentralized */}
      <section className="py-24 px-6 border-t border-[#F1F3F1]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-[#738273] uppercase tracking-widest mb-4 font-medium">The difference</p>
          <h2 className="text-4xl md:text-5xl font-normal tracking-tight text-[#1C2E1E] mb-6 max-w-2xl mx-auto">
            Not a chatbot. A permanent record.
          </h2>
          <p className="text-[#5A635A] text-lg max-w-xl mx-auto mb-16 leading-relaxed">
            ChatGPT personas live on OpenAI's servers. When the company changes direction, your digital twin disappears. Mirror is different.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: "◎",
                title: "Stored on 0G",
                body: "Your persona data lives on 0G's distributed storage. No company owns it. No single point of failure.",
              },
              {
                icon: "◈",
                title: "Owned by you",
                body: "Your Mirror is an NFT on 0G chain. You can transfer it, sell it, or hold it for generations.",
              },
              {
                icon: "◉",
                title: "Runs forever",
                body: "AI inference happens on 0G's compute network — not AWS, not a startup. Truly unstoppable.",
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-[#E8EBE8] hover:border-[#C8D0C8] transition-colors">
                <span className="text-2xl text-[#4D6D47] block mb-4">{item.icon}</span>
                <h3 className="font-medium text-[#1C2E1E] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5A635A] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#1C2E1E]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-normal tracking-tight text-white mb-5 leading-tight">
            What would you want
            <br />people to remember?
          </h2>
          <p className="text-[#8FA88F] text-lg mb-10 leading-relaxed">
            Create your Mirror today. It takes five minutes.
            <br />Your thoughts live forever on 0G.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-white text-[#1C2E1E] text-[17px] font-medium px-8 py-4 rounded-xl hover:bg-[#EAECE9] transition-colors cursor-pointer"
          >
            Start creating →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#F1F3F1] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-[#738273]">Mirror® · Built on 0G Network · Zero Cup 2026</span>
        <div className="flex items-center gap-6">
          <a
            href="https://0g.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#4D6D47] underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            0G Network
          </a>
          <a
            href="https://chainscan-galileo.0g.ai/address/0xb42385Cbccb1d4Ea2d97c58E8168100f880B455c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#4D6D47] underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            Contract
          </a>
        </div>
      </footer>
    </div>
  );
}
