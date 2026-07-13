#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT_DIR/styles-src"
DIST_DIR="$ROOT_DIR/dist"
mkdir -p "$DIST_DIR"

STYLE_IDS=$(node -e "const fs=require('fs');const p=process.argv[1];const s=fs.readFileSync(p,'utf8');const ids=[...s.matchAll(/id:\s*'([^']+)'/g)].map(m=>m[1]);if(!ids.length){process.exit(1);}console.log(ids.join(' '));" "$ROOT_DIR/src/cpb-styles.js")
STYLE_COUNT=0

for STYLE_ID in $STYLE_IDS; do
    TOKENS_FILE="$SRC_DIR/cpb-style-${STYLE_ID}.tokens.css"
    TAIL_FILE="$SRC_DIR/cpb-style-${STYLE_ID}.tail.css"
    OUT_FILE="$DIST_DIR/cpb-style-${STYLE_ID}.css"

    if [[ ! -f "$TOKENS_FILE" ]]; then
        echo "Missing tokens file for style '$STYLE_ID': $TOKENS_FILE" >&2
        exit 1
    fi
    if [[ ! -f "$TAIL_FILE" ]]; then
        echo "Missing tail file for style '$STYLE_ID': $TAIL_FILE" >&2
        exit 1
    fi

    cat "$TOKENS_FILE" \
            "$SRC_DIR/cpb-style-base.css" \
            "$TAIL_FILE" > "$OUT_FILE"
    STYLE_COUNT=$((STYLE_COUNT + 1))
done

node "$ROOT_DIR/scripts/build-cpb-style-css-data.js"

echo "Built $STYLE_COUNT style CSS file(s) and regenerated cpb-style-css-data.js from styles-src/."
