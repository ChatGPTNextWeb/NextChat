# TandiTech LLM — NEO Arena v0.1

Primeiro avaliador local da plataforma. Não requer API, GPU, instalação de bibliotecas Python ou download de pesos.

## Executar na VPS

```bash
cd /opt/tandi-neo/NextChatBR
git fetch origin feature/tandi-neo-browser-core
git checkout feature/tandi-neo-browser-core
git pull --ff-only origin feature/tandi-neo-browser-core
cat > /tmp/tandi-answers.jsonl <<'EOF'
{"id":"pt-001","answer":"12"}
{"id":"pt-002","answer":"54"}
{"id":"pt-003","answer":"25"}
{"id":"pt-004","answer":"animais"}
{"id":"pt-005","answer":"frio"}
{"id":"pt-006","answer":"B"}
{"id":"pt-007","answer":"sim"}
{"id":"pt-008","answer":"sim"}
{"id":"pt-009","answer":"Brasília"}
{"id":"pt-010","answer":"7"}
EOF
python3 tools/neo_arena.py --dataset datasets/neo-arena-v0.1.jsonl --answers /tmp/tandi-answers.jsonl --output /opt/tandi-neo/benchmarks/neo-arena-smoke.json
```

Esperado: 10/10 neste teste de sanidade com respostas conhecidas. Isso **não** significa que uma LLM foi avaliada. Para testar um modelo real, produza um JSONL de respostas usando exatamente os IDs do dataset e execute o mesmo avaliador.

## Limites

- Pontuação por correspondência exata após normalização; respostas corretas com formulação diferente podem receber zero.
- O dataset é pequeno e público; serve apenas para testar o pipeline, não para classificar modelos.
- Não mede qualidade de raciocínio, alucinação, segurança, latência, energia ou capacidade multimodal.
- Não inclui geração de respostas, download de modelos, fine-tuning ou treinamento.
- Dados de treinamento futuros precisam ter origem, licença e permissões verificadas. Não coletar conversas de usuários sem consentimento.

## Próximas fases

1. Runner local para gerar respostas com modelos compatíveis e medir latência/memória.
2. Conjunto de avaliação ampliado, independente do conjunto de treinamento.
3. Seleção de modelo-base e documentação de licença.
4. Fine-tuning reproduzível quando houver hardware adequado.
