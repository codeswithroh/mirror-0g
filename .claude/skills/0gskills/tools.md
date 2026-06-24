---
name: tools
description: "Frameworks, RPCs, explorers, and SDKs for 0G."
---

# Tools

**Tools** — Frameworks, RPCs, explorers, and SDKs for 0G.


Official hub: [docs.0g.ai](https://docs.0g.ai/)

---

## RPC endpoints

| Use | URL | Notes |
| --- | --- | --- |
| Galileo EVM (dev) | `https://evmrpc-testnet.0g.ai` | Public; not for heavy production |
| Aristotle EVM | `https://evmrpc.0g.ai` | Public; prefer provider for prod |

**Recommended third-party RPCs** (testnet examples linked from docs): [QuickNode](https://www.quicknode.com/chains/0g), [Ankr](https://www.ankr.com/rpc/0g/), [dRPC](https://drpc.org/chainlist/0g-galileo-testnet-rpc), [Thirdweb](https://thirdweb.com/) — see [testnet overview](https://docs.0g.ai/developer-hub/testnet/testnet-overview).

---

## Block explorers

- **Testnet:** `https://chainscan-galileo.0g.ai` — txs, contracts, verification API ([deploy doc](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts)).
- **Mainnet:** `https://chainscan.0g.ai`
- **Storage explorer (Galileo):** `https://storagescan-galileo.0g.ai` ([testnet overview](https://docs.0g.ai/developer-hub/testnet/testnet-overview)).
- **Validators:** `https://testnet.0g.explorers.guru/` (testnet dashboard example).

---

## Contract development

- **Foundry** — `evm_version = "cancun"` in `foundry.toml`.
- **Hardhat** — `settings.evmVersion = "cancun"`.
- **Remix** — select Cancun-compatible compiler.
- **Deployment examples:** [0G deployment scripts](https://github.com/0gfoundation/0g-deployment-scripts).

Verification API bases:

- Testnet: `https://chainscan-galileo.0g.ai/open/api`
- Mainnet: `https://chainscan.0g.ai/open/api`

---

## Storage SDKs

- **npm:** `@0gfoundation/0g-ts-sdk` + peer `ethers` ([Storage SDK](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk)).
- **Go:** `github.com/0gfoundation/0g-storage-client`
- **Starters:** [TS starter kit](https://github.com/0gfoundation/0g-storage-ts-starter-kit), [Go starter kit](https://github.com/0gfoundation/0g-storage-go-starter-kit)

Indexer examples from docs:

- Turbo testnet indexer: `https://indexer-storage-testnet-turbo.0g.ai` (verify current docs for your network/mode).

---

## Compute

- **Inference:** [Inference docs](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference)
- **Fine-tuning:** [Fine-tuning docs](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/fine-tuning)
- **Overview:** [Compute network overview](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/overview)

---

## Node operations (validators / storage)

- **Validator:** [Validator node guide](https://docs.0g.ai/run-a-node/validator-node)
- **Storage node:** linked from storage docs.

---

## MCP / agent integrations

Agents can treat **this repository’s `SKILL.md` URLs** as tools: fetch markdown at runtime (`curl` / `fetch`) and follow links to official docs for parameters that change frequently.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/tools/SKILL.md
```

---

## Related skills

- [Ship](../ship/SKILL.md)
- [Contract Addresses](../contract-addresses/SKILL.md)
- [Testing](../testing/SKILL.md)

MIT License — contributions welcome.
