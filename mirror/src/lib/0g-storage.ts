// 0G Storage integration — runs server-side only (Node.js file system required)
// Client calls /api/upload-persona; this module is used inside that API route.

export type PersonaData = {
  name: string;
  description: string;
  systemPrompt: string;
  sampleConversations: Array<{ user: string; assistant: string }>;
  documents: string[];
  createdAt: string;
};

export type UploadResult = {
  rootHash: string;
  txHash: string;
};

// Called from the API route (server-side)
export async function uploadPersonaToStorage(data: PersonaData): Promise<UploadResult> {
  const { ZgFile, Indexer } = await import("@0gfoundation/0g-ts-sdk");
  const { ethers } = await import("ethers");
  const fs = await import("fs");
  const os = await import("os");
  const path = await import("path");

  const json = JSON.stringify(data, null, 2);

  // Write to temp file (ZgFile requires file path)
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "mirror-"));
  const tmpFile = path.join(tmpDir, "persona.json");
  fs.writeFileSync(tmpFile, json, "utf8");

  try {
    const file = await ZgFile.fromFilePath(tmpFile);
    const [tree, treeErr] = await file.merkleTree();
    if (treeErr || !tree) throw new Error(`Merkle tree error: ${treeErr}`);

    const rootHash = tree.rootHash() as string;

    const rpc = process.env.NEXT_PUBLIC_0G_RPC ?? "https://evmrpc-testnet.0g.ai";
    const indexerRpc =
      process.env.NEXT_PUBLIC_0G_INDEXER_RPC ??
      "https://indexer-storage-testnet-standard.0g.ai";
    const serverKey = process.env.SERVER_PRIVATE_KEY;

    if (!serverKey) {
      // Demo mode: return the root hash without uploading
      return { rootHash, txHash: "0x-demo-mode" };
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const signer = new ethers.Wallet(serverKey, provider);
    const indexer = new Indexer(indexerRpc);

    const [uploadResult, uploadErr] = await indexer.upload(file, rpc, signer);
    if (uploadErr) throw new Error(`Upload error: ${uploadErr}`);

    const txHash =
      uploadResult && "txHash" in uploadResult
        ? (uploadResult as { txHash: string }).txHash
        : "";

    return { rootHash, txHash };
  } finally {
    try {
      fs.unlinkSync(tmpFile);
      fs.rmdirSync(tmpDir);
    } catch {
      // cleanup is best-effort
    }
  }
}
