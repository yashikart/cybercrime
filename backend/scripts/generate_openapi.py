"""
Generate frozen OpenAPI specification.
"""

import json
from pathlib import Path

try:
    import yaml
except Exception:  # pragma: no cover - fallback when PyYAML isn't available
    yaml = None

from main import app


def main() -> None:
    spec = app.openapi()
    normalized = json.loads(json.dumps(spec, sort_keys=True))
    target_path = Path(__file__).resolve().parents[2] / "openapi.yaml"
    if yaml:
        content = yaml.safe_dump(normalized, sort_keys=False, allow_unicode=False)
    else:
        content = json.dumps(normalized, indent=2, sort_keys=True)

    target_path.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    main()
