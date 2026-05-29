#!/usr/bin/env python3
"""
Update existing Strapi blog-posts in place using the markdown drafts.
PUTs to /api/blog-posts/{documentId}?status=published.

Usage: python3 scripts/update-blog-posts.py [slug1 slug2 ...]
       (no args = update all 4)
"""

import sys
import json
import time
from pathlib import Path
from urllib import request, error

# imports from sibling seeder
sys.path.insert(0, str(Path(__file__).resolve().parent))
from importlib import import_module
seeder = import_module("seed-blog-posts")

STRAPI_URL = "https://natural-dinosaurs-5b6cbd810f.strapiapp.com"

# slug → documentId mapping (from seeding output)
SLUG_TO_DOC = {
    "top-cuban-artists-europe-2026": "x5q7ycfsiejop0vb95jaqgyw",
    "mejores-artistas-reggaeton-cubano-europa-2026": "bo3nxn244o3fxo2vnn84cmay",
    "como-contratar-artista-cubano-europa-guia-completa": "n4tq787feqp1ujiedbx4cb0x",
    "salsa-timba-cubana-europa-manolin-medico-salsa": "x3f2p50hgmn2gpuzil3wy333",
}


def put_to_strapi(token: str, document_id: str, payload: dict) -> dict:
    body = {"data": payload}
    url = f"{STRAPI_URL}/api/blog-posts/{document_id}?status=published"
    req = request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        method="PUT",
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
        raise SystemExit(f"HTTP {e.code} updating {document_id}: {msg}")


def main():
    only_slugs = set(sys.argv[1:])
    token = seeder.load_token()

    files = sorted(seeder.DRAFTS_DIR.glob("*.md"))
    print(f"Found {len(files)} draft(s). only_slugs={only_slugs or 'ALL'}\n")

    updated = 0
    for f in files:
        post = seeder.parse_draft(f)
        slug = post["slug"]
        if only_slugs and slug not in only_slugs:
            continue
        doc_id = SLUG_TO_DOC.get(slug)
        if not doc_id:
            print(f"  ! no documentId for slug={slug}, skipping")
            continue
        payload = {k: post[k] for k in seeder.FIELD_KEYS}
        payload["slug"] = slug
        payload["author"] = post["author"]
        payload["readingTime"] = post["readingTime"]
        if post.get("coverImageId"):
            payload["coverImage"] = post["coverImageId"]

        print(f"-> {f.name}  slug={slug}  documentId={doc_id}")
        result = put_to_strapi(token, doc_id, payload)
        published_at = result.get("data", {}).get("publishedAt")
        print(f"   ✓ updated  publishedAt={published_at}")
        updated += 1
        time.sleep(0.4)

    print(f"\nDone. {updated} post(s) updated.")


if __name__ == "__main__":
    main()
