#!/bin/bash
# Session start guard for amitdusane.com.
#
# Two jobs, both of which have already cost a session:
#   1. Refresh git refs, so status is never reported from a stale snapshot.
#      Amit works from the desktop app and from claude.ai/code against the same
#      `develop` branch. On 7 Aug 2026 a session opened with refs eleven commits
#      behind, and reported two finished sections as unwritten.
#   2. Install Hugo, which the web container does not ship. Without it the
#      mandated `hugo --gc` page-count assertion cannot run at all.
#
# This hook never changes the working tree. It fetches and reports; pulling
# stays a deliberate act, because CLAUDE.md requires reading the incoming
# commit messages before acting on them.

set -uo pipefail

HUGO_VERSION="0.123.7"

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0

# ---------------------------------------------------------------- git freshness
if git rev-parse --git-dir >/dev/null 2>&1; then
  git fetch origin --prune --quiet 2>/dev/null

  branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  echo "Session start: on branch '${branch}'."

  if git rev-parse --verify --quiet origin/develop >/dev/null; then
    behind=$(git rev-list --count "HEAD..origin/develop" 2>/dev/null || echo 0)
    if [ "${behind:-0}" -gt 0 ]; then
      echo ""
      echo "STALE: HEAD is ${behind} commit(s) behind origin/develop."
      echo "Do not report project status or start work until you have pulled."
      echo "Read the incoming commit messages before proposing anything:"
      git log --oneline "HEAD..origin/develop" 2>/dev/null | head -15 | sed 's/^/  /'
    else
      echo "Up to date with origin/develop."
    fi
  fi

  if [ "${branch}" != "develop" ]; then
    echo ""
    echo "NOTE: all work happens on 'develop'. 'main' is production and"
    echo "auto-deploys on push. CLAUDE.md and the governing documents exist"
    echo "only on 'develop'; a session started elsewhere is missing them."
  fi
fi

# --------------------------------------------------------------- hugo toolchain
if ! command -v hugo >/dev/null 2>&1; then
  if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
    echo ""
    echo "Installing Hugo ${HUGO_VERSION} extended (required for the build check)..."
    deb="/tmp/hugo_${HUGO_VERSION}.deb"
    url="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb"
    if curl -sSL --max-time 120 -o "$deb" "$url" 2>/dev/null && dpkg -i "$deb" >/dev/null 2>&1; then
      hash -r 2>/dev/null
      hugo_bin=$(command -v hugo 2>/dev/null || echo /usr/local/bin/hugo)
      if [ -x "$hugo_bin" ]; then
        echo "Hugo ready: $("$hugo_bin" version 2>/dev/null | cut -c1-40)"
      else
        echo "Hugo installed but not on PATH. Locate it before building."
      fi
    else
      echo "Hugo install FAILED. Install it before asserting the page count."
    fi
    rm -f "$deb"
  fi
else
  echo "Hugo present: $(hugo version 2>/dev/null | cut -c1-40)"
fi

exit 0
