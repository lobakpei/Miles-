#!/usr/bin/env python3
"""Strict-enough HTML structure check using lxml's parser error log."""

from pathlib import Path
import sys

try:
    from lxml import etree
except ImportError:
    print("SKIP: lxml is not installed", file=sys.stderr)
    raise SystemExit(2)


file = Path(sys.argv[1] if len(sys.argv) > 1 else "index.html")
parser = etree.HTMLParser(recover=True)
etree.parse(str(file), parser)
errors = [entry for entry in parser.error_log if entry.level_name in {"ERROR", "FATAL"}]

for error in errors:
    print(error, file=sys.stderr)

raise SystemExit(1 if errors else 0)
