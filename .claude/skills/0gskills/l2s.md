---
name: l2s
description: "How 0G relates to Ethereum rollups, bridges, and data availability."
---

# Layer 2s

**Layer 2s** — How 0G relates to Ethereum rollups, bridges, and data availability.


---

## Positioning: 0G is not “an L2 of Ethereum” in the rollup sense

**0G Chain** is a standalone network with its own **consensus + execution** stack (`0gchaind` + `geth`). It connects to Ethereum through **economic/security interfaces** such as **Symbiotic restaking** ([Validator doc](https://docs.0g.ai/run-a-node/validator-node)), not through a canonical rollup bridge like Optimistic or ZK rollups.

When users say “L2,” clarify:

- **Rollup L2:** state root committed to Ethereum, fraud/validity proof semantics.
- **0G:** independent chain with **EVM execution** and native **storage/compute** layers.

---

## When Ethereum L2s still matter to your 0G app

Many products will use:

- **Ethereum L1/L2** for liquidity, identity, or DeFi primitives.
- **0G** for low-latency execution + **decentralized data/AI**.

Integration patterns:

1. **Dual-chain UX:** wallet switches networks; assets bridged where a **trusted bridge** exists — verify bridge audits and limits before recommending.
2. **Offchain orchestration:** backend or agent coordinates Ethereum txs and 0G txs; maintain **explicit ordering** and **failure recovery** ([Orchestration](../orchestration/SKILL.md)).
3. **DA layer usage:** 0G documents a **DA integration** path ([testnet getting started](https://docs.0g.ai/developer-hub/testnet/testnet-overview)) — not interchangeable with “post blobs to Ethereum” unless your architecture says so.

---

## Bridges: agent safety rules

- **Never invent bridge addresses.** Source from official 0G communications and audited deployments only.
- **Slippage / finality:** treat bridged funds as **slow path** UX with progress indicators ([Frontend UX](../frontend-ux/SKILL.md)).
- **Mint authority:** cross-chain tokens often have **privileged minters** — reflect trust assumptions in docs.

---

## Scaling story for stakeholders

- **Ethereum L2:** scales **Ethereum state** and inherits L1 security model (per rollup design).
- **0G:** scales **application-specific** needs where **high throughput EVM**, **large data**, and **compute** intersect — measure end-to-end cost including storage/compute.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/l2s/SKILL.md
```

---

## Related skills

- [Why ZeroG](../why-zerog/SKILL.md)
- [Protocol](../protocol/SKILL.md)
- [Contract Addresses](../contract-addresses/SKILL.md)

MIT License — contributions welcome.
