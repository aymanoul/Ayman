#!/bin/bash
# SessionStart hook — restore the design/video skills toolkit + 21st.dev "magic"
# MCP server on fresh Claude Code on the web containers (which are ephemeral, so
# anything under ~/.claude is lost when the container is reclaimed).
#
# - Skills install globally to ~/.claude/skills (no secrets required).
# - The "magic" MCP server reads its key from $MAGIC_API_KEY so the secret is
#   never committed to git. Set MAGIC_API_KEY in your web environment config.
#
# The hook is idempotent (safe to re-run) and runs only on the web. It runs
# asynchronously: the session starts immediately and the toolkit finishes
# installing in the background, becoming available shortly after.

set -uo pipefail

log() { echo "[session-start] $*" >&2; }

# Only run in Claude Code on the web; locally you manage your own setup.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Run asynchronously: the session starts immediately while the rest of this
# script installs the toolkit in the background (up to asyncTimeout ms).
echo '{"async": true, "asyncTimeout": 420000}'

# Repos installable via the `skills` CLI (standard skill layout).
REPOS=(
  "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill"
  "https://github.com/emilkowalski/skill"
  "https://github.com/Leonxlnx/taste-skill"
  "pbakaus/impeccable"
  "https://github.com/heygen-com/hyperframes"
  "https://github.com/AgriciDaniel/banana-claude"
  "https://github.com/hardikpandya/stop-slop"
  "https://github.com/JuliusBrussee/caveman"
)

# Install one skill whose SKILL.md lives in a non-standard path the `skills`
# CLI does not auto-detect. Sparse-checks out just that subtree and symlinks it
# into ~/.claude/skills like the CLI-managed ones.
install_manual_skill() {
  local repo="$1" path="$2" name="$3" tmp
  tmp=$(mktemp -d)
  if git clone --depth 1 --filter=blob:none --sparse \
       "https://github.com/$repo.git" "$tmp/repo" >&2 2>&1 \
     && git -C "$tmp/repo" sparse-checkout set "$path" >&2 2>&1 \
     && [ -d "$tmp/repo/$path" ]; then
    mkdir -p "$HOME/.agents/skills/$name"
    cp -rf "$tmp/repo/$path/." "$HOME/.agents/skills/$name/"
    ln -sfn "../../.agents/skills/$name" "$HOME/.claude/skills/$name"
    log "  ok  $name (manual)"
  else
    log "  FAILED  $name (manual install)"
  fi
  rm -rf "$tmp"
}

# Idempotency guard: build-with-agent-team is installed last, so if it is present
# the whole toolkit already installed (e.g. on session resume within a container).
if [ ! -e "$HOME/.claude/skills/build-with-agent-team" ]; then
  log "Installing skills (global)…"
  for repo in "${REPOS[@]}"; do
    if npx -y skills@latest add "$repo" -g --skill '*' -y >&2; then
      log "  ok  $repo"
    else
      log "  FAILED  $repo"
    fi
  done
  install_manual_skill "coleam00/context-engineering-intro" \
    "use-cases/build-with-agent-team" "build-with-agent-team"
else
  log "Skills already present — skipping install."
fi

# --- 21st.dev "magic" MCP server (user scope) ------------------------------
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
