#!/usr/bin/env python3
"""
Seed Strapi blog-posts from markdown drafts in docs/blog-drafts/.

Each draft file contains one post in 4 languages, structured as:
  **Slug:** `the-slug`
  **Author:** Cubita Producciones
  **Reading Time:** 8
  ---
  ## 🇪🇸 Español
  ### Título (titleEs)
  ...
  ### Extracto (excerptEs)
  ...
  ### Contenido (contentEs)
  ...
  (repeat for En / Fr / It)

Usage: python3 scripts/seed-blog-posts.py [--publish] [--dry-run]
"""

import os
import re
import sys
import json
import time
from pathlib import Path
from urllib import request, error

STRAPI_URL = "https://natural-dinosaurs-5b6cbd810f.strapiapp.com"
DRAFTS_DIR = Path(__file__).resolve().parent.parent / "docs" / "blog-drafts"

FIELD_KEYS = [
    "titleEs", "titleEn", "titleFr", "titleIt",
    "excerptEs", "excerptEn", "excerptFr", "excerptIt",
    "contentEs", "contentEn", "contentFr", "contentIt",
]


def load_token() -> str:
    env_path = Path(__file__).resolve().parent.parent / ".env.local"
    for line in env_path.read_text().splitlines():
        if line.startswith("STRAPI_ADMIN_TOKEN="):
            return line.split("=", 1)[1].strip()
    raise SystemExit("STRAPI_ADMIN_TOKEN not found in .env.local")


def parse_draft(path: Path) -> dict:
    text = path.read_text()
    out = {"_file": path.name}

    m = re.search(r"\*\*Slug:\*\*\s*`([^`]+)`", text)
    if not m:
        raise ValueError(f"{path.name}: missing Slug")
    out["slug"] = m.group(1).strip()

    m = re.search(r"\*\*Author:\*\*\s*(.+)", text)
    out["author"] = m.group(1).strip() if m else "Cubita Producciones"

    m = re.search(r"\*\*Reading Time:\*\*\s*(\d+)", text)
    out["readingTime"] = int(m.group(1)) if m else 5

    # Optional cover image media ID (Strapi media library id, integer).
    m = re.search(r"\*\*Cover Image ID:\*\*\s*(\d+)", text)
    out["coverImageId"] = int(m.group(1)) if m else None

    # Each ### heading line: ### Some Label (fieldName)\nBODY...
    # Body ends at the next ### field heading, a --- separator, or EOF.
    # NOTE: don't stop at \n## headings — those are markdown subsections
    # inside the body content (e.g. "## 1. Manolín").
    pattern = re.compile(
        r"###\s+[^\n(]+\((?P<field>title(?:Es|En|Fr|It)|excerpt(?:Es|En|Fr|It)|content(?:Es|En|Fr|It))\)\s*\n"
        r"(?P<body>.+?)"
        r"(?=\n###\s|\n---\s*\n|\Z)",
        re.DOTALL,
    )
    for m in pattern.finditer(text):
        field = m.group("field")
        body = m.group("body").strip()
        out[field] = body

    missing = [k for k in FIELD_KEYS if k not in out or not out[k]]
    if missing:
        raise ValueError(f"{path.name}: missing fields {missing}")

    return out


def post_to_strapi(token: str, payload: dict, publish: bool, dry_run: bool) -> dict:
    body = {"data": payload}
    qs = "?status=published" if publish else ""
    url = f"{STRAPI_URL}/api/blog-posts{qs}"

    if dry_run:
        print(f"  DRY RUN: would POST {url}")
        print(f"  data keys: {sorted(body['data'].keys())}")
        return {"_dry": True}

    req = request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
    )
    try:
        with request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as e:
        msg = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"HTTP {e.code} from Strapi: {msg}")


def list_existing_slugs(token: str) -> set[str]:
    url = f"{STRAPI_URL}/api/blog-posts?pagination%5BpageSize%5D=100&fields%5B0%5D=slug"
    req = request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return {item.get("slug") for item in data.get("data", []) if item.get("slug")}


def main():
    publish = "--publish" in sys.argv
    dry_run = "--dry-run" in sys.argv
    token = load_token()

    files = sorted(DRAFTS_DIR.glob("*.md"))
    if not files:
        print(f"No .md files found in {DRAFTS_DIR}")
        return

    existing = set() if dry_run else list_existing_slugs(token)
    print(f"Found {len(files)} draft(s). {len(existing)} already in Strapi. publish={publish} dry_run={dry_run}\n")

    created = 0
    for f in files:
        post = parse_draft(f)
        slug = post["slug"]
        if slug in existing:
            print(f"-> {f.name}  slug={slug}  (already exists, skipping)")
            continue
        print(f"-> {f.name}  slug={slug}")
        payload = {k: post[k] for k in FIELD_KEYS}
        payload["slug"] = slug
        payload["author"] = post["author"]
        payload["readingTime"] = post["readingTime"]
        if post.get("coverImageId"):
            payload["coverImage"] = post["coverImageId"]

        try:
            result = post_to_strapi(token, payload, publish, dry_run)
            if not dry_run:
                doc_id = result.get("data", {}).get("documentId")
                title = result.get("data", {}).get("titleEs", "")
                print(f"   ✓ created  documentId={doc_id}  titleEs={title!r}")
                created += 1
                time.sleep(0.4)  # gentle rate-limit
        except SystemExit as e:
            print(f"   ✗ FAILED: {e}")
            raise

    print(f"\nDone. {created} post(s) created. publish={publish}")


if __name__ == "__main__":
    main()
