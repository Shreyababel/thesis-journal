#!/bin/bash
# Preview the thesis journal locally.
# Sends no-cache headers so a plain refresh always picks up new entries.
cd "$(dirname "$0")"
echo "Open http://localhost:8934/index.html in your browser"
python3 -c '
import http.server
class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
http.server.ThreadingHTTPServer(("", 8934), NoCache).serve_forever()
'
