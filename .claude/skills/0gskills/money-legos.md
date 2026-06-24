---
name: money-legos
description: "DeFi composability on 0G’s EVM layer."
---

# Money Legos

**Money Legos** — DeFi composability on 0G’s EVM layer.


---

## Baseline reality check

0G supports **standard Solidity DeFi** patterns (AMMs, lending-style vaults, oracles, staking). **Liquidity depth, audited protocols, and oracle availability** may differ from Ethereum mainnet — **verify live deployments** before designing yield routes.

---

## Composability patterns

1. **Swap → stake → vault** — sequence transactions explicitly; never assume atomicity across protocols unless using a **single aggregator/router** you control.
2. **Flash liquidity** — if porting flash loan patterns, re-run [Security](../security/SKILL.md) (callbacks, reentrancy).
3. **Governance tokens** — timelocks, delegation UI, and **double-vote** hazards are unchanged from EVM best practices.

---

## Oracles on 0G

- Prefer **multi-source** price feeds; document **staleness** thresholds.
- If bridging Ethereum state, understand **latency** and **failure modes** ([Layer 2s](../l2s/SKILL.md)).

---

## Stablecoins & bridged assets

- Confirm **issuer**, **freeze keys**, and **bridge risk** in user-facing copy.
- Display **chain** and **token contract** addresses in transaction previews ([Frontend UX](../frontend-ux/SKILL.md)).

---

## Agent checklist before recommending yields

- [ ] Protocol **audit** status and **TVL** source cited from explorer, not memory.
- [ ] **Impermanent loss** explained for AMM positions.
- [ ] **Liquidation** paths understood for lending.
- [ ] **Approval** scopes minimized (`permit` where safe).

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/money-legos/SKILL.md
```

---

## Related skills

- [Security](../security/SKILL.md)
- [Testing](../testing/SKILL.md)
- [Indexing](../indexing/SKILL.md)

MIT License — contributions welcome.
