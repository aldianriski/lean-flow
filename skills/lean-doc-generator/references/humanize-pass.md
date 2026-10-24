# Humanize pass (Execution flow step 7)

Every invocation that writes or edits a doc passes its generated prose through `/humanizer` in embedded mode, following the contract in the humanizer skill's `references/embedded.md` (child sub-agent by default, inline fallback, keep-original on failure).

## What passes

Generated prose in doc bodies: paragraphs and list prose.

## What never passes

Frontmatter and ownership headers · tables of data · code blocks and inline code · ADR status lines · ids (task, learning, decision tokens) · version strings · heading text and order.

## Inputs

- **Voice sample**: the template being followed (`templates/<X>.md.template`) or, for an edit, the existing doc. House style (`—`, `→`, bold labels, heading style) survives.
- **Format**: `markdown`.

## Failure and degradation

If the pass fails, or humanizer is not installed, write the original text and print `humanizer: pass failed (<reason>); wrote the original text` (reason `not installed` when the skill is absent). Doc generation never stops on a humanizer problem.

Then enforce the line cap on the passed text.
