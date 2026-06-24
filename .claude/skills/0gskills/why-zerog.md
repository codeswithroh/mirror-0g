---
name: why-zerog
description: "When 0G Chain is the right foundation, and honest tradeoffs."
---

# Why ZeroG

**Why ZeroG** — When 0G Chain is the right foundation, and honest tradeoffs.


Sources: [0G Documentation](https://docs.0g.ai/), [Deploy on 0G](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts).

---

## What 0G optimizes for

1. **High-throughput EVM** — Documentation cites high per-shard TPS and **sub-second finality** for user-facing apps that outgrow Ethereum L1 latency.
2. **Modern EVM** — Support for recent Ethereum execution features (docs reference **Pectra** and **Cancun–Deneb**-class capabilities); compile with **`cancun`** EVM target.
3. **Native data + AI plane** — **Decentralized storage** (large data, proofs) and **compute network** (inference, fine-tuning) adjacent to the same ecosystem — fewer glue systems than bolting IPFS + centralized GPUs onto a generic chain.
4. **Ethereum security alignment** — Validator setup integrates **Symbiotic restaking** on Ethereum ([validator docs](https://docs.0g.ai/run-a-node/validator-node)), tying 0G consensus to Ethereum economic security.

---

## Strengths (build here when…)

- You need **low fees** and **fast confirmation** for interactive dApps while staying **Solidity-native**.
- Your product stores **large artifacts** or streams data where onchain bytes are prohibitive — use **0G Storage** with indexer + SDKs.
- You ship **AI features** and want network-level **compute** documentation and integration paths rather than only bespoke servers.
- You want **familiar tooling** (Foundry, Hardhat, ethers, viem) with minimal retooling.

---

## Tradeoffs and risks (be explicit)

- **Dual-layer ops:** Validators run **0gchaind + geth**; execution compatibility still requires **testing** on target networks — see [Testing](../testing/SKILL.md).
- **Restaking dependency:** Consensus participants rely on **Ethereum RPC** for restaking reads — plan RPC reliability and rate limits ([Protocol](../protocol/SKILL.md)).
- **Ecosystem maturity:** DeFi “money legos” may be thinner than Ethereum L1/L2 — verify liquidity, audits, and oracle availability before designing composability ([Money Legos](../money-legos/SKILL.md)).
- **Moving targets:** Testnet **contract addresses** and endpoints can change — never hardcode without a refresh path ([Contract Addresses](../contract-addresses/SKILL.md)).

---

## Countering stale narratives

- “We need an alt-L1 for cheap txs” — Often an L2 suffices; 0G’s pitch is **EVM + storage + AI compute + restaking alignment**, not price alone.
- “Any EVM chain works the same” — **Precompiles**, **storage indexers**, and **compute APIs** are 0G-specific integration surfaces.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/why-zerog/SKILL.md
```

---

## Related skills

- [Ship](../ship/SKILL.md) — implementation order.
- [Layer 2s](../l2s/SKILL.md) — positioning vs rollups.
- [Concepts](../concepts/SKILL.md) — mental models.

MIT License — contributions welcome.
