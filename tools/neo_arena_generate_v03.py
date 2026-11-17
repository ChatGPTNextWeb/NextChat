#!/usr/bin/env python3
"""Generate 100 deterministic pt-BR NEO Arena cases, no network or dependencies."""
import json
from pathlib import Path

cases = []
def add(category, prompt, answer):
    cases.append({"id": f"neo03-{len(cases)+1:03d}", "category": category,
                  "prompt": prompt, "accepted_answers": [str(answer)]})

for a, b in [(7,5),(9,6),(23,18),(125,375),(81,19),(42,17),(56,28),(199,1),(63,27),(34,66)]:
    add("arithmetic", f"Quanto é {a} + {b}? Responda somente com o número.", a+b)
for a, b in [(12,4),(18,3),(9,7),(15,5),(11,8),(20,6),(14,3),(16,9),(25,4),(13,7)]:
    add("arithmetic", f"Quanto é {a} vezes {b}? Responda somente com o número.", a*b)

for singular, plural in [
    ("animal","animais"),("papel","papéis"),("flor","flores"),("casa","casas"),
    ("livro","livros"),("coração","corações"),("pão","pães"),("mão","mãos"),
    ("luz","luzes"),("avião","aviões"),("cão","cães"),("mulher","mulheres"),
    ("homem","homens"),("árvore","árvores"),("carro","carros"),("anel","anéis"),
    ("hotel","hotéis"),("jardim","jardins"),("mês","meses"),("país","países")
]:
    add("portuguese", f"Qual é o plural de '{singular}'? Responda apenas com a palavra.", plural)

for subject, fact, question, answer in [
    ("Lia","Lia comprou três cadernos azuis.","Quem comprou os cadernos?","Lia"),
    ("Rui","Rui chegou à escola às oito horas.","A que horas Rui chegou à escola?","oito horas"),
    ("Bia","Bia colocou o livro na mesa.","Onde Bia colocou o livro?","na mesa"),
    ("Ana","Ana prefere suco de manga.","Qual fruta está no suco preferido de Ana?","manga"),
    ("Ivo","Ivo tem um cachorro chamado Max.","Como se chama o cachorro de Ivo?","Max"),
    ("Eva","Eva viajou para Recife.","Para qual cidade Eva viajou?","Recife"),
    ("Leo","Leo pintou a parede de verde.","De que cor Leo pintou a parede?","verde"),
    ("Mia","Mia guardou a chave na gaveta.","Onde Mia guardou a chave?","na gaveta"),
    ("Tom","Tom leu quatro páginas.","Quantas páginas Tom leu?","quatro"),
    ("Nina","Nina acordou na terça-feira.","Em que dia Nina acordou?","terça-feira"),
    ("Caio","Caio comprou pão na padaria.","Onde Caio comprou pão?","na padaria"),
    ("Duda","Duda levou um guarda-chuva vermelho.","Qual era a cor do guarda-chuva?","vermelho"),
    ("João","João pegou o ônibus número 12.","Qual era o número do ônibus?","12"),
    ("Sara","Sara plantou uma roseira no quintal.","O que Sara plantou?","uma roseira"),
    ("Pedro","Pedro entregou a carta a Bruno.","Quem recebeu a carta?","Bruno"),
    ("Luiza","Luiza mora no terceiro andar.","Em qual andar Luiza mora?","terceiro"),
    ("Raul","Raul perdeu o lápis amarelo.","Que objeto Raul perdeu?","lápis"),
    ("Lara","Lara tem dois gatos.","Quantos gatos Lara tem?","dois"),
    ("Neto","Neto fez bolo de cenoura.","De que vegetal era o bolo?","cenoura"),
    ("Olga","Olga saiu de casa às seis horas.","A que horas Olga saiu?","seis horas")
]:
    add("reading", f"Leia: {fact} {question} Responda de forma curta.", answer)

for x in range(1, 21):
    a = x + 2
    b = x + 5
    add("logic", f"Complete a sequência: {x}, {a}, {b}, __. Responda só com o número.", x+9)

for city, state in [
    ("Salvador","Bahia"),("Recife","Pernambuco"),("Fortaleza","Ceará"),
    ("Manaus","Amazonas"),("Belém","Pará"),("Curitiba","Paraná"),
    ("Florianópolis","Santa Catarina"),("Porto Alegre","Rio Grande do Sul"),
    ("Belo Horizonte","Minas Gerais"),("Vitória","Espírito Santo"),
    ("Goiânia","Goiás"),("Cuiabá","Mato Grosso"),("Campo Grande","Mato Grosso do Sul"),
    ("Natal","Rio Grande do Norte"),("João Pessoa","Paraíba"),
    ("Maceió","Alagoas"),("Aracaju","Sergipe"),("Teresina","Piauí"),
    ("São Luís","Maranhão"),("Palmas","Tocantins")
]:
    add("knowledge", f"Qual é o estado brasileiro cuja capital é {city}? Responda somente com o nome do estado.", state)

assert len(cases) == 100
assert len({c["id"] for c in cases}) == 100
output = Path("datasets/neo-arena-v0.3.jsonl")
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text("".join(json.dumps(c, ensure_ascii=False) + "\n" for c in cases), encoding="utf-8")
from collections import Counter
print(f"Created {len(cases)} cases at {output}: {dict(Counter(c['category'] for c in cases))}")
