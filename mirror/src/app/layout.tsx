import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { CursorOrb } from "@/components/cursor-orb";

export const metadata: Metadata = {
  title: "Mirror® — Your AI Twin, Permanent on 0G",
  description:
    "Train an AI version of yourself. Store it on 0G's decentralized network forever. No servers. No shutdowns. Just you, immortalized.",
  openGraph: {
    title: "Mirror® — Your AI Twin, Permanent on 0G",
    description: "Your AI twin. Stored forever. Owned by you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-[#1C2E1E] font-sans antialiased overflow-x-hidden selection:bg-[#EAECE9] selection:text-[#1C2E1E]">
        <Providers>
          <CursorOrb />
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
