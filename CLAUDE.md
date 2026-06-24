# 0G Zero Cup Hackathon

## 0G Skills Reference
All 0G skills are installed at `.claude/skills/0gskills/`. Always read the relevant skill before coding.

```
Read .claude/skills/0gskills/ship.md before coding on 0G.
```

Key skills:
- **ship.md** — End-to-end build & deploy on 0G. Start here.
- **concepts.md** — Mental models: execution + storage + compute
- **tools.md** — RPCs, SDKs, Foundry/Hardhat
- **orchestration.md** — Agent workflows
- **security.md** — Defensive Solidity
- **frontend-ux.md** — dApp UX rules
- **contract-addresses.md** — System contracts (always verify against docs.0g.ai)

## 0G Network Config
| Network | Chain ID | RPC | Explorer |
|---------|----------|-----|----------|
| Galileo testnet | `16602` | `https://evmrpc-testnet.0g.ai` | `https://chainscan-galileo.0g.ai` |
| Aristotle mainnet | `16661` | `https://evmrpc.0g.ai` | `https://chainscan.0g.ai` |

## Key SDKs
- Storage TS SDK: `@0gfoundation/0g-ts-sdk` + `ethers`
- Faucet: https://faucet.0g.ai
- Docs: https://docs.0g.ai

## Compile Target
Always use `--evm-version cancun` for Foundry deploys.
