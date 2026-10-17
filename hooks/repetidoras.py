"""Injeta os dados de data/repetidoras.csv na página de repetidoras.

Na página, o marcador {{ tabela_repetidoras }} vira o painel de busca
(seletor de região + raio) e os dados em JSON. O JavaScript
(hooks/repetidoras.js, embutido na página) calcula as distâncias no navegador.
Para atualizar: edite só o CSV e faça push.
"""
import csv
import json
from pathlib import Path

CSV = Path(__file__).parent.parent / "data" / "repetidoras.csv"
JS = Path(__file__).parent / "repetidoras.js"
MARCADOR = "{{ tabela_repetidoras }}"


def _dados():
    with CSV.open(encoding="utf-8") as f:
        return [
            {
                "f": r["saida_mhz"],
                "o": float(r["offset_mhz"]),
                "t": r["tom"],
                "c": r["cidade"],
                "k": r["indicativo"],
                "la": float(r["lat"]),
                "lo": float(r["lon"]),
            }
            for r in csv.DictReader(f)
        ]


def _painel():
    return f"""<div id="rep-app" class="rep-app">
<div class="rep-ctrl">
<label>Região
<select id="rep-regiao"></select></label>
<label>Raio
<select id="rep-raio">
<option value="50">50 km</option>
<option value="100" selected>100 km</option>
<option value="150">150 km</option>
<option value="200">200 km</option>
</select></label>
<button id="rep-gps" type="button" class="md-button">📍 Usar minha localização</button>
</div>
<input id="rep-busca" class="filtro" type="search" placeholder="Filtrar resultado por cidade, frequência, tom ou indicativo…">
<p id="rep-resumo" class="rep-resumo"></p>
<div class="rep-tabela"><table>
<thead><tr><th>Saída (RX)</th><th>Offset</th><th>TX do rádio</th><th>Tom</th><th>Cidade</th><th>Indicativo</th><th>Dist.</th></tr></thead>
<tbody id="rep-corpo"></tbody>
</table></div>
</div>
"""


def _scripts():
    dados = json.dumps(_dados(), ensure_ascii=False, separators=(",", ":"))
    js = JS.read_text(encoding="utf-8")
    return (f'<script id="rep-dados" type="application/json">{dados}</script>\n'
            f"<script>\n{js}\n</script>\n")


def on_page_markdown(markdown, page, config, files):
    if MARCADOR in markdown:
        page.meta["_repetidoras"] = True
        return markdown.replace(MARCADOR, _painel())
    return markdown


def on_post_page(output, page, config):
    # Os scripts entram depois do Markdown já convertido, para não serem alterados.
    if page.meta.get("_repetidoras"):
        return output.replace("</body>", _scripts() + "</body>", 1)
    return output
