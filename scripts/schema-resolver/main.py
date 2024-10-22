import json
import requests
from pathlib import Path


def resolve_schema_refs(src: Path, dst: Path):
    with src.open() as f:
        schema = json.load(f)

    refs = {}
    for branch in schema["allOf"]:
        refs[branch["$ref"]] = {}

    for ref in refs:
        response = requests.get(ref)
        refs[ref] = response.json()

    schema["allOf"] = list(refs.values())

    with dst.open("w") as f:
        json.dump(schema, f, indent=2)


def main():
    src = Path("../../src/schemas/record-src.json")
    dst = Path("../../src/schemas/record.json")
    print(f"resolving: {src.resolve()} to: {dst.resolve()}")
    resolve_schema_refs(src, dst)


if __name__ == "__main__":
    main()
