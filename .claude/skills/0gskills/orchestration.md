---
name: orchestration
description: "How AI agents should plan, execute, and verify multi-step 0G dApps."
---

# Orchestration

**Orchestration** — How AI agents should plan, execute, and verify multi-step 0G dApps.


---

## Three-phase loop

### Phase A — Plan (read-only)

1. Fetch **[Ship](../ship/SKILL.md)** and **[Concepts](../concepts/SKILL.md)**.
2. List **onchain** vs **0G Storage** vs **0G Compute** responsibilities.
3. Identify **external dependencies** (bridges, oracles, third-party APIs).

### Phase B — Build (write paths)

1. Contracts: Foundry/Hardhat with **`cancun`** EVM.
2. Storage: TS/Go SDK with **indexer** selection (Turbo vs Standard).
3. Frontend: wallet flows per [Frontend UX](../frontend-ux/SKILL.md).

### Phase C — Verify (gates)

1. `forge test` / CI with fork if needed ([Testing](../testing/SKILL.md)).
2. Run [QA](../qa/SKILL.md) with a **separate reviewer context**.
3. For value at risk, run [Audit](../audit/SKILL.md) prompts.

---

## Idempotent agent operations

- **Deploy scripts:** support “already deployed” detection via `CREATE2` factories or address registry — avoid duplicate deployments on retry.
- **Storage uploads:** persist **root hash → tx hash** mapping in your state DB before announcing success.
- **User-facing txs:** always surface **replacement / nonce** errors clearly.

---

## Multi-chain coordination

When combining Ethereum + 0G:

- Use explicit **state machines** in docs: `INIT → ETH_BRIDGE_PENDING → 0G_MINT → DONE`.
- Never claim finality until **both** sides show expected events ([Indexing](../indexing/SKILL.md)).

---

## Human handoff points

Agents should pause for human review when:

- Changing **proxy admin** or **upgrade** permissions.
- Introducing **new oracle** providers.
- Adjusting **fee switches** affecting user funds.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/orchestration/SKILL.md
```

---

## Related skills

- [Ship](../ship/SKILL.md)
- [Tools](../tools/SKILL.md)
- [QA](../qa/SKILL.md)

MIT License — contributions welcome.
