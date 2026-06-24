---
name: security
description: "Vulnerabilities and defensive coding for Solidity on 0G."
---

# Security

**Security** — Vulnerabilities and defensive coding for Solidity on 0G.


0G uses standard **EVM semantics** — Ethereum-class vulnerabilities apply. Compiler target: **`cancun`** ([deploy doc](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts)).

---

## Pre-deploy checklist (minimum)

- [ ] **Reentrancy:** CEI pattern; `nonReentrant` for external calls.
- [ ] **Access control:** `onlyRole` / Ownable; **no missing** modifiers on sensitive setters.
- [ ] **Integer precision:** mul/div ordering; avoid naked `div` on small numbers.
- [ ] **Oracle manipulation:** TWAP vs spot; staleness checks; liquidity thresholds.
- [ ] **Token quirks:** fee-on-transfer, rebasing, broken ERC-20s — document unsupported tokens.
- [ ] **Upgrades:** transparent vs UUPS pitfalls; storage gaps; initializer duplication.
- [ ] **Denial of service:** unbounded loops on externally influenced arrays.
- [ ] **Front-running:** slippage params; commit-reveal where needed.
- [ ] **Precompiles:** validate inputs to **0G precompile** calls; failures can brick paths if unchecked.

---

## 0G-specific considerations

- **Precompile failures** — bubble up errors; do not assume atomic success across precompile + state writes.
- **Cross-plane attacks** — e.g., **offchain** compute claims without **onchain verification** can lie; design explicit attestations.
- **Storage SDK** — never expose **private keys** in browser demos without warning; prefer server-side upload for privileged data.

---

## Common agent mistakes

1. **Copy-paste OpenZeppelin** without reading inherited behavior (`ERC721._safeMint` callbacks).
2. **Ignoring decimals** — `1e18` vs human units.
3. **Unbounded approvals** in examples — teach **exact allowances** or `permit`.
4. **Missing event indexing** — makes incident response impossible ([Indexing](../indexing/SKILL.md)).

---

## Incident response

- **Pause** if upgradeable and designed with pause.
- **Notify** users via onchain event + offchain channels.
- **Snapshot** state (block height) before fixes.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/security/SKILL.md
```

---

## Related skills

- [Testing](../testing/SKILL.md)
- [Audit](../audit/SKILL.md)
- [Money Legos](../money-legos/SKILL.md)

MIT License — contributions welcome.
