# Claude Code setup for this repo

This `.claude/` directory configures Claude Code (including **Claude Code on the web**)
to automatically restore a curated design-skills toolkit and the 21st.dev `magic`
MCP server on every fresh session. Web containers are ephemeral — anything installed
under `~/.claude` is lost when the container is reclaimed — so a `SessionStart` hook
reinstalls everything on startup.

## What the hook installs

`.claude/hooks/session-start.sh` runs on each web session and:

1. Installs 22 design / UX skills globally (`~/.claude/skills/`) via the `skills` CLI:
   - [`nextlevelbuilder/ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — 7 skills
   - [`emilkowalski/skill`](https://github.com/emilkowalski/skill) — 1 skill
   - [`Leonxlnx/taste-skill`](https://github.com/Leonxlnx/taste-skill) — 13 skills
   - [`pbakaus/impeccable`](https://github.com/pbakaus/impeccable) — 1 skill
2. Registers the `magic` MCP server ([`@21st-dev/magic`](https://www.npmjs.com/package/@21st-dev/magic)) at user scope.

The hook is idempotent and runs only on the web (it checks `$CLAUDE_CODE_REMOTE`).

## Required: set `MAGIC_API_KEY`

The `magic` server needs an API key. To keep the secret **out of git**, the hook reads
it from the `MAGIC_API_KEY` environment variable rather than hardcoding it.

Add `MAGIC_API_KEY=<your 21st.dev key>` to your environment's variables in the
Claude Code on the web settings — see
<https://code.claude.com/docs/en/claude-code-on-the-web>.

If `MAGIC_API_KEY` is not set, the skills still install but the `magic` server is skipped.

## Activation

Merge this into the repo's **default branch**. Future web sessions branch from it and
will run the hook automatically. New `magic` MCP tools become available once the session
finishes connecting.

> Note: these are third-party skills and an MCP server; they run with full agent
> permissions. Review them before relying on them for sensitive work.
