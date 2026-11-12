#!/usr/bin/env bash
# Bump the app version so installed copies update.
#   tools/bump-version.sh          -> 1.1.0 becomes 1.1.1
#   tools/bump-version.sh minor    -> 1.1.0 becomes 1.2.0
#   tools/bump-version.sh 2.0.0    -> set it explicitly
set -euo pipefail
cd "$(dirname "$0")/.."
cur=$(sed -n 's/^const APP_VERSION = "\(.*\)";/\1/p' index.html)
IFS=. read -r ma mi pa <<<"$cur"
case "${1:-patch}" in
  major) new="$((ma+1)).0.0" ;;
  minor) new="$ma.$((mi+1)).0" ;;
  patch) new="$ma.$mi.$((pa+1))" ;;
  *)     new="$1" ;;
esac
sed -i.bak -e "s/^const APP_VERSION = \".*\";/const APP_VERSION = \"$new\";/" \
           -e "s/<meta name=\"app-version\" content=\"[^\"]*\">/<meta name=\"app-version\" content=\"$new\">/" index.html
rm -f index.html.bak
echo "$cur -> $new"
