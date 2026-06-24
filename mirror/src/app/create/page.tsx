"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { MIRROR_NFT_ADDRESS, MIRROR_NFT_ABI } from "@/lib/contract";
import type { PersonaData } from "@/lib/0g-storage";

type Step = "info" | "training" | "review" | "mint" | "done";

const inputCls =
  "w-full bg-[#FAFBF9] border border-[#E8EBE8] rounded-xl px-4 py-3 text-[#1C2E1E] placeholder-[#9AA89A] focus:outline-none focus:border-[#4D6D47] focus:ring-1 focus:ring-[#4D6D47]/20 transition-all duration-200 text-sm";

export default function CreatePage() {
  const { isConnected } = useAccount();
  const [step, setStep] = useState<Step>("info");
  const [uploading, setUploading] = useState(false);
  const [storageRootHash, setStorageRootHash] = useState<string>("");
  const [uploadTxHash, setUploadTxHash] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    accessFee: "0",
    documents: "",
    sampleQ1: "",
    sampleA1: "",
    sampleQ2: "",
    sampleA2: "",
  });

  const { writeContract, data: mintTxHash, isPending: isMinting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: mintDone } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    },
    []
  );

  async function handleUpload() {
    setUploading(true);
    try {
      const personaData: PersonaData = {
        name: form.name,
        description: form.description,
        systemPrompt: form.systemPrompt,
        sampleConversations: [
          { user: form.sampleQ1, assistant: form.sampleA1 },
          { user: form.sampleQ2, assistant: form.sampleA2 },
        ].filter((s) => s.user && s.assistant),
        documents: form.documents.split("\n").filter(Boolean),
        createdAt: new Date().toISOString(),
      };

      const res = await fetch("/api/upload-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }

      const { rootHash, txHash } = await res.json();
      setStorageRootHash(rootHash);
      setUploadTxHash(txHash);
      setStep("review");
    } catch (e) {
      alert(`Upload failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploading(false);
    }
  }

  function handleMint() {
    const feeWei = BigInt(Math.floor(parseFloat(form.accessFee || "0") * 1e18));
    const rootHashBytes32 = storageRootHash.padEnd(66, "0") as `0x${string}`;

    writeContract({
      address: MIRROR_NFT_ADDRESS,
      abi: MIRROR_NFT_ABI,
      functionName: "mintPersona",
      args: [
        form.name,
        form.description,
        rootHashBytes32,
        feeWei,
        `data:application/json,${JSON.stringify({ name: form.name, description: form.description })}`,
      ],
    });
  }

  if (mintDone) {
    return <SuccessScreen name={form.name} txHash={mintTxHash!} rootHash={storageRootHash} />;
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-sm text-[#738273] uppercase tracking-widest mb-3 font-medium">Create</p>
          <h1 className="text-4xl font-normal tracking-tight text-[#1C2E1E] mb-3">
            Build your Mirror.
          </h1>
          <p className="text-[#5A635A] text-base leading-relaxed">
            Your AI twin will be stored permanently on 0G's decentralized network — not a startup's server.
          </p>
        </motion.div>

        <StepIndicator current={step} />

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 border border-[#E8EBE8] rounded-2xl bg-[#FAFBF9]"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#F1F3F1] flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#4D6D47]" aria-hidden="true">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10h6M12 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[#5A635A] mb-5 text-sm">Connect your wallet to create a Mirror</p>
            <ConnectButton />
          </motion.div>
        ) : step === "info" ? (
          <InfoStep form={form} onChange={handleChange} onNext={() => setStep("training")} />
        ) : step === "training" ? (
          <TrainingStep
            form={form}
            onChange={handleChange}
            onBack={() => setStep("info")}
            onNext={handleUpload}
            uploading={uploading}
          />
        ) : step === "review" ? (
          <ReviewStep
            form={form}
            rootHash={storageRootHash}
            uploadTx={uploadTxHash}
            onBack={() => setStep("training")}
            onMint={handleMint}
            isMinting={isMinting || isConfirming}
          />
        ) : null}
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "info", label: "About" },
    { id: "training", label: "Training" },
    { id: "review", label: "Mint" },
  ];
  const idx = steps.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                i <= idx
                  ? "bg-[#1C2E1E] text-white"
                  : "bg-[#F1F3F1] text-[#738273] border border-[#E8EBE8]"
              }`}
          >
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs">
              {i < idx ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-6 h-px ${i < idx ? "bg-[#4D6D47]" : "bg-[#E8EBE8]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#E8EBE8] rounded-2xl p-7"
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-[#1C2E1E] mb-2">{children}</label>;
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-[#9AA89A]">{children}</p>;
}

function InfoStep({
  form,
  onChange,
  onNext,
}: {
  form: { name: string; description: string; accessFee: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
}) {
  const valid = form.name.trim().length >= 2 && form.description.trim().length >= 10;

  return (
    <Card>
      <h2 className="text-xl font-normal text-[#1C2E1E] mb-6">Who is your Mirror?</h2>
      <div className="space-y-5">
        <div>
          <Label>Name</Label>
          <input name="name" value={form.name} onChange={onChange} placeholder="e.g. Alex Chen" className={inputCls} />
          <Hint>The name people will see when they chat with your Mirror.</Hint>
        </div>
        <div>
          <Label>Description</Label>
          <textarea name="description" value={form.description} onChange={onChange} rows={3}
            placeholder="Who are you? What topics do you know about? What's your personality?"
            className={inputCls + " resize-none"} />
        </div>
        <div>
          <Label>Access fee (0G per day)</Label>
          <input name="accessFee" value={form.accessFee} onChange={onChange} type="number" min="0" step="0.001" placeholder="0" className={inputCls} />
          <Hint>Set to 0 to make your Mirror free for everyone.</Hint>
        </div>
      </div>
      <button onClick={onNext} disabled={!valid}
        className="mt-7 w-full bg-[#1C2E1E] hover:bg-[#2d4a30] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors cursor-pointer">
        Next: Add your knowledge →
      </button>
    </Card>
  );
}

function TrainingStep({
  form, onChange, onBack, onNext, uploading,
}: {
  form: { systemPrompt: string; documents: string; sampleQ1: string; sampleA1: string; sampleQ2: string; sampleA2: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBack: () => void;
  onNext: () => void;
  uploading: boolean;
}) {
  return (
    <Card>
      <h2 className="text-xl font-normal text-[#1C2E1E] mb-1">Teach it to sound like you.</h2>
      <p className="text-[#5A635A] text-sm mb-6">This data gets stored on 0G's decentralized network — linked to your Mirror forever.</p>
      <div className="space-y-5">
        <div>
          <Label>How should it talk?</Label>
          <textarea name="systemPrompt" value={form.systemPrompt} onChange={onChange} rows={4}
            placeholder="I'm Alex, a DeFi researcher. I speak concisely, use data, and I'm skeptical of hype. I often reference on-chain metrics..."
            className={inputCls + " resize-none"} />
        </div>
        <div>
          <Label>Sample question & answer #1</Label>
          <input name="sampleQ1" value={form.sampleQ1} onChange={onChange} placeholder="Question someone might ask you" className={inputCls + " mb-2"} />
          <textarea name="sampleA1" value={form.sampleA1} onChange={onChange} rows={2} placeholder="How you would answer, in your voice" className={inputCls + " resize-none"} />
        </div>
        <div>
          <Label>Sample question & answer #2</Label>
          <input name="sampleQ2" value={form.sampleQ2} onChange={onChange} placeholder="Another common question" className={inputCls + " mb-2"} />
          <textarea name="sampleA2" value={form.sampleA2} onChange={onChange} rows={2} placeholder="Your answer" className={inputCls + " resize-none"} />
        </div>
        <div>
          <Label>Background knowledge (one fact per line)</Label>
          <textarea name="documents" value={form.documents} onChange={onChange} rows={5}
            placeholder={"I graduated from MIT in 2015.\nI've been in crypto since Bitcoin was $200.\nI believe in open-source development."}
            className={inputCls + " resize-none"} />
        </div>
      </div>
      <div className="flex gap-3 mt-7">
        <button onClick={onBack} className="flex-1 border border-[#E8EBE8] hover:border-[#C8D0C8] text-[#5A635A] font-medium py-3 rounded-xl transition-colors cursor-pointer text-sm">
          ← Back
        </button>
        <button onClick={onNext} disabled={uploading}
          className="flex-[2] bg-[#1C2E1E] hover:bg-[#2d4a30] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors cursor-pointer text-sm">
          {uploading ? (
            <span className="flex items-center justify-center gap-2"><Spinner /> Uploading to 0G…</span>
          ) : "Save to 0G & continue →"}
        </button>
      </div>
    </Card>
  );
}

function ReviewStep({
  form, rootHash, uploadTx, onBack, onMint, isMinting,
}: {
  form: { name: string; description: string; accessFee: string };
  rootHash: string;
  uploadTx: string;
  onBack: () => void;
  onMint: () => void;
  isMinting: boolean;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-600" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2 className="font-medium text-[#1C2E1E]">Saved to 0G network</h2>
          <p className="text-xs text-[#4D6D47]">Your persona data is permanently stored</p>
        </div>
      </div>

      <div className="bg-[#FAFBF9] border border-[#F1F3F1] rounded-xl p-4 mb-5 space-y-3">
        <Row label="Name" value={form.name} />
        <Row label="Description" value={form.description} />
        <Row label="Access fee" value={parseFloat(form.accessFee || "0") === 0 ? "Free" : `${form.accessFee} 0G/day`} />
        <div>
          <p className="text-xs text-[#738273] mb-1">Storage root hash</p>
          <p className="text-xs font-mono text-[#4D6D47] break-all">{rootHash || "0x…"}</p>
        </div>
        {uploadTx && (
          <div>
            <p className="text-xs text-[#738273] mb-1">Upload tx</p>
            <p className="text-xs font-mono text-[#5A635A] break-all">{uploadTx}</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
        <p className="text-amber-800 text-sm">
          One last step — mint your Mirror as an NFT. This proves you own it on-chain and makes it discoverable by everyone.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-[#E8EBE8] hover:border-[#C8D0C8] text-[#5A635A] font-medium py-3 rounded-xl transition-colors cursor-pointer text-sm">
          ← Back
        </button>
        <button onClick={onMint} disabled={isMinting}
          className="flex-[2] bg-[#1C2E1E] hover:bg-[#2d4a30] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors cursor-pointer text-sm">
          {isMinting ? (
            <span className="flex items-center justify-center gap-2"><Spinner /> Minting on 0G…</span>
          ) : "Mint your Mirror NFT →"}
        </button>
      </div>
    </Card>
  );
}

function SuccessScreen({ name, txHash, rootHash }: { name: string; txHash: `0x${string}`; rootHash: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#1C2E1E] flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-3xl font-normal tracking-tight text-[#1C2E1E] mb-3">
          {name} is alive.
        </h1>
        <p className="text-[#5A635A] mb-8 leading-relaxed">
          Your Mirror NFT is minted on 0G chain. Your AI twin will be available forever — no subscriptions, no servers, no middleman.
        </p>
        <div className="bg-[#FAFBF9] border border-[#F1F3F1] rounded-2xl p-4 mb-8 text-left space-y-3">
          <Row label="Transaction" value={`${txHash.slice(0, 20)}…`} />
          <Row label="0G Storage root" value={`${rootHash.slice(0, 20)}…`} />
        </div>
        <div className="flex gap-3">
          <Link href="/explore" className="flex-1 bg-[#1C2E1E] hover:bg-[#2d4a30] text-white font-medium py-3 rounded-xl transition-colors cursor-pointer text-center text-sm">
            Explore Mirrors
          </Link>
          <Link href="/profile" className="flex-1 border border-[#E8EBE8] hover:border-[#C8D0C8] text-[#5A635A] font-medium py-3 rounded-xl transition-colors cursor-pointer text-center text-sm">
            My Mirrors
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-[#738273] shrink-0">{label}</span>
      <span className="text-xs text-[#1C2E1E] text-right">{value}</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin text-white/70" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
