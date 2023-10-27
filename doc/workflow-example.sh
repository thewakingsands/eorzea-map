#!/bin/zsh
set -eo pipefail

BASE_DIR="/srv/ffxiv"
ICON_DIR="/srv/ffxiv/icons"
GAME_DIR="/srv/ffxiv/ffxivgame"
WORK_DIR="/srv/ffxiv/bin"
EXTRACTOR_PATH="/srv/ffxiv/bin/EorzeaMapExtractor.Cli.exe"
MAP_DIR="/srv/ffxiv/eorzea-map"

gameVer=$(cat $BASE_DIR/saintcoinach/Definitions/game.ver)
ICON_DIR="$BASE_DIR/saintcoinach/$gameVer/ui/icon"

function node() {
   NODE_VERSION=16 ~/.nvm/nvm-exec node "$@"
}

function yarn() {
   NODE_VERSION=16 ~/.nvm/nvm-exec yarn "$@"
}

function dumpFromGame() {
  pushd "$WORK_DIR"

  echo "[-] Getting csv files ..."
  mono "$EXTRACTOR_PATH" "$GAME_DIR" csv "$MAP_DIR/generated"

  echo "[-] Dumping maps ..."
  mono "$EXTRACTOR_PATH" "$GAME_DIR" map "$MAP_DIR/generated/webroot/maps"

  popd
}

function copyIcons() {
  rsync -avP "$ICON_DIR/060000/" "$MAP_DIR/generated/webroot/icons/"
  rsync -avP "$ICON_DIR/063000/" "$MAP_DIR/generated/webroot/minimap/"
}

function genTiles() {
  pushd "$MAP_DIR"

  echo "[-] Generating tiles ..."
  mkdir -p "$MAP_DIR/generated/webroot/files"
  node "$MAP_DIR/bin/gentile.js"

  popd
}

function updateMeta() {
  pushd "$MAP_DIR"

  echo "[-] Generate map data ..."
  mkdir -p "$MAP_DIR/generated/webroot/data"
  node "$MAP_DIR/bin/convertcsv.js"
  node "$MAP_DIR/bin/genmap.js"
  node "$MAP_DIR/huiji/upload.js" data

  popd
}

function updateCode() {
  pushd "$MAP_DIR"

  echo "[-] Build fresh frontend ..."
  yarn build
  echo "[-] Upload code to Huiji"
  yarn huiji

  popd
}

function uploadTiles() {
  pushd "$MAP_DIR"

  echo "[-] Upload tiles to Huiji"
  node "$MAP_DIR/huiji/upload.js" tile update

  popd
}

dumpFromGame
genTiles
updateMeta
updateCode

# huiji
copyIcons
uploadTiles
