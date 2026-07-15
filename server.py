#!/usr/bin/env python3
"""Local dev server: static files + Hunyuan API proxy (bypasses CORS)."""
import http.server
import urllib.request
import urllib.error
import json
import ssl
import sys

PORT = 8080
HUNYUAN_BASE = "https://api.hunyuan.cloud.tencent.com"


class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path.startswith("/api/hunyuan/"):
            self._proxy()
        else:
            super().do_POST()

    def do_OPTIONS(self):
        """Handle CORS preflight for the proxy endpoint."""
        self.send_response(200)
        self._send_cors()
        self.end_headers()

    def _proxy(self):
        target = HUNYUAN_BASE + self.path[len("/api/hunyuan"):]
        body = None
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > 0:
            body = self.rfile.read(content_length)

        req = urllib.request.Request(target, data=body, method="POST")
        # Forward relevant headers
        for h in ("Authorization", "Content-Type"):
            v = self.headers.get(h)
            if v:
                req.add_header(h, v)

        try:
            ctx = ssl.create_default_context()
            resp = urllib.request.urlopen(req, context=ctx, timeout=60)
            self.send_response(resp.status)
            self._send_cors()
            self.send_header("Content-Type", resp.headers.get("Content-Type", "application/json"))
            self.end_headers()
            self.wfile.write(resp.read())
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self._send_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(e.read())

    def _send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")

    def log_message(self, fmt, *args):
        if "/api/" in str(args):
            print(f"[proxy] {args[0]}")
        else:
            super().log_message(fmt, *args)


if __name__ == "__main__":
    print(f"Producer Copy Workbench → http://localhost:{PORT}")
    print(f"API proxy: /api/hunyuan/* → {HUNYUAN_BASE}/*")
    http.server.test(HandlerClass=ProxyHandler, port=PORT)
