---
name: frontend-ux
description: "Mandatory UX rules for 0G dApps (EVM + wallet flows)."
---

# Frontend UX

**Frontend UX** — Mandatory UX rules for 0G dApps (EVM + wallet flows).


---

## Chain clarity

- Show **network name** and **chain ID** in settings (e.g., “0G Galileo · 16602”).
- Block actions with a clear **“Switch network”** prompt when `chainId` mismatches.

---

## Transaction feedback

- **Pending:** disable duplicate submits; show spinner + tx hash link to Chainscan ([Tools](../tools/SKILL.md)).
- **Success / revert:** surface **decoded** revert reasons when available.
- **Replacement:** handle higher gas / nonce issues with human-readable copy.

---

## Approvals

- Prefer **exact** allowances or documented **permit** flows.
- Never label infinite approvals as “best practice” without risk disclosure.

---

## Storage uploads from browser

Per [Storage SDK](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk):

- `indexer.download()` is **Node-oriented** — browsers need **segment reassembly** patterns (see TS starter kit).
- Bundlers need **polyfills** for Node builtins — copy working config from official starter.

---

## Accessibility & trust

- **Contrast** and **font sizes** for crypto-critical numbers.
- **Copy buttons** for addresses and hashes.
- **Explorer links** open in new tab with rel security attributes.

---

## Agent anti-patterns

- Shipping **example private keys** in UI code.
- Omitting **loading** states on `eth_call` reads.
- Using **native alerts** for errors instead of inline components.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/frontend-ux/SKILL.md
```

---

## Related skills

- [Frontend Playbook](../frontend-playbook/SKILL.md)
- [Wallets](../wallets/SKILL.md)
- [QA](../qa/SKILL.md)

MIT License — contributions welcome.
