---
name: standards
description: "Token, NFT, and identity patterns on 0G’s EVM layer."
---

# Standards

**Standards** — Token, NFT, and identity patterns on 0G’s EVM layer.


0G execution is **EVM-compatible** — treat standards as **Ethereum-equivalent** unless a 0G-specific precompile or system contract says otherwise ([precompiles](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/precompiles/precompiles-overview)).

---

## ERC-20 equivalent (fungible tokens)

- Use **OpenZeppelin** `ERC20` or minimal custom implementations.
- **Decimals:** default `18` unless you have a strong reason — offchain agents mishandle decimals constantly ([Security](../security/SKILL.md)).
- **Mint/burn roles:** document admin keys; prefer **timelock + multisig** for production.

---

## ERC-721 equivalent (NFTs)

- Use `ERC721` with **explicit metadata** URIs; pin or host on **0G Storage** when large assets are needed ([Storage SDK](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk)).
- **Royalties:** if using ERC-2981, verify marketplace support on 0G ecosystem marketplaces before promising royalties.

---

## ERC-1155 equivalent (multi-token)

- Ideal for gaming / bundled assets — watch **batch transfer** reentrancy and **id mixups** in UI ([Security](../security/SKILL.md)).

---

## ERC-8004 equivalent (agent identity — conceptual)

Ethereum’s **ERC-8004**-class patterns (agent discovery, reputation) can be ported as **standard Solidity** on 0G if deployments exist — **do not assume** registry addresses; deploy or verify on [Contract Addresses](../contract-addresses/SKILL.md) / explorer.

Agent guidance:

- Store **did:ethr** or **contract-bound identities** as immutable references.
- Emit **events** for indexers when registrations change ([Indexing](../indexing/SKILL.md)).

---

## Account abstraction & smart EOAs

If your toolchain supports **EIP-7702**-class patterns on 0G’s current fork, validate with:

1. **Compiler `evmVersion: cancun`** baseline ([deploy doc](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts)).
2. **Integration tests** on target chain ID (`16602` / `16661`).

---

## 0G-specific interfaces

- **Precompiles** such as **DASigners** and **Wrapped0GBase** live at fixed addresses — read official precompile docs before calling ([list](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts)).

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/standards/SKILL.md
```

---

## Related skills

- [Security](../security/SKILL.md)
- [Testing](../testing/SKILL.md)
- [Ship](../ship/SKILL.md)

MIT License — contributions welcome.
