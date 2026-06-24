"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);

  const shortAddr = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : null;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-white/90 backdrop-blur-sm border-b border-[#F1F3F1]">
        {/* Logo */}
        <Link href="/" className="flex flex-row items-center gap-2 select-none" onClick={() => setOpen(false)}>
          <span className="text-[21px] sm:text-[24px] tracking-tight text-[#1C2E1E] font-medium">
            Mirror&#174;
          </span>
          <span className="text-[22px] sm:text-[26px] text-[#1C2E1E] font-medium leading-none mb-0.5 opacity-60">
            &#10033;
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-row items-center text-[18px] text-[#1C2E1E]">
          <Link href="/explore" className="hover:opacity-60 transition-opacity">Explore</Link>
          <span className="opacity-40 mx-3">,&nbsp;</span>
          <Link href="/create" className="hover:opacity-60 transition-opacity">Create</Link>
          {isConnected && (
            <>
              <span className="opacity-40 mx-3">,&nbsp;</span>
              <Link href="/profile" className="hover:opacity-60 transition-opacity">My Mirrors</Link>
            </>
          )}
        </nav>

        {/* Desktop wallet */}
        <div className="hidden md:block">
          <ConnectButton
            showBalance={false}
            chainStatus="none"
            accountStatus="address"
          />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer p-1"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-[2px] bg-[#1C2E1E] transition-all duration-300 ${
              open ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-[#1C2E1E] transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-[#1C2E1E] transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-center gap-8 transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Link href="/" onClick={() => setOpen(false)} className="text-3xl font-medium text-[#1C2E1E] hover:opacity-60 transition-opacity">Home</Link>
        <Link href="/explore" onClick={() => setOpen(false)} className="text-3xl font-medium text-[#1C2E1E] hover:opacity-60 transition-opacity">Explore</Link>
        <Link href="/create" onClick={() => setOpen(false)} className="text-3xl font-medium text-[#1C2E1E] hover:opacity-60 transition-opacity">Create</Link>
        {isConnected && (
          <Link href="/profile" onClick={() => setOpen(false)} className="text-3xl font-medium text-[#1C2E1E] hover:opacity-60 transition-opacity">My Mirrors</Link>
        )}
        <div className="mt-4" onClick={() => setOpen(false)}>
          <ConnectButton showBalance={false} chainStatus="none" />
        </div>
      </div>
    </>
  );
}
