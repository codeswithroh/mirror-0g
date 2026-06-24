---
name: protocol
description: "How 0G evolves, how it connects to Ethereum, and how to stay current."
---

# Protocol

**Protocol** — How 0G evolves, how it connects to Ethereum, and how to stay current.


Primary sources: [0G Docs](https://docs.0g.ai/), [Validator / restaking](https://docs.0g.ai/run-a-node/validator-node).

---

## Architecture snapshot

0G runs a **consensus client (`0gchaind`)** paired with an **execution client (`geth`)** — analogous in responsibilities to Ethereum’s consensus/execution split, but as a **standalone chain** with its own network IDs:

| Network | Execution `networkid` | Chain ID (EVM) |
| --- | --- | --- |
| Galileo testnet | `16602` | `16602` |
| Aristotle mainnet | `16661` | `16661` |

Always confirm in [testnet](https://docs.0g.ai/developer-hub/testnet/testnet-overview) / mainnet docs.

---

## Upgrades and releases

- **Binary releases** ship via GitHub (`0gchain-Aristotle` for mainnet, `0gchain-NG` for Galileo testnet). Validator docs include **versioned download URLs** — treat these as the source of truth for node operators.
- **Node upgrade playbook:** stop `0gchaind` + `geth`, back up datadirs, deploy new binaries, restart with correct **`--chaincfg.chain-spec`** (`testnet` vs `mainnet`) and **restaking** flags when applicable.

Non-validator nodes **omit** restaking flags per official guidance.

---

## Ethereum linkage (Symbiotic restaking)

Validators enabling restaking must supply:

- **`--chaincfg.restaking.enabled`**
- **`--chaincfg.restaking.symbiotic-rpc-dial-url`** → Ethereum JSON-RPC
  - **Mainnet (Aristotle):** Ethereum mainnet RPC
  - **Testnet (Galileo):** Ethereum **Holešky** RPC

Implications for builders:

- **Liveness:** Validator set health indirectly depends on **Ethereum RPC availability** for participating operators.
- **Fork awareness:** Ethereum upgrades affecting restaking contracts matter for validator operations — follow 0G announcements and Symbiotic docs.

---

## Governance and roadmap hygiene

Unlike Ethereum’s public EIP pipeline, your agent should:

1. Prefer **official 0G announcements** (docs, Discord, GitHub releases) over model memorization.
2. Track **release tags** for node software you operate.
3. For application devs, track **RPC / explorer / system contract** updates in docs — not only chain client versions.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/protocol/SKILL.md
```

---

## Related skills

- [Ship](../ship/SKILL.md)
- [Gas & Costs](../gas/SKILL.md)
- [Security](../security/SKILL.md)

MIT License — contributions welcome.
