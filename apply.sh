#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-.}"

cp index.html "$TARGET_DIR/index.html"
cp style.css "$TARGET_DIR/style.css"
cp app.js "$TARGET_DIR/app.js"

echo "Applied used-car CRUD implementation to: $TARGET_DIR"
