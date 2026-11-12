#!/usr/bin/env bash
# Baut die öffentliche Seite aus dem zuletzt committeten Stand und
# veröffentlicht sie über den Branch gh-pages auf GitHub Pages
# (Click-Dummy des ImmoSenio-Designentwurfs):
#   /                Startseite (index.html)
#   /styleguide.html Styleguide
# Der Entwurf liegt in 02_unsere_arbeit/entwurf und kommt ins Wurzelverzeichnis
# der Seite. Beide HTML-Dateien tragen noindex schon im Quelltext; das Skript
# bricht ab, wenn es im committeten Stand fehlt.
# Arbeitet nur mit Git-Objekten, der Projektordner bleibt unberührt.
set -euo pipefail
cd "$(dirname "$0")"

export GIT_INDEX_FILE="$(git rev-parse --git-dir)/index-gh-pages"
trap 'rm -f "$GIT_INDEX_FILE"' EXIT

git read-tree HEAD:02_unsere_arbeit/entwurf
for p in index.html styleguide.html; do
  inhalt=$(git show ":$p")
  if ! grep -q '<meta name="robots" content="noindex' <<<"$inhalt"; then
    echo "Abbruch: In $p fehlt das noindex-Meta im committeten Stand." >&2
    exit 1
  fi
done
git update-index --add --cacheinfo "100644,$(git hash-object -w --stdin </dev/null),.nojekyll"
TREE=$(git write-tree)

git fetch -q origin gh-pages 2>/dev/null || true
PARENT=$(git rev-parse -q --verify refs/remotes/origin/gh-pages || true)
if [ -n "$PARENT" ] && [ "$(git rev-parse "$PARENT^{tree}")" = "$TREE" ]; then
  echo "Keine Änderungen gegenüber der veröffentlichten Fassung."
  exit 0
fi
COMMIT=$(git commit-tree "$TREE" ${PARENT:+-p "$PARENT"} \
  -m "Veröffentlichung aus $(git rev-parse --short HEAD)" \
  -m "Co-Authored-By: Claude <noreply@anthropic.com>")
git push -q origin "$COMMIT:refs/heads/gh-pages"
echo "Veröffentlicht: $COMMIT"
