"""Página de consulta de indicativos.

O marcador {{ consulta_indicativo }} vira o formulário; o JS (hooks/indicativos.js)
entra embutido no fim da página.
"""
from pathlib import Path

JS = Path(__file__).parent / "indicativos.js"
MARCADOR = "{{ consulta_indicativo }}"

PAINEL = """<div class="rep-app ind-app">
<form id="ind-form" class="camp-form">
<input id="ind-campo" class="filtro" type="search" placeholder="Digite um indicativo (ex.: PU2UKV, PY2XXX/M)" autocapitalize="characters" autocomplete="off" spellcheck="false">
<button type="submit" class="md-button">Consultar</button>
</form>
<div id="ind-saida"></div>
</div>
"""


def on_page_markdown(markdown, page, config, files):
    if MARCADOR in markdown:
        page.meta["_indicativos"] = True
        return markdown.replace(MARCADOR, PAINEL)
    return markdown


def on_post_page(output, page, config):
    if page.meta.get("_indicativos"):
        js = JS.read_text(encoding="utf-8")
        return output.replace("</body>", f"<script>\n{js}\n</script>\n</body>", 1)
    return output
