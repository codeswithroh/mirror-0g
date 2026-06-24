---
name: indexing
description: "Querying 0G chain data responsibly (events, subgraphs, analytics)."
---

# Indexing

**Indexing** — Querying 0G chain data responsibly (events, subgraphs, analytics).


---

## Do not scan blocks naively

Looping `eth_getLogs` across unbounded ranges from the client will **fail** at scale (timeouts, provider limits). Use:

- **Indexer services** (subgraph-style, hosted indexers, or self-hosted).
- **Precomputed aggregates** in your backend with checkpointed block cursors.

---

## Event design for indexability

- Emit **indexed** fields for filters you need (`indexed` args up to EVM limits).
- Prefer **explicit** events over relying on storage reads from offchain jobs.
- Version events (`V2` suffix) when changing schemas.

---

## The Graph / Dune equivalents

Ecosystem tooling evolves — agents should:

1. Check whether **hosted subgraph** providers support **0G chain IDs** (`16602`, `16661`).
2. If unavailable, run **Graph Node** or custom indexers against your RPC provider.
3. For analytics, replicate patterns: **raw logs → transforms → tables** (Dune-style) with **chain id** partition.

---

## Storage metadata indexing

For **0G Storage**, persist:

- **Root hash**, **upload tx hash**, **content type**, **uploader**, **timestamp**
- Optional **encryption** metadata (never store raw keys onchain)

---

## RPC etiquette

- Batch requests where supported.
- Backoff on `429` / timeouts.
- Use **websocket** subscriptions only if your provider supports them reliably.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/indexing/SKILL.md
```

---

## Related skills

- [Tools](../tools/SKILL.md)
- [Frontend UX](../frontend-ux/SKILL.md)
- [Ship](../ship/SKILL.md)

MIT License — contributions welcome.
