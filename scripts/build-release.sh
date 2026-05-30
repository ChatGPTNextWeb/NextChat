#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RELEASE_DIR="$ROOT/release"
EXE_NAME="ActorAIchat.exe"
BINARY_NAME="ActorAIchat"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[RELEASE]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err()  { echo -e "${RED}[ERROR]${NC} $*"; }

check_prereqs() {
  log "Checking prerequisites..."

  if ! command -v node &>/dev/null; then
    err "Node.js is required. Install from https://nodejs.org/"
    exit 1
  fi
  log "  Node.js: $(node --version)"

  if ! command -v yarn &>/dev/null; then
    err "yarn is required. Run: corepack enable"
    exit 1
  fi
  log "  yarn: $(yarn --version)"

  local has_rust=true
  if ! command -v cargo &>/dev/null || ! command -v rustc &>/dev/null; then
    has_rust=false
    warn "Rust not found — skipping Tauri exe build."
    warn "Install Rust to generate the .exe:"
    warn "  winget:  winget install Rustlang.Rustup"
    warn "  scoop:   scoop install rustup"
    warn "  manual:  https://rustup.rs/"
    echo ""
  else
    log "  rustc: $(rustc --version)"
    log "  cargo: $(cargo --version)"
  fi
  HAS_RUST="$has_rust"
}

build_frontend() {
  log "Building frontend static export -> out/ ..."
  cd "$ROOT"
  yarn export

  if [ ! -d "$ROOT/out" ]; then
    err "Frontend build failed — out/ not created."
    exit 1
  fi
  log "Frontend static export ready ($(du -sh "$ROOT/out" | cut -f1))."
}

# Locate a standalone MinGW (WinLibs) GCC bin dir installed via winget, so the
# GNU build can find x86_64-w64-mingw32-gcc as the linker. Override by exporting
# MINGW_BIN before running this script.
detect_mingw() {
  if [ -n "${MINGW_BIN:-}" ] && [ -x "$MINGW_BIN/x86_64-w64-mingw32-gcc.exe" ]; then
    return
  fi
  local found
  found="$(find "$HOME/AppData/Local/Microsoft/WinGet/Packages" \
            -iname "x86_64-w64-mingw32-gcc.exe" 2>/dev/null | head -1)"
  if [ -n "$found" ]; then
    MINGW_BIN="$(dirname "$found")"
  fi
}

build_tauri() {
  log "Building Tauri desktop app (compiles Rust -> exe)..."
  cd "$ROOT"

  # This machine has no MSVC toolchain, so build with the GNU host toolchain
  # (both the app and its build scripts link via MinGW gcc). RUSTUP_TOOLCHAIN is
  # used instead of `rustup override` to avoid rustup's slow self-update check.
  detect_mingw
  if [ -z "${MINGW_BIN:-}" ]; then
    err "MinGW gcc not found. Install with:"
    err "  winget install -e --id BrechtSanders.WinLibs.POSIX.MSVCRT"
    exit 1
  fi
  log "  MinGW: $MINGW_BIN"

  export PATH="$HOME/.cargo/bin:$MINGW_BIN:$PATH"
  export RUSTUP_TOOLCHAIN="stable-x86_64-pc-windows-gnu"
  export RUSTUP_DISABLE_SELF_UPDATE=1

  npx tauri build
  log "Tauri build complete."
}

copy_release() {
  mkdir -p "$RELEASE_DIR"
  # GNU host build => binary lives under target/release (no target triple subdir).
  local src="$ROOT/src-tauri/target/release/${BINARY_NAME}.exe"
  local dll="$ROOT/src-tauri/target/release/WebView2Loader.dll"

  if [ ! -f "$src" ]; then
    err "Tauri binary not found: $src"
    exit 1
  fi

  cp "$src" "$RELEASE_DIR/${EXE_NAME}"
  log "Exe copied to $RELEASE_DIR/${EXE_NAME} ($(du -h "$RELEASE_DIR/${EXE_NAME}" | cut -f1))"

  # WebView2Loader.dll is the only runtime companion (cannot be statically linked
  # under MinGW); ship it next to the exe.
  if [ -f "$dll" ]; then
    cp "$dll" "$RELEASE_DIR/WebView2Loader.dll"
    log "WebView2Loader.dll copied ($(du -h "$RELEASE_DIR/WebView2Loader.dll" | cut -f1))"
  else
    warn "WebView2Loader.dll not found next to binary — exe may not launch without it."
  fi
}

main() {
  echo ""
  log "============================================"
  log "  ActorAIchat Release Build"
  log "============================================"
  echo ""

  log "Updating git submodules..."
  git submodule update --init --recursive
  log "Submodules up to date."

  check_prereqs
  build_frontend

  if [ "${HAS_RUST:-false}" = "true" ]; then
    build_tauri
    copy_release
    echo ""
    log "Release build complete: $RELEASE_DIR/$EXE_NAME"
  else
    log "Frontend export complete (out/)."
    log ""
    log "To produce the .exe, install Rust then re-run:"
    log "  1. Install Rust:  winget install Rustlang.Rustup"
    log "  2. Re-run:        bash scripts/build-release.sh"
    log ""
    log "Or use the standalone server directly:"
    log "  cd dist && node server.js"
  fi
}

main "$@"
