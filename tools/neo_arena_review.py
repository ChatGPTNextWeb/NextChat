#!/usr/bin/env python3
"""NEO Arena v0.2: human-reviewed benchmark, no automatic semantic claims.

Review JSONL: {"id":"pt-001","verdict":"correct","note":"..."}
Verdicts: correct, incorrect, uncertain. Each response must be reviewed by a human.
"""
import argparse
import json
from collections import Counter
from pathlib import Path


def load(path):
    items = {}
    with open(path, encoding="utf-8") as stream:
        for line_no, line in enumerate(stream, 1):
            if not line.strip():
                continue
            item = json.loads(line)
            key = item["id"]
            if key in items:
                raise ValueError(f"Duplicate id {key} in {path}:{line_no}")
            items[key] = item
    return items


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", default="datasets/neo-arena-v0.1.jsonl")
    parser.add_argument("--answers", required=True)
    parser.add_argument("--review", required=True)
    parser.add_argument("--output", default="neo-arena-reviewed.json")
    args = parser.parse_args()
    cases = load(args.dataset)
    answers = load(args.answers)
    reviews = load(args.review)
    if set(reviews) != set(cases):
        raise ValueError("Review must contain exactly the dataset IDs")
    if set(answers) != set(cases):
        raise ValueError("Answers must contain exactly the dataset IDs")
    rows = []
    for key, case in cases.items():
        verdict = reviews[key].get("verdict")
        if verdict not in ("correct", "incorrect", "uncertain"):
            raise ValueError(f"Invalid verdict for {key}")
        rows.append({
            "id": key,
            "category": case.get("category"),
            "prompt": case["prompt"],
            "answer": answers[key]["answer"],
            "verdict": verdict,
            "note": reviews[key].get("note", ""),
        })
    counts = Counter(row["verdict"] for row in rows)
    total = len(rows)
    report = {
        "schema_version": "0.2",
        "scoring": "human_review",
        "total": total,
        "correct": counts["correct"],
        "incorrect": counts["incorrect"],
        "uncertain": counts["uncertain"],
        "accuracy": round(counts["correct"] / total, 4) if total else None,
        "results": rows,
        "limitations": "Human judgments may be subjective. Tiny dataset, no blinded review or statistical confidence.",
    }
    target = Path(args.output)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"NEO Arena reviewed: {counts['correct']}/{total} correct; {counts['uncertain']} uncertain")


if __name__ == "__main__":
    main()
