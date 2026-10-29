"""Portfolio API.

The page content lives in the frontend constants file. This service runs the
live parts: a health/status feed the frontend renders as a status board, the
résumé download, and a contact endpoint that queues messages.
"""

from __future__ import annotations

import json
import os
import re
import secrets
import threading
import time
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, field_validator

BASE_DIR = Path(__file__).resolve().parent.parent
MESSAGES_FILE = BASE_DIR / "data" / "messages.jsonl"
RESUME_FILE = BASE_DIR / "static" / "Ayush_Kumar_DevOps_Engineer_Resume.pdf"

STARTED_AT = time.time()
VERSION = os.getenv("APP_VERSION", "1.0.0")
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",") if o.strip()]

app = FastAPI(title="Ayush Kumar · Portfolio API", version=VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# ---------- metrics ----------

class Metrics:
    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.requests = 0
        self.errors = 0
        self.latencies: deque[float] = deque(maxlen=200)

    def record(self, ms: float, status: int) -> None:
        with self.lock:
            self.requests += 1
            if status >= 500:
                self.errors += 1
            self.latencies.append(ms)

    def snapshot(self) -> dict:
        with self.lock:
            lat = sorted(self.latencies)
            p50 = lat[len(lat) // 2] if lat else 0.0
            p95 = lat[int(len(lat) * 0.95) - 1] if len(lat) >= 20 else (lat[-1] if lat else 0.0)
            return {
                "requests_total": self.requests,
                "errors_total": self.errors,
                "latency_p50_ms": round(p50, 2),
                "latency_p95_ms": round(p95, 2),
            }


metrics = Metrics()


@app.middleware("http")
async def track(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    ms = (time.perf_counter() - start) * 1000
    metrics.record(ms, response.status_code)
    response.headers["X-Response-Time"] = f"{ms:.2f}ms"
    return response


# ---------- routes ----------

@app.get("/api/health")
def health() -> dict:
    checks = {
        "inbox": MESSAGES_FILE.parent.is_dir(),
        "resume": RESUME_FILE.is_file(),
    }
    return {
        "status": "ok" if all(checks.values()) else "degraded",
        "checks": checks,
        "uptime_s": round(time.time() - STARTED_AT),
        "version": VERSION,
    }


@app.get("/api/status")
def status() -> dict:
    return {
        "status": "operational",
        "version": VERSION,
        "uptime_s": round(time.time() - STARTED_AT),
        "server_time": datetime.now(timezone.utc).isoformat(),
        **metrics.snapshot(),
    }


@app.get("/api/resume")
def resume() -> FileResponse:
    if not RESUME_FILE.is_file():
        raise HTTPException(404, "résumé not found")
    return FileResponse(RESUME_FILE, media_type="application/pdf", filename=RESUME_FILE.name)


# ---------- contact ----------

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
RATE_WINDOW_S = 600
RATE_MAX = 3
_rate: dict[str, deque[float]] = defaultdict(deque)
_write_lock = threading.Lock()


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(max_length=200)
    message: str = Field(min_length=10, max_length=4000)
    company: str = Field(default="", max_length=200)  # honeypot: humans never see this field

    @field_validator("name", "message")
    @classmethod
    def strip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("must not be empty")
        return v

    @field_validator("email")
    @classmethod
    def valid_email(cls, v: str) -> str:
        v = v.strip()
        if not EMAIL_RE.match(v):
            raise ValueError("not a valid email address")
        return v


@app.post("/api/contact", status_code=201)
def contact(body: ContactIn, request: Request) -> dict:
    ticket = f"MSG-{secrets.token_hex(3).upper()}"
    if body.company:
        return {"ticket": ticket, "status": "queued"}  # silently drop bots

    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "?").split(",")[0].strip()
    now = time.time()
    hits = _rate[ip]
    while hits and now - hits[0] > RATE_WINDOW_S:
        hits.popleft()
    if len(hits) >= RATE_MAX:
        raise HTTPException(429, "rate limit: try again in a few minutes")
    hits.append(now)

    record = {
        "ticket": ticket,
        "received_at": datetime.now(timezone.utc).isoformat(),
        "name": body.name,
        "email": body.email,
        "message": body.message,
    }
    with _write_lock, MESSAGES_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    return {"ticket": ticket, "status": "queued"}
