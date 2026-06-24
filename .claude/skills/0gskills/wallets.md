---
name: wallets
description: "Keys, accounts, and safe signing for 0G builders and agents."
---

# Wallets

**Wallets** — Keys, accounts, and safe signing for 0G builders and agents.


0G’s execution layer is **EVM-compatible** — standard Ethereum wallets work when configured with the correct **chain ID** and **RPC**.

---

## Network parameters (verify before mainnet)

| Field | Galileo testnet | Aristotle mainnet |
| --- | --- | --- |
| Network name | `0G-Galileo-Testnet` | (see mainnet docs) |
| Chain ID | `16602` | `16661` |
| RPC (public dev) | `https://evmrpc-testnet.0g.ai` | `https://evmrpc.0g.ai` |
| Explorer | `https://chainscan-galileo.0g.ai` | `https://chainscan.0g.ai` |

Source: [Testnet overview](https://docs.0g.ai/developer-hub/testnet/testnet-overview), [Deploy contracts](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts).

---

## Adding the network (MetaMask / wallets)

Use wallet UI “Add network” with the fields above. For agents generating JSON:

```json
{
  "chainId": "0x40DA",
  "chainName": "0G Galileo Testnet",
  "nativeCurrency": { "name": "0G", "symbol": "0G", "decimals": 18 },
  "rpcUrls": ["https://evmrpc-testnet.0g.ai"],
  "blockExplorerUrls": ["https://chainscan-galileo.0g.ai"]
}
```

`16602` hex = `0x40DA`.

---

## Funding testnet wallets

- Official faucet: https://faucet.0g.ai  
- Google Cloud faucet (Galileo): linked from [testnet overview](https://docs.0g.ai/developer-hub/testnet/testnet-overview)  
- Daily limits apply — design CI around **dedicated test keys** and **rate limits**.

---

## Operational security for agents

1. **Never** embed production private keys in frontend bundles or agent logs.
2. Use **environment variables** + secret managers for CI deploy keys.
3. Prefer **hardware wallets** or **multisig** for admin roles on production contracts.
4. Separate **deployer** keys from **treasury** keys; rotate after incidents.
5. When integrating **Storage SDK** in browsers, use **wallet connect** (`BrowserProvider`) — still avoid logging signed messages.

---

## Signing patterns

- **Transactions:** `eth_sendRawTransaction` after local signing (ethers/viem).
- **Typed data / permits:** only if your token supports EIP-2612 / domain separators you control — verify on testnet.
- **Validator keys:** `priv_validator_key.json` is **not** a hot wallet key — backup and treat as **HSM-grade** secrets ([validator doc](https://docs.0g.ai/run-a-node/validator-node)).

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/wallets/SKILL.md
```

---

## Related skills

- [Ship](../ship/SKILL.md)
- [Security](../security/SKILL.md)
- [Frontend UX](../frontend-ux/SKILL.md)

MIT License — contributions welcome.
