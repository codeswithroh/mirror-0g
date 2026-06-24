---
name: gas
description: "How to think about fees on 0G vs Ethereum and L2s."
---

# Gas & Costs

**Gas & Costs** — How to think about fees on 0G vs Ethereum and L2s.


Official notes: [Deploy on 0G](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts) (performance / fee positioning).

---

## What you are paying for on 0G

1. **EVM execution** — gas for opcode execution, storage writes, logs, and precompile calls — same mental model as Ethereum.
2. **Storage network usage** — uploading and managing data via **0G Storage** involves **offchain service + onchain settlement** patterns; pricing may differ between **Turbo** vs **Standard** indexer modes ([Storage SDK](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk)).
3. **Compute jobs** — inference / fine-tuning integrations may bill **offchain** or via **contracts** depending on integration — read the specific compute guide for your path.

---

## Comparison framing (honest)

| Dimension | Ethereum L1 | Typical L2 | 0G (EVM layer) |
| --- | --- | --- | --- |
| Base gas | Highest | Lower | Documented as **low** relative to L1 |
| Finality feel | Blocks + social finality | Batch/proof latency | Docs emphasize **fast confirmation** |
| Extra surfaces | — | Bridge fees | **Storage** + **compute** costs add to “total bill” |

**Agent rule:** Never quote exact USD prices from training data — **measure** with live `eth_gasPrice`, `eth_feeHistory`, and user’s RPC.

---

## How to estimate EVM gas on 0G

1. **Deploy a stub contract** on testnet and measure `gasUsed` from receipts.
2. **Fuzz common paths** (mint, swap, stake) in Foundry with `--gas-report`.
3. **Account for `cancun`** features you enable (transient storage, blobs if applicable) — mismatched `evmVersion` causes **invalid opcode** failures ([deploy docs troubleshooting](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts)).

---

## Storage cost checklist

- **Indexer choice:** Turbo vs Standard — latency vs fee tradeoff ([SDK doc](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk)).
- **Replica count:** higher replication → more work / fees.
- **Proof verification:** downloads with `withProof=true` add client-side verification cost (not always gas, but product latency).

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/gas/SKILL.md
```

---

## Related skills

- [Ship](../ship/SKILL.md)
- [Tools](../tools/SKILL.md)
- [Money Legos](../money-legos/SKILL.md)

MIT License — contributions welcome.
