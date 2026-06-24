---
name: audit
description: "Master audit hub for 0G Chain applications (EVM, storage, compute)."
---

# Audit

**Audit** — The central directory for auditing 0G Chain applications.

Use this hub to drill down into topic-specific audit tracks. Each track contains detailed checklists, 0G-specific gotchas, and prompt templates for specialized reviews.

---

## 🛠️ Audit Strategy

To perform a comprehensive review of a 0G integration:

1. **Scoping**: Identify which 0G services are in use (EVM, Storage, or Compute).
2. **Specialized Review**: Run parallel sub-agent audits for each technical domain.
3. **Consolidation**: Merge findings, deduplicate root causes, and prioritize by protocol risk.
4. **Verification**: Re-verify findings against [official 0G documentation](https://docs.0g.ai/).

---

## 🧭 Audit Tracks

Select a track below for a specialized auditing guide:

### A. Wallets & Infrastructure
Security checklist for private key handling, signing patterns, and agent isolation.
👉 [**Audit: Wallets**](../audit-wallets/SKILL.md)

### B. Storage & Data Availability
Checklist for blob integrity, retrieval proof verification, and SDK implementation safety.
👉 [**Audit: Storage**](../audit-storage/SKILL.md)

### C. Onchain Indexing
Ensuring offchain states match onchain events with high reliability and reorg-safety.
👉 [**Audit: Indexing**](../audit-indexing/SKILL.md)

### D. Multi-Step Orchestration
Validating mission-critical agent workflows and multi-transaction state transitions.
👉 [**Audit: Orchestration**](../audit-orchestration/SKILL.md)

### E. Frontend & UX Controls
Auditing the bridge between users/agents and the chain (chain switching, error surfacing).
👉 [**Audit: Frontend**](../audit-frontend/SKILL.md)

---

## 🧱 Severity Rubric

- **Critical** — Direct fund loss, protocol brick, or universal state theft.
- **High** — Material loss or protocol compromise under plausible conditions.
- **Medium** — Griefing, Denial of Service (DoS), or sub-protocol economic loss.
- **Low** — UX frictions, gas inefficiencies, or edge-case revert paths.

---

## 📝 Finding Template

Use this format for reporting all security findings to ensure consistency:

```markdown
Title: [Concise description of the finding]
Severity: [Critical | High | Medium | Low]
Domain: [Wallets | Storage | Indexing | Orchestration | Frontend]
Description: [What is the vulnerability?]
Attack Vector: [Step-by-step exploit sketch]
Recommendation: [Proposed fix or mitigation]
Test Case: [Idea for a regression test or POC]
```

---

## Related Core Skills

- [Security](../security/SKILL.md) — Base EVM vulnerabilities.
- [Testing](../testing/SKILL.md) — Fuzzing and invariant testing guides.
- [QA](../qa/SKILL.md) — General pre-release checklists.

MIT License — contributions welcome.
