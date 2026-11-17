#!/usr/bin/env python3
"""NEO Arena v0.1 — offline, deterministic answer evaluation.

Usage:
  python3 tools/neo_arena.py --dataset datasets/neo-arena-v0.1.jsonl --answers answers.jsonl --output report.json

Answers JSONL schema: {"id":"pt-001","answer":"..."}
This is a lexical baseline, NOT a reliable measure of model intelligence.
"""
import argparse
import json
import pathlib
import re
import sys
import unicodedata
from datetime import datetime, timezone


def normalize(value):
    value = unicodedata.normalize("NFKD", str(value).casefold())
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", value)).strip()


def read_jsonl(path):
    entries = {}
    with open(path, encoding="utf-8") as stream:
        for line_number, line in enumerate(stream, 1):
            if not line.strip():
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{path}:{line_number}: invalid JSON: {exc}") from exc
            key = obj.get("id")
            if not isinstance(key, str) or not key:
                raise ValueError(f"{path}:{line_number}: missing id")
            if key in entries:
                raise ValueError(f"{path}:{line_number}: duplicate id {key}")
            entries[key] = obj
    return entries


def evaluate(case, answer):
    normalized = normalize(answer)
    expected = [normalize(x) for x in case["accepted_answers"]]
    if not normalized:
        return 0.0
    # Exact normalized matching avoids rewarding answers that contradict themselves.
    return 1.0 if normalized in expected else 0.0


def main():
    parser = argparse.ArgumentParser(description="TandiTech NEO Arena offline baseline")
    parser.add_argument("--dataset", default="datasets/neo-arena-v0.1.jsonl")
    parser.add_argument("--answers", required=True)
    parser.add_argument("--output", default="neo-arena-report.json")
    args = parser.parse_args()

    cases = read_jsonl(args.dataset)
    answers = read_jsonl(args.answers)
    unknown = sorted(set(answers) - set(cases))
    if unknown:
        raise ValueError(f"Unknown answer ids: {', '.join(unknown)}")
    results = []
    for key, case in cases.items():
        if not isinstance(case.get("accepted_answers"), list) or not case["accepted_answers"]:
            raise ValueError(f"Dataset case {key}: accepted_answers must be nonempty list")
        answer = answers.get(key, {}).get("answer", "")
        if not isinstance(answer, str):
            raise ValueError(f"Answer {key}: answer must be a string")
        score = evaluate(case, answer)
        results.append({"id": key, "category": case.get("category", "other"),
                        "score": score, "answered": bool(answer.strip())})
    total = len(results)
    report = {
        "schema_version": "0.1",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "dataset": args.dataset,
        "answers": args.answers,
        "scoring": "normalized_exact_match",
        "total": total,
        "answered": sum(r["answered"] for r in results),
        "correct": sum(r["score"] for r in results),
        "accuracy": round(sum(r["score"] for r in results) / total, 4) if total else 0,
        "results": results,
        "limitations": "Exact-match benchmark; does not evaluate semantics, safety, hallucinations or reasoning quality.",
    }
    output = pathlib.Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"NEO Arena: {report['correct']}/{total} correct ({report['accuracy']:.1%}); report: {output}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print(f"NEO Arena error: {exc}", file=sys.stderr)
        sys.exit(1)
