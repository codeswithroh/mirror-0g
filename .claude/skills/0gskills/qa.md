---
name: qa
description: "Checklist for reviewing a 0G dApp before release."
---

# QA

**QA** — Checklist for reviewing a 0G dApp before release.


Run this in a **separate reviewer session** from the builder agent ([Orchestration](../orchestration/SKILL.md)).

---

## Wallet & network

- [ ] Wrong network shows **actionable** switch UI ([Frontend UX](../frontend-ux/SKILL.md)).
- [ ] Connected address displayed with **copy** + **explorer** link.
- [ ] Disconnect clears sensitive UI state.

---

## Transactions

- [ ] No **double submission** on rapid clicks.
- [ ] Pending states block duplicate flows.
- [ ] Reverts show **human-readable** messages where possible.
- [ ] Gas estimation failures handled gracefully.

---

## Approvals & permits

- [ ] Allowances are **minimal** or user-educated on infinite approval risk.
- [ ] `permit` deadlines and nonces validated client-side.

---

## Data plane (Storage / Compute)

- [ ] Upload shows **progress** and final **root hash / tx** reference.
- [ ] Download paths document **verification** (`withProof` where needed) ([Storage SDK](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk)).
- [ ] Browser limitations acknowledged (download reassembly).

---

## Security

- [ ] No **private keys** or **mnemonics** in repo or client.
- [ ] Admin functions behind **multisig** / timelock as designed ([Security](../security/SKILL.md)).

---

## Copy & branding

- [ ] Docs cite **correct chain IDs** (`16602` / `16661`) and **explorer** URLs ([Tools](../tools/SKILL.md)).
- [ ] Faucet instructions up to date.

---

## Analytics & privacy

- [ ] Wallet addresses **not** sent to third-party analytics without consent.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/qa/SKILL.md
```

---

## Related skills

- [Audit](../audit/SKILL.md)
- [Ship](../ship/SKILL.md)

MIT License — contributions welcome.
