#!/usr/bin/env python3
"""TandiTech LLM Engine v0.1 — localhost-only authenticated Ollama proxy.

Standard library only. Intended for trusted internal calls, NOT direct browser access.
Environment:
  TANDI_ENGINE_TOKEN (required; >=32 characters)
  TANDI_ENGINE_PORT (default 3211)
"""
import hmac
import json
import os
import threading
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

TOKEN = os.environ.get("TANDI_ENGINE_TOKEN", "")
PORT = int(os.environ.get("TANDI_ENGINE_PORT", "3211"))
MODEL = os.environ.get("TANDI_ENGINE_MODEL", "qwen2.5:0.5b")
MAX_BYTES = 16 * 1024
MAX_PROMPT = 4000
TIMEOUT = 120
SLOTS = threading.BoundedSemaphore(1)


class Handler(BaseHTTPRequestHandler):
    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            return self.send_json(200, {"status": "ok", "engine": "TandiTech LLM Engine", "version": "0.1"})
        self.send_json(404, {"error": "not_found"})

    def do_POST(self):
        if self.path != "/v1/generate":
            return self.send_json(404, {"error": "not_found"})
        supplied = self.headers.get("Authorization", "")
        if not hmac.compare_digest(supplied, "Bearer " + TOKEN):
            return self.send_json(401, {"error": "unauthorized"})
        try:
            size = int(self.headers.get("Content-Length", "-1"))
        except ValueError:
            return self.send_json(400, {"error": "invalid_content_length"})
        if size < 1 or size > MAX_BYTES:
            return self.send_json(413, {"error": "invalid_body_size"})
        try:
            payload = json.loads(self.rfile.read(size))
        except (ValueError, UnicodeDecodeError):
            return self.send_json(400, {"error": "invalid_json"})
        if not isinstance(payload, dict):
            return self.send_json(400, {"error": "invalid_payload"})
        prompt = payload.get("prompt")
        if not isinstance(prompt, str) or not prompt.strip() or len(prompt) > MAX_PROMPT:
            return self.send_json(400, {"error": "invalid_prompt"})
        if not SLOTS.acquire(blocking=False):
            return self.send_json(429, {"error": "busy"})
        try:
            request = urllib.request.Request(
                "http://127.0.0.1:11434/api/generate",
                data=json.dumps({"model": MODEL, "prompt": prompt, "stream": False,
                                 "options": {"num_predict": 256}, "keep_alive": "0s"}).encode("utf-8"),
                headers={"Content-Type": "application/json"}, method="POST")
            with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
                result = json.load(response)
            self.send_json(200, {"model": MODEL, "response": result.get("response", ""),
                                 "done": result.get("done", False)})
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            self.log_error("ollama upstream failure: %s", type(exc).__name__)
            self.send_json(502, {"error": "upstream_unavailable"})
        finally:
            SLOTS.release()

    def log_message(self, fmt, *args):
        # Avoid logging user prompts or bearer tokens.
        if self.path == "/health":
            return
        super().log_message(fmt, *args)


if __name__ == "__main__":
    if len(TOKEN) < 32:
        raise SystemExit("TANDI_ENGINE_TOKEN must be set to at least 32 characters")
    if not 1024 <= PORT <= 65535:
        raise SystemExit("Invalid TANDI_ENGINE_PORT")
    print(f"TandiTech LLM Engine listening on 127.0.0.1:{PORT}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
