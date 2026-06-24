---
name: contract-addresses
description: "Known precompiles, contracts, and network endpoints — verify on Chainscan before production."
---

# Contract Addresses

**⚠️ ALWAYS verify live on Chainscan.** Testnet addresses and precompiles can change.


## Networks
| Network          | Chain ID | RPC (public)                  | Explorer                          |
|------------------|----------|-------------------------------|-----------------------------------|
| Galileo Testnet  | 16602    | https://evmrpc-testnet.0g.ai  | https://chainscan-galileo.0g.ai   |
| Aristotle Mainnet| 16661    | https://evmrpc.0g.ai          | https://chainscan.0g.ai           |

## Precompiles (fixed addresses)
| Precompile       | Address                                      | Purpose                              |
|------------------|----------------------------------------------|--------------------------------------|
| DASigners        | 0x0000000000000000000000000000000000001000   | DA signer management & proofs        |
| Wrapped0GBase    | 0x0000000000000000000000000000000000001002   | Wrapped native 0G token (ERC-20)     |
| DAEntrance       | 0xE75A073dA5bb7b0eC622170Fd268f35E675a957B   | DA blob submission                   |

## Other known contracts (mainnet examples)
- Staking interface: `0xea224dBB52F57752044c0C86aD50930091F561B9`

**Rule:** Never hardcode these in production code. Fetch from explorer or official docs at deploy time.

How to fetch this skill
```bash
curl -sSL https://0gskills.com/contract-addresses/SKILL.md
```

Related skills: [Tools](../tools/SKILL.md) · [Ship](../ship/SKILL.md) · [Protocol](../protocol/SKILL.md)

MIT License — contributions welcome.
