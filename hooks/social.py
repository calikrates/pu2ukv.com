"""Prévia de link (WhatsApp, Telegram, Facebook) e carregamento leve de imagens.

- Para cada página, define a imagem e a descrição usadas nas tags Open Graph
  (template em overrides/main.html). A imagem é a capa do roteiro
  (imagem com { .capa-roteiro }); nas demais páginas, assets/img/og-padrao.jpg.
- Acrescenta loading="lazy" às imagens do conteúdo, para as fotos só baixarem
  quando o visitante rolar até elas (capa e brasão continuam imediatos).
"""
import posixpath
import re

CAPA = re.compile(r"!\[[^\]]*\]\(([^)\s]+)\)\{\s*\.capa-roteiro")
IMG = re.compile(r"<img\b(?![^>]*\bloading=)(?![^>]*(?:capa-roteiro|hero-brasao))")
PADRAO = "assets/img/og-padrao.jpg"


def _descricao(markdown):
    for bloco in re.split(r"\n\s*\n", markdown):
        b = bloco.strip()
        if not b or b[0] in "#!<|{-*>" or b.startswith(("---", "    ")):
            continue
        b = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", b)   # links → texto
        b = re.sub(r"[*_`]", "", b)
        b = re.sub(r"\s+", " ", b)
        return b if len(b) <= 200 else b[:197].rsplit(" ", 1)[0] + "…"
    return ""


def on_page_markdown(markdown, page, config, files):
    base = config.get("site_url") or "/"
    m = CAPA.search(markdown)
    if m:
        pasta = posixpath.dirname(page.file.src_uri)
        img = posixpath.normpath(posixpath.join(pasta, m.group(1)))
    else:
        img = PADRAO
    page.meta["og_image"] = base + img
    page.meta["og_desc"] = page.meta.get("description") or _descricao(markdown) \
        or config.get("site_description", "")
    return markdown


def on_page_content(html, page, config, files):
    return IMG.sub('<img loading="lazy" decoding="async"', html)
