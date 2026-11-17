#!/usr/bin/env python3
"""NEO Arena v0.4: conservative automatic scoring and manual-review queue.

Never treats a substring as semantic proof. Existing v0.3 outputs remain valid.
"""
import argparse
import json
import pathlib
import re
import unicodedata
from collections import defaultdict
from datetime import datetime, timezone

def norm(value):
    s = unicodedata.normalize("NFKD", str(value).casefold())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", s)).strip()

def load(path):
    result = {}
    with open(path, encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            if not line.strip():
                continue
            item = json.loads(line)
            key = item["id"]
            if key in result:
                raise ValueError(f"Duplicate ID {key} in {path}:{i}")
            result[key] = item
    return result

def score(case, answer):
    expected = [norm(a) for a in case["accepted_answers"]]
    actual = norm(answer)
    if not actual:
        return "incorrect", "empty"
    if actual in expected:
        return "correct", "exact_normalized"
    if case["category"] == "arithmetic":
        # Only a standalone number or an explicit calculation ending in its result.
        raw = answer.strip()
        m = re.fullmatch(r"(?s)\s*(?:[0-9]+\s*(?:\+|\*|x|×|vezes)\s*[0-9]+\s*(?:=|é)\s*)?(-?[0-9]+)\s*[.!]?\s*", raw, re.I)
        if m:
            return ("correct" if norm(m.group(1)) in expected else "incorrect"), "parsed_arithmetic"
        return "review", "arithmetic_explanation"
    if case["category"] == "logic":
        # Explicitly numbered answers only; explanatory answers require human review.
        m = re.fullmatch(r"\s*(-?[0-9]+)\s*[.!]?\s*", answer)
        if m:
            return ("correct" if norm(m.group(1)) in expected else "incorrect"), "numeric_answer"
        return "review", "logic_explanation"
    # Do not approve natural language by substring matching: contradictions exist.
    return "review", "semantic_review_required"

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--dataset", default="datasets/neo-arena-v0.4.jsonl")
    p.add_argument("--answers", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--review-output")
    args = p.parse_args()
    cases, answers = load(args.dataset), load(args.answers)
    extra = set(answers) - set(cases)
    if extra:
        raise ValueError(f"Unknown IDs: {sorted(extra)}")
    stats = defaultdict(lambda: {"correct": 0, "incorrect": 0, "review": 0})
    rows, queue = [], []
    for key, case in cases.items():
        answer = answers.get(key, {}).get("answer", "")
        verdict, reason = score(case, answer)
        category = case["category"]
        stats[category][verdict] += 1
        item = {"id": key, "category": category, "verdict": verdict, "reason": reason,
                "expected": case["accepted_answers"], "answer": answer}
        rows.append(item)
        if verdict == "review":
            queue.append(item)
    totals = {status: sum(v[status] for v in stats.values()) for status in ("correct", "incorrect", "review")}
    report = {"schema_version": "0.4", "created_at": datetime.now(timezone.utc).isoformat(),
              "dataset": args.dataset, "answers": args.answers,
              "counts": totals, "by_category": dict(stats), "results": rows,
              "limitations": "Conservative automatic triage; review items require human adjudication. No semantic accuracy claim."}
    path = pathlib.Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    review_path = pathlib.Path(args.review_output or str(path.with_suffix(".review.jsonl")))
    review_path.parent.mkdir(parents=True, exist_ok=True)
    review_path.write_text("".join(json.dumps(x, ensure_ascii=False)+"\n" for x in queue), encoding="utf-8")
    print(f"NEO Arena v0.4: {totals}; report: {path}; review queue: {review_path}")
    for cat, values in sorted(stats.items()):
        print(f"  {cat}: {values}")

if __name__ == "__main__":
    main()
