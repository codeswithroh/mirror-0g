---
name: concepts
description: "Mental models for building on 0G."
---

# Concepts

**Concepts** — Mental models for building on 0G.


---

## Three planes

1. **Execution (EVM)** — Smart contracts, accounts, gas, events — same abstraction as Ethereum with 0G chain parameters ([Wallets](../wallets/SKILL.md), [Gas](../gas/SKILL.md)).
2. **Storage** — Large binary data with **indexer-coordinated** uploads/downloads and Merkle proofs ([Storage SDK](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk)).
3. **Compute** — Inference / fine-tuning services documented under **Compute Network** — often **offchain workers** with **onchain hooks** depending on integration.

Successful agents **place each feature** on the correct plane instead of stuffing everything into calldata.

---

## Nothing is automatic

Every state change needs:

- A **signer** with ETH/0G for gas (or sponsored flow you implemented).
- **Explicit** function calls — no hidden cron unless **keeper** infrastructure exists.

---

## Finality and UX

Docs emphasize **fast confirmation** — product UX should still show **pending** states until your app’s risk tolerance is met ([Frontend UX](../frontend-ux/SKILL.md)).

---

## Trust boundaries

- **Validators** — economic security linked to Ethereum restaking for participating operators ([Protocol](../protocol/SKILL.md)).
- **Storage nodes** — trust model includes **replica counts**, **indexer** behavior, and **proof verification** choices.
- **Compute providers** — treat as **third parties** unless cryptographically verified for your workload.

---

## Hyperstructure test (adapted)

Ask: “If the team disappears, does the **data** remain retrievable, and does the **contract** remain usable without a backend?” Adjust answer using Storage + indexer assumptions.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/concepts/SKILL.md
```

---

## Related skills

- [Ship](../ship/SKILL.md)
- [Layer 2s](../l2s/SKILL.md)
- [Security](../security/SKILL.md)

MIT License — contributions welcome.
