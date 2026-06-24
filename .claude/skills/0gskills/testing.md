---
name: testing
description: "Unit, fuzz, fork, and integration testing for 0G contracts and apps."
---

# Testing

**Testing** — Unit, fuzz, fork, and integration testing for 0G contracts and apps.


---

## Compiler alignment

Match production:

```toml
# foundry.toml
[profile.default]
evm_version = "cancun"
```

Mismatched EVM versions produce **invalid opcode** surprises on 0G ([deploy troubleshooting](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts)).

---

## Foundry essentials

- **Unit tests** — pure logic, mocked dependencies.
- **Fuzz** — property tests for math and state machines (`assume` bounds).
- **Invariant tests** — protocol-wide rules (`handler` pattern).
- **Fork tests** — optional against `https://evmrpc-testnet.0g.ai` for **integration** reads (mind rate limits).

Example fork RPC env:

```bash
export ZERO_G_TESTNET_RPC="https://evmrpc-testnet.0g.ai"
```

---

## Hardhat / viem

- Use **network config** with `chainId: 16602` for Galileo.
- Snapshot + revert between tests for isolation.

---

## Storage SDK testing

- **Mock** indexer RPC in CI where possible; run **one** smoke test against testnet in scheduled pipelines only.
- Assert **root hash** roundtrip: upload → download → compare bytes.

---

## What LLMs get wrong

- “Tests pass on Anvil default” ≠ compatible with **`cancun`** opcodes in production bytecode.
- Skipping **approval / permit** flows in integration tests.
- Not testing **failure strings** / custom errors users will see.

---

## CI recommendations

1. `forge fmt --check` + `forge test -vvv`
2. Slither / static analysis (optional but valuable)
3. Secret scanning on commits (prevent leaked deploy keys)

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/testing/SKILL.md
```

---

## Related skills

- [Security](../security/SKILL.md)
- [Ship](../ship/SKILL.md)
- [QA](../qa/SKILL.md)

MIT License — contributions welcome.
