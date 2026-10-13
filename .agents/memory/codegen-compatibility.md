---
name: Codegen compatibility
description: A workspace-specific mismatch in automatic Zod version inference.
---

Do not rely on Orval’s automatic Zod-version inference; align generated schemas with the Zod API actually installed in the target package.

**Why:** Automatic inference generated Zod 4-only email and integer helpers even though the target package resolved Zod 3, causing codegen's downstream typecheck to fail.

**How to apply:** Keep the generator’s version choice explicit and revisit it when upgrading the target package; never patch generated output to work around this mismatch.
