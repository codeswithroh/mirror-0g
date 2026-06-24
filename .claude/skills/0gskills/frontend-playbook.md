---
name: frontend-playbook
description: "Production pipeline for 0G web apps."
---

# Frontend Playbook

**Frontend Playbook** — Production pipeline for 0G web apps.


---

## Environment matrix

| Stage | RPC source | Chain ID | Notes |
| --- | --- | --- | --- |
| Local dev | Anvil or public test RPC | custom / `16602` | Mock contracts first |
| Staging | Provider testnet RPC | `16602` | Rate limits |
| Production | Paid RPC / self node | `16661` | Monitoring required |

Never ship **unpinned** RPC URLs without failover.

---

## Configuration

- **`.env`:** `VITE_*` / `NEXT_PUBLIC_*` for non-secret config only.
- **Secrets:** server-side or CI vault — not client bundles.

Example public config keys:

- `PUBLIC_ZERO_G_RPC_URL`
- `PUBLIC_CHAIN_ID`
- `PUBLIC_EXPLORER_URL`

---

## Build & release

1. **Typecheck + lint + unit tests** on PR.
2. **E2E** wallet smoke (Playwright + test wallet) optional but valuable.
3. **Preview deploy** per PR with **testnet** flag default.
4. **Production** deploy only after [QA](../qa/SKILL.md) sign-off.

---

## Static hosting

SPAs on IPFS / static hosts:

- Ensure **client-side routing** fallback (`index.html`).
- Pin **build hashes**; document **content-address** updates.

---

## Observability

- Log **JSON-RPC errors** server-side (strip secrets).
- Track **tx submission → confirmation** latency percentiles.

---

## Contract verification linkage

After deploy, link **verified source** explorer URLs in your README / UI “About” modal ([Tools](../tools/SKILL.md)).

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/frontend-playbook/SKILL.md
```

---

## Related skills

- [Frontend UX](../frontend-ux/SKILL.md)
- [Ship](../ship/SKILL.md)
- [Testing](../testing/SKILL.md)

MIT License — contributions welcome.
