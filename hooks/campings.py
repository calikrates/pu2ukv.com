"""Página de campings próximos.

O marcador {{ mapa_campings }} vira o painel (região, cidade, GPS, raio),
o mapa e a lista. Os dados vêm ao vivo do OpenStreetMap (Overpass API);
o mapa usa Leaflet. O código JS fica em hooks/campings.js e entra embutido
na página, para não sofrer com cache de arquivo separado.
"""
from pathlib import Path

JS = Path(__file__).parent / "campings.js"
MARCADOR = "{{ mapa_campings }}"
LEAFLET = "https://unpkg.com/leaflet@1.9.4/dist"

PAINEL = """<div id="camp-app" class="rep-app camp-app">
<div class="rep-ctrl">
<label>Região
<select id="camp-regiao"></select></label>
<label>Raio
<select id="camp-raio">
<option value="25">25 km</option>
<option value="50" selected>50 km</option>
<option value="100">100 km</option>
</select></label>
<button id="camp-gps" type="button" class="md-button">📍 Usar minha localização</button>
</div>
<form id="camp-form" class="camp-form">
<input id="camp-cidade" class="filtro" type="search" placeholder="Ou digite uma cidade (ex.: Cunha, SP)">
<button type="submit" class="md-button">Buscar</button>
</form>
<p id="camp-resumo" class="rep-resumo"></p>
<div id="camp-mapa" class="camp-mapa"></div>
<ul id="camp-lista" class="camp-lista"></ul>
</div>
"""


def on_page_markdown(markdown, page, config, files):
    if MARCADOR in markdown:
        page.meta["_campings"] = True
        return markdown.replace(MARCADOR, PAINEL)
    return markdown


def on_post_page(output, page, config):
    if not page.meta.get("_campings"):
        return output
    css = f'<link rel="stylesheet" href="{LEAFLET}/leaflet.css" crossorigin="">\n'
    js = (f'<script src="{LEAFLET}/leaflet.js" crossorigin=""></script>\n'
          f"<script>\n{JS.read_text(encoding='utf-8')}\n</script>\n")
    output = output.replace("</head>", css + "</head>", 1)
    return output.replace("</body>", js + "</body>", 1)
