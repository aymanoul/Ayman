#!/bin/bash
# SessionStart hook — restore the design-skills toolkit + 21st.dev "magic" MCP
# server on fresh Claude Code on the web containers (which are ephemeral, so
# anything under ~/.claude is lost when the container is reclaimed).
#
# - Skills install globally to ~/.claude/skills (no secrets required).
# - The "magic" MCP server reads its key from $MAGIC_API_KEY so the secret is
#   never committed to git. Set MAGIC_API_KEY in your web environment config.
#
# The hook is idempotent (safe to re-run) and runs only on the web.

set -uo pipefail

log() { echo "[session-start] $*" >&2; }

# Only run in Claude Code on the web; locally you manage your own setup.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# --- 1. Design skills (global / user scope) --------------------------------
REPOS=(
  "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill"
  "https://github.com/emilkowalski/skill"
  "https://github.com/Leonxlnx/taste-skill"
  "pbakaus/impeccable"
)

# Idempotency guard: the last skill installed is "impeccable"; if its symlink is
# already present we assume the toolkit is in place (e.g. on session resume).
if [ ! -e "$HOME/.claude/skills/impeccable" ]; then
  log "Installing design skills (global)…"
  for repo in "${REPOS[@]}"; do
    if npx -y skills@latest add "$repo" -g --skill '*' -y >&2; then
      log "  ok  $repo"
    else
      log "  FAILED  $repo"
    fi
  done
else
  log "Skills already present — skipping install."
fi

# --- 2. 21st.dev "magic" MCP server (user scope) ---------------------------
if [ -z "${MAGIC_API_KEY:-}" ]; then
  log "MAGIC_API_KEY not set — skipping 'magic' MCP server."
  log "  Add MAGIC_API_KEY to your environment config to auto-register it."
elif grep -q '"magic"' "$HOME/.claude.json" 2>/dev/null; then
  log "'magic' MCP server already registered — skipping."
else
  log "Registering 'magic' MCP server…"
  if claude mcp add magic --scope user --env API_KEY="$MAGIC_API_KEY" \
       -- npx -y @21st-dev/magic@latest >&2; then
    log "  ok  magic registered"
  else
    log "  FAILED  could not register magic"
  fi
fi

log "Done."
exit 0
