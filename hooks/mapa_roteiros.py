"""Mapa com todos os roteiros (página Overland › Roteiros).

O marcador {{ mapa_roteiros }} vira um mapa Leaflet com um ponto por roteiro;
cada ponto abre um balão com foto e link. Para incluir um roteiro novo,
acrescente uma linha em ROTEIROS. Coordenadas aproximadas (região do roteiro).
"""
import json

MARCADOR = "{{ mapa_roteiros }}"
LEAFLET = "https://unpkg.com/leaflet@1.9.4/dist"

# (nome, página, foto mini, resumo, lat, lon)
ROTEIROS = [
    ("Trilha da Placa · Cajamar", "trilha-da-placa/", "trilha-da-placa/03-terez4-mirante-mini.jpg",
     "Off-road até o ponto mais alto de Cajamar.", -23.30, -46.90),
    ("Pedra Grande · Atibaia", "pedra-grande/", "pedra-grande/02-plato-cidade-mini.jpg",
     "Platô de granito a ≈ 1.418 m.", -23.15, -46.53),
    ("Pico do Jaraguá · São Paulo", "pico-do-jaragua/", "pico-do-jaragua/03-panorama-mini.jpg",
     "Ponto mais alto da capital, a pé.", -23.456, -46.766),
    ("Castelhanos · Ilhabela", "castelhanos/", "castelhanos/01-baia-de-castelhanos-mini.jpg",
     "Estrada-Parque 4x4 e camping na praia.", -23.85, -45.28),
    ("Serra do Rio do Rastro · SC", "serra-do-rio-do-rastro/", "rio-do-rastro/04-terez4-e-a-serra-mini.jpg",
     "284 curvas até ≈ 1.460 m.", -28.39, -49.55),
    ("Serra do Corvo Branco · SC", "serra-do-corvo-branco/", "corvo-branco/01-corte-e-vale-mini.jpg",
     "O maior corte de rocha do Brasil.", -28.05, -49.38),
    ("Serra da Canastra · MG", "serra-da-canastra/", "canastra/01-terez4-mirante-mini.jpg",
     "Serra Branca, Caminho do Céu e a nascente do São Francisco.", -20.25, -46.45),
]

PAINEL = '<div id="rot-mapa" class="camp-mapa rot-mapa"></div>\n'

JS = """
(function () {
  var el = document.getElementById("rot-mapa");
  if (!el || !window.L) return;
  var dados = JSON.parse(document.getElementById("rot-dados").textContent);
  var img = el.getAttribute("data-img"), mapa = L.map(el, { scrollWheelZoom: false });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18, attribution: "&copy; OpenStreetMap"
  }).addTo(mapa);
  var pontos = [];
  dados.forEach(function (r) {
    var html = '<a class="rot-pop" href="' + r.url + '"><img src="' + img + r.foto + '" alt="">' +
      "<strong>" + r.nome + "</strong><span>" + r.txt + "</span></a>";
    L.marker([r.lat, r.lon]).addTo(mapa).bindPopup(html, { maxWidth: 240 });
    pontos.push([r.lat, r.lon]);
  });
  mapa.fitBounds(pontos, { padding: [30, 30] });
})();
"""


def on_page_markdown(markdown, page, config, files):
    if MARCADOR in markdown:
        page.meta["_mapa_roteiros"] = True
        return markdown.replace(MARCADOR, PAINEL)
    return markdown


def on_post_page(output, page, config):
    if not page.meta.get("_mapa_roteiros"):
        return output
    dados = [dict(nome=n, url=u, foto=f, txt=t, lat=la, lon=lo) for n, u, f, t, la, lo in ROTEIROS]
    # caminho relativo da página até assets/img (a página fica em overland/roteiros/)
    output = output.replace('id="rot-mapa"', 'id="rot-mapa" data-img="../../assets/img/"', 1)
    css = f'<link rel="stylesheet" href="{LEAFLET}/leaflet.css" crossorigin="">\n'
    js = (f'<script id="rot-dados" type="application/json">{json.dumps(dados, ensure_ascii=False)}</script>\n'
          f'<script src="{LEAFLET}/leaflet.js" crossorigin=""></script>\n<script>{JS}</script>\n')
    output = output.replace("</head>", css + "</head>", 1)
    return output.replace("</body>", js + "</body>", 1)
