#!/usr/bin/env python3
"""Original TandiTech web app. No NextChat runtime. Python standard library only.
Private preview on 127.0.0.1:3220. HTTP Basic Auth is mandatory; serve through HTTPS.
"""
import base64
import hmac
import json
import os
import threading
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PORT = int(os.environ.get("TANDI_WEB_PORT", "3220"))
PASSWORD = os.environ.get("TANDI_WEB_PASSWORD", "")
TOKEN = os.environ.get("TANDI_ENGINE_TOKEN", "")
ROOT = Path(__file__).resolve().parent
BUSY = threading.BoundedSemaphore(1)
LAST = {}
LOCK = threading.Lock()

class Handler(BaseHTTPRequestHandler):
    def reply(self, status, body, mime="application/json; charset=utf-8", extra=None):
        if isinstance(body, (dict, list)):
            body = json.dumps(body, ensure_ascii=False).encode("utf-8")
        elif isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Content-Security-Policy", "default-src 'none'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'self'")
        for k,v in (extra or {}).items(): self.send_header(k,v)
        self.end_headers()
        self.wfile.write(body)
    def auth(self):
        value = self.headers.get("Authorization", "")
        expected = "Basic " + base64.b64encode(("tandi:"+PASSWORD).encode()).decode()
        if not hmac.compare_digest(value, expected):
            self.reply(401, {"error":"authentication_required"}, extra={"WWW-Authenticate":'Basic realm="TandiTech Preview", charset="UTF-8"'})
            return False
        return True
    def do_GET(self):
        if self.path == "/health":
            return self.reply(200, {"status":"ok","app":"TandiTech Original Web"})
        if not self.auth(): return
        files = {"/":("index.html","text/html; charset=utf-8"),"/app.js":("app.js","text/javascript; charset=utf-8"),"/app.css":("app.css","text/css; charset=utf-8")}
        if self.path not in files: return self.reply(404, {"error":"not_found"})
        filename, mime = files[self.path]
        return self.reply(200, (ROOT/filename).read_bytes(), mime)
    def do_POST(self):
        if not self.auth(): return
        if self.path != "/api/chat": return self.reply(404, {"error":"not_found"})
        # Reject cross-origin browser posts; Basic Auth alone does not prevent CSRF.
        origin = self.headers.get("Origin")
        host = self.headers.get("Host", "")
        if origin and origin not in ("https://"+host, "http://"+host):
            return self.reply(403, {"error":"invalid_origin"})
        if self.headers.get("Content-Type", "").split(";")[0].strip().lower() != "application/json":
            return self.reply(415, {"error":"json_required"})
        try:
            size = int(self.headers.get("Content-Length","-1"))
            if not 1 <= size <= 12000: return self.reply(413, {"error":"invalid_size"})
            obj = json.loads(self.rfile.read(size))
            prompt = obj.get("prompt")
            if not isinstance(prompt,str) or not 1 <= len(prompt.strip()) <= 4000:
                return self.reply(400, {"error":"invalid_prompt"})
        except (ValueError,AttributeError,TypeError):
            return self.reply(400, {"error":"invalid_json"})
        ip = self.client_address[0]
        with LOCK:
            now = time.monotonic()
            if now - LAST.get(ip,0) < 3:
                return self.reply(429, {"error":"wait_before_retry"})
            LAST[ip] = now
            if len(LAST) > 1000:
                LAST.clear()
                LAST[ip] = now
        if not BUSY.acquire(blocking=False):
            return self.reply(429, {"error":"engine_busy"})
        try:
            request = urllib.request.Request("http://127.0.0.1:3211/v1/generate",
                data=json.dumps({"prompt":prompt}).encode(),
                headers={"Content-Type":"application/json","Authorization":"Bearer "+TOKEN},
                method="POST")
            with urllib.request.urlopen(request,timeout=125) as resp:
                data=json.load(resp)
            self.reply(200, {"response":data.get("response",""),"model":data.get("model","")})
        except (urllib.error.URLError,TimeoutError,ValueError):
            self.reply(502, {"error":"engine_unavailable"})
        finally:
            BUSY.release()
    def log_message(self, fmt, *args):
        # No prompt or credential logging
        if self.path != "/api/chat": super().log_message(fmt,*args)

if __name__ == "__main__":
    if len(PASSWORD) < 16 or len(TOKEN) < 32:
        raise SystemExit("Set TANDI_WEB_PASSWORD (>=16 chars) and TANDI_ENGINE_TOKEN (>=32 chars)")
    print(f"TandiTech original web listening on 127.0.0.1:{PORT}",flush=True)
    ThreadingHTTPServer(("127.0.0.1",PORT),Handler).serve_forever()
