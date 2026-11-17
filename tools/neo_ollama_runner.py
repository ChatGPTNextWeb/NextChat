#!/usr/bin/env python3
"""Generate NEO Arena answers using a local Ollama endpoint.

Ollama must already be running and a model pulled. No external inference APIs.
"""
import argparse
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request


def load_cases(path):
    seen = set()
    with open(path, encoding="utf-8") as stream:
        for number, line in enumerate(stream, 1):
            if not line.strip():
                continue
            item = json.loads(line)
            case_id = item["id"]
            if case_id in seen:
                raise ValueError(f"Duplicate case id: {case_id} (line {number})")
            seen.add(case_id)
            yield item


def generate(base_url, model, prompt, timeout):
    payload = json.dumps({
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0, "num_predict": 96},
        "keep_alive": "0s",
    }).encode("utf-8")
    req = urllib.request.Request(
        base_url.rstrip("/") + "/api/generate",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:
        result = json.load(response)
    return result.get("response", "").strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", default="datasets/neo-arena-v0.1.jsonl")
    parser.add_argument("--model", required=True)
    parser.add_argument("--output", default="/opt/tandi-neo/benchmarks/neo-arena-model-answers.jsonl")
    parser.add_argument("--url", default="http://127.0.0.1:11434")
    parser.add_argument("--timeout", type=int, default=180)
    args = parser.parse_args()
    if not args.url.startswith(("http://127.0.0.1:", "http://localhost:")):
        raise ValueError("Only localhost Ollama endpoints are supported")
    if args.timeout <= 0:
        raise ValueError("Timeout must be positive")
    cases = list(load_cases(args.dataset))
    output = pathlib.Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(output.suffix + ".tmp")
    try:
        with temporary.open("w", encoding="utf-8") as stream:
            for i, case in enumerate(cases, 1):
                start = time.monotonic()
                answer = generate(args.url, args.model, case["prompt"], args.timeout)
                elapsed = time.monotonic() - start
                stream.write(json.dumps({
                    "id": case["id"], "answer": answer,
                    "model": args.model, "latency_seconds": round(elapsed, 3),
                }, ensure_ascii=False) + "\n")
                stream.flush()
                print(f"[{i}/{len(cases)}] {case['id']} ({elapsed:.1f}s): {answer[:90]}", flush=True)
        temporary.replace(output)
    finally:
        temporary.unlink(missing_ok=True)
    print(f"Answers saved to {output}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, urllib.error.URLError, json.JSONDecodeError) as exc:
        print(f"NEO runner error: {exc}", file=sys.stderr)
        sys.exit(1)
