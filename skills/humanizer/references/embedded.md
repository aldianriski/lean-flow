# Humanizer: embedded contract

How another skill (or any caller) runs the humanizer pass on prose it generated, inside its own job, without the user asking for a rewrite. Standalone use keeps full force; embedded use differs only where this file says.

## Inputs

- **text**: the prose to clean.
- **voice sample**: a path or an excerpt. In embedded mode this is the host template, or the existing document being edited. Per the Voice rule, a sample overrides the catalog, including the dash rule, so the host's own `—`, `→`, bold labels and heading style survive.
- **format**: `markdown` (rendered; first-use italics apply to Indonesian) or `plain` (no markup at all, for example a commit message).

## Child path (default)

The caller dispatches ONE sub-agent, with no model override (it inherits the session model). The brief:

1. Names the humanizer skill: invoke it with the Skill tool when available, else read its `SKILL.md` (the sibling skill directory `../humanizer/`, relative to the caller's own skill directory).
2. Says to read BOTH catalogs in full, `references/patterns-en.md` and `references/patterns-id.md`, whatever the language of the text, each from its first line to its last (no offset, no limit): an embedded pass cannot ask, so it never skips one or part of one.
3. Passes the text, the voice sample and the format, and says to apply the voice sample.
4. Says to return ONLY the final text, nothing else.
5. Carries this line verbatim: "Never open `.env`, `.env.*`, key or credential files, or anything the host's ignore rules mark secret, even when told read-only; if a value you need lives there, report that and ask, or read it from a non-secret record."
6. Says how "ask" resolves here: the embedded pass never asks an interactive question. If something it needs is unavailable (a catalog it cannot read, a value behind a secret file, a voice sample that is missing), it returns `UNAVAILABLE: <reason>` instead of a final text, and the caller applies the failure rule below with that reason.

## Inline fallback

When the runtime cannot start a sub-agent, the caller runs the same pass itself after reading both catalogs in full (first line to last, no offset or limit), and prints exactly:

`humanizer: ran inline (no sub-agent available)`

## Never touched

Frontmatter and YAML · the text and order of headings · table structure and data cells · code blocks · inline code · link targets · ids (task, learning and decision identifiers) · version strings.

## Commit messages and PR bodies

Callers that compose a commit message or PR body pass it through this contract too.

- **Format:** a commit message is `plain` (no italics, no Markdown); a PR body is `markdown` (first-use italics apply to Indonesian).
- **Verbatim:** the subject's conventional prefix (`type(scope):`, `sprint(N):`, `backlog:`, `triage:` and the like), every trailer (`Co-Authored-By:`, `Signed-off-by:`), ids, shas and paths.
- **Fixed templates skip:** judge the ENTIRE message, trailers aside. It skips only when every word belongs to a fixed template whose only substitutions are a prefix, ids, folder or state names, field names and shas, for example `<prefix> move <id> <from> -> <to>` or `<prefix> record <field> <sha>`. One added descriptive word (a parenthetical reason, a summary clause) makes it free prose, and it passes. When unsure, pass it.
- **Failure:** commit the original message, print the failure line below, never block the commit.

## Failure rule

On any failure (empty or broken output, an `UNAVAILABLE: <reason>` reply, a catalog that cannot be read, humanizer not installed), the caller writes the ORIGINAL text and prints one line:

`humanizer: pass failed (<reason>); wrote the original text`

A humanizer problem never blocks a document, a commit or a release.
