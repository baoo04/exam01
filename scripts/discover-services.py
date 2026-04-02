#!/usr/bin/env python3
"""
List all Django microservice directories under services/ and verify they appear in
spring-gateway MicroserviceRegistry (static check via shared naming convention).

Run from repo root: python scripts/discover-services.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SERVICES_DIR = ROOT / "services"
REGISTRY = ROOT / "spring-gateway" / "src" / "main" / "java" / "com" / "ecommerce" / "gateway" / "MicroserviceRegistry.java"


def main() -> int:
    if not SERVICES_DIR.is_dir():
        print("services/ not found", file=sys.stderr)
        return 1

    dirs = sorted(
        p.name
        for p in SERVICES_DIR.iterdir()
        if p.is_dir() and p.name.endswith("_service")
    )
    print("Detected microservice modules (docker-compose build contexts):")
    for name in dirs:
        print(f"  - {name}")

    if REGISTRY.is_file():
        text = REGISTRY.read_text(encoding="utf-8")
        missing = []
        for d in dirs:
            if d not in text:
                missing.append(d)
        if missing:
            print("\nWARNING: not referenced in MicroserviceRegistry.java:", ", ".join(missing))
            return 2
        print("\nAll listed modules match MicroserviceRegistry.UPSTREAMS.")
    else:
        print("\n(MicroserviceRegistry.java not found; skipping registry check.)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
