#!/usr/bin/env python3
"""Create v0.4 dataset from v0.3, clarifying the 20 logic prompts."""
import json
from pathlib import Path

source = Path("datasets/neo-arena-v0.3.jsonl")
target = Path("datasets/neo-arena-v0.4.jsonl")
cases = [json.loads(line) for line in source.read_text(encoding="utf-8").splitlines() if line.strip()]
for case in cases:
    if case["category"] == "logic":
        x = int(case["id"].split("-")[-1]) - 60
        case["prompt"] = (f"Uma sequência começa em {x}. Some 2 para obter o segundo número, "
                          f"depois some 3 para obter o terceiro, e depois some 4. "
                          f"Qual é o quarto número? Responda apenas com o número.")
        assert case["accepted_answers"] == [str(x + 9)]
assert len(cases) == 100
target.write_text("".join(json.dumps(x, ensure_ascii=False)+"\n" for x in cases), encoding="utf-8")
print(f"Created {target} with {len(cases)} cases; clarified 20 logic prompts")
