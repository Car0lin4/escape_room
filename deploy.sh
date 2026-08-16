#!/bin/sh
# ---------------------------------------------------------------------------
# Publish the game to Netlify.
#
#   ./deploy.sh
#
# The site is deployed from a clean export of whatever git has COMMITTED, not
# from the working folder. That is deliberate: the answer key and the hotspot
# reference images are gitignored, so they cannot end up on the live link by
# accident. It also means an uncommitted change will not be published — commit
# first, then deploy.
# ---------------------------------------------------------------------------
set -e

cd "$(dirname "$0")"

if [ -n "$(git status --porcelain)" ]; then
  echo "! You have uncommitted changes — they will NOT be deployed."
  git status --short
  printf 'deploy the committed version anyway? [y/N] '
  read -r reply
  case "$reply" in [Yy]*) ;; *) echo 'stopped.'; exit 1 ;; esac
fi

out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT

git archive HEAD | tar -x -C "$out"
rm -f "$out/README.md" "$out/deploy.sh"          # not part of the game
cp netlify.toml "$out/netlify.toml"              # headers travel with the deploy

netlify deploy --prod --dir "$out"
