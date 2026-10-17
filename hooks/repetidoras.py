"""Gera a tabela de repetidoras a partir de data/repetidoras.csv.

Na página, o marcador {{ tabela_repetidoras }} é trocado pela tabela.
Para atualizar: edite só o CSV e faça push.
"""
import csv
from pathlib import Path

CSV = Path(__file__).parent.parent / "data" / "repetidoras.csv"
MARCADOR = "{{ tabela_repetidoras }}"


def _tom(t):
    if t.startswith(("DMR", "D-STAR")):
        return t
    if t.lower() in ("", "sem tom"):
        return "Sem tom"
    return f"CTCSS {t}"


def _tabela():
    linhas = [
        '<input id="filtro-rep" class="filtro" type="search" '
        'placeholder="Filtrar por cidade, frequência, tom ou indicativo…">',
        "",
        "| Saída (RX) | Offset | TX do rádio | Tom | Cidade | Indicativo | Dist. |",
        "|---:|---:|---:|---|---|---|---:|",
    ]
    with CSV.open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            saida = float(r["saida_mhz"])
            off = float(r["offset_mhz"])
            linhas.append(
                f"| **{r['saida_mhz']}** | {off:+g} | {saida + off:.3f} | {_tom(r['tom'])} "
                f"| {r['cidade']} | `{r['indicativo']}` | {r['dist_km']} km |"
            )
    return "\n".join(linhas)


def on_page_markdown(markdown, page, config, files):
    if MARCADOR in markdown:
        return markdown.replace(MARCADOR, _tabela())
    return markdown
