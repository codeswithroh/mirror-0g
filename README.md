# Mirror®

**Your AI twin. Stored forever. Owned by you.**

Mirror lets anyone create a permanent AI version of themselves — trained on their words, ideas, and personality — and store it on [0G's decentralized network](https://0g.ai). No company controls it. No server can delete it. Your Mirror is an NFT you own, forever.

Built for the [0G Zero Cup Hackathon 2026](https://0g.ai/arena/zero-cup).

---

## What it does

1. **Create your Mirror** — Describe yourself, add sample Q&As and background knowledge. Your data is uploaded to 0G's decentralized storage. A Merkle root hash is stored on-chain as tamper-proof evidence.

2. **Mint it as an NFT** — Your Mirror is minted as an ERC-721 on 0G chain. The storage root hash links the token permanently to your off-chain data.

3. **It talks forever** — Anyone can chat with your Mirror via Claude AI. Set an access fee in 0G tokens, or make it free. It runs as long as the network runs.

---

## Live demo

- **Contract:** [`0xb42385Cbccb1d4Ea2d97c58E8168100f880B455c`](https://chainscan-galileo.0g.ai/address/0xb42385Cbccb1d4Ea2d97c58E8168100f880B455c) on 0G Galileo testnet
- **First Mirror:** [Satoshi Nakamoto — Token #0](https://chainscan-galileo.0g.ai/tx/0xe29c4737d8abd1413144dfcb57dde11e3943955abd6835e5a432c0a30edb8197)

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Framer Motion |
| Wallet | RainbowKit + wagmi v2 + viem |
| Smart contract | Solidity (ERC-721), Foundry |
| Decentralized storage | 0G Storage (`@0gfoundation/0g-ts-sdk`) |
| AI inference | Anthropic Claude (`claude-haiku-4-5`) |
| Network | 0G Galileo testnet (Chain ID: 16602) |

---

## Project structure

```
0g_cup/
├── mirror/                      # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Landing page (video hero + typewriter)
│   │   │   ├── explore/             # Browse all Mirrors
│   │   │   ├── chat/[id]/           # Chat with a Mirror
│   │   │   ├── create/              # 3-step creation wizard
│   │   │   ├── profile/             # Your minted Mirrors
│   │   │   └── api/
│   │   │       ├── upload-persona/  # 0G Storage upload endpoint
│   │   │       └── chat/            # Anthropic inference endpoint
│   │   ├── components/
│   │   │   ├── navbar.tsx           # Fixed navbar with RainbowKit
│   │   │   ├── background-video.tsx # Mouse-scrubbed hero video (RAF lerp)
│   │   │   ├── persona-card.tsx     # Mirror card component
│   │   │   └── providers.tsx        # wagmi + RainbowKit providers
│   │   └── lib/
│   │       ├── wagmi-config.ts      # 0G chain + WalletConnect config
│   │       ├── contract.ts          # MirrorNFT ABI + address
│   │       └── 0g-storage.ts        # 0G Storage upload logic
├── contracts/                   # Foundry smart contracts
│   ├── src/MirrorNFT.sol            # ERC-721 persona contract
│   ├── test/MirrorNFT.t.sol         # 6 passing tests
│   └── script/Deploy.s.sol          # Deployment script
└── scripts/
    └── seed-persona.mjs             # Seed a live testnet persona
```

---

## Getting started

### Prerequisites

- Node.js 20+
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- A wallet funded with testnet 0G from [faucet.0g.ai](https://faucet.0g.ai)

### Run the frontend

```bash
cd mirror
cp .env.example .env.local   # fill in your keys
npm install
npm run dev
# → http://localhost:3000
```

### Environment variables

Create `mirror/.env.local`:

```env
NEXT_PUBLIC_0G_RPC=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_0G_CHAIN_ID=16602
NEXT_PUBLIC_0G_STORAGE_RPC=https://rpc-storage-testnet.0g.ai
NEXT_PUBLIC_0G_INDEXER_RPC=https://indexer-storage-testnet-standard.0g.ai
NEXT_PUBLIC_MIRROR_CONTRACT=0xb42385Cbccb1d4Ea2d97c58E8168100f880B455c
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

ANTHROPIC_API_KEY=your_anthropic_api_key
SERVER_PRIVATE_KEY=your_deployer_private_key
```

### Run contract tests

```bash
cd contracts
forge test -v
# 6 tests, all passing
```

### Deploy the contract

```bash
cd contracts
forge create \
  --rpc-url https://evmrpc-testnet.0g.ai \
  --private-key $YOUR_PRIVATE_KEY \
  --evm-version cancun \
  --broadcast \
  src/MirrorNFT.sol:MirrorNFT
```

### Seed a demo persona

```bash
cd mirror
node seed-persona.mjs
# Uploads persona data to 0G Storage → mints as NFT on-chain
```

---

## How 0G is used

### Decentralized storage
Every Mirror's training data (personality, sample conversations, documents) is uploaded to 0G's distributed storage network. The Merkle root hash is stored on-chain in the NFT, creating a cryptographic link between the token and the data.

```typescript
const file = await ZgFile.fromFilePath(tmpFile);
const [tree] = await file.merkleTree();
const rootHash = tree.rootHash(); // stored on-chain
const [result] = await indexer.upload(file, rpcUrl, signer);
```

### On-chain ownership (ERC-721)
`MirrorNFT.sol` is a custom ERC-721 with:
- `mintPersona(name, description, storageRootHash, accessFee, metadataURI)` — creates the Mirror NFT
- `purchaseAccess(tokenId)` — payable; 95% to creator, 5% platform fee
- `hasAccess(tokenId, user)` — access control for paid Mirrors
- `updateStorageRoot(tokenId, newHash)` — owner can update their persona data

### 0G EVM execution
Contract deployed on 0G's EVM-compatible Galileo testnet (Chain ID 16602), compiled with `--evm-version cancun`.

---

## Contract

| | |
|---|---|
| **Address** | `0xb42385Cbccb1d4Ea2d97c58E8168100f880B455c` |
| **Network** | 0G Galileo Testnet (Chain ID: 16602) |
| **Explorer** | [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai/address/0xb42385Cbccb1d4Ea2d97c58E8168100f880B455c) |
| **First mint** | [Token #0 — Satoshi Nakamoto](https://chainscan-galileo.0g.ai/tx/0xe29c4737d8abd1413144dfcb57dde11e3943955abd6835e5a432c0a30edb8197) |

---

## License

MIT
