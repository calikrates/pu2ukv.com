// Campings próximos: região, cidade digitada ou GPS -> campings do OpenStreetMap no mapa.
(function () {
  const REGIOES = [
    ["Osasco / Zona Oeste", -23.53, -46.79],
    ["São Paulo (capital)", -23.55, -46.63],
    ["Serra da Cantareira / Mairiporã", -23.32, -46.59],
    ["Atibaia / Bragança Paulista", -23.12, -46.55],
    ["Joanópolis / Piracaia", -22.93, -46.27],
    ["Jundiaí / Serra do Japi", -23.19, -46.88],
    ["Campinas", -22.91, -47.06],
    ["Sorocaba / Itu", -23.40, -47.40],
    ["Brotas / São Pedro", -22.40, -48.00],
    ["Baixada Santista", -23.96, -46.33],
    ["Litoral Sul (Peruíbe / Iguape)", -24.40, -47.20],
    ["Litoral Norte (Ubatuba / Caraguatatuba)", -23.50, -45.15],
    ["Ilhabela", -23.78, -45.36],
    ["Vale do Paraíba (S. J. dos Campos)", -23.18, -45.89],
    ["Serra da Mantiqueira (Campos do Jordão)", -22.74, -45.59],
    ["São Bento do Sapucaí / Santo Antônio do Pinhal", -22.69, -45.73],
    ["Cunha", -23.07, -44.96],
    ["Paraty (RJ)", -23.22, -44.71],
    ["Sul de Minas (Monte Verde)", -22.86, -46.04],
    ["Vale do Ribeira (Registro / Petar)", -24.49, -47.84],
    ["Curitiba (PR)", -25.43, -49.27],
    ["Rio de Janeiro", -22.91, -43.20],
  ];
  const OVERPASS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];

  const km = (a, b, c, d) => {
    const R = 6371, r = Math.PI / 180;
    const x = Math.sin(((c - a) * r) / 2) ** 2 +
      Math.cos(a * r) * Math.cos(c * r) * Math.sin(((d - b) * r) / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const lerLS = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const gravarLS = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const cache = new Map();

  async function buscarCampings(lat, lon, raioKm) {
    const chave = `${lat.toFixed(2)},${lon.toFixed(2)},${raioKm}`;
    if (cache.has(chave)) return cache.get(chave);
    const m = raioKm * 1000;
    const q = `[out:json][timeout:25];(nwr["tourism"="camp_site"](around:${m},${lat},${lon}););out center tags 300;`;
    let ultimoErro;
    for (const url of OVERPASS) {
      try {
        const r = await fetch(url, { method: "POST", body: "data=" + encodeURIComponent(q),
          headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        if (!r.ok) throw new Error("HTTP " + r.status);
        const j = await r.json();
        const lista = j.elements.map((e) => {
          const t = e.tags || {};
          const la = e.lat ?? e.center?.lat, lo = e.lon ?? e.center?.lon;
          return {
            nome: t.name || "Camping sem nome no mapa",
            semNome: !t.name,
            la, lo,
            cidade: t["addr:city"] || t["is_in:city"] || "",
            site: t.website || t["contact:website"] || "",
            fone: t.phone || t["contact:phone"] || "",
            pago: t.fee === "yes" ? "Pago" : t.fee === "no" ? "Gratuito" : "",
            barraca: t.tents === "yes", motorhome: t.caravans === "yes" || t.motorhome === "yes",
            luz: t.power_supply === "yes", banho: t.shower === "yes" || t.shower === "hot",
          };
        }).filter((c) => c.la != null);
        cache.set(chave, lista);
        return lista;
      } catch (e) { ultimoErro = e; }
    }
    throw ultimoErro;
  }

  async function geocodificar(texto) {
    const u = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&accept-language=pt-BR&q=" +
      encodeURIComponent(texto);
    const r = await fetch(u, { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json();
    if (!j.length) return null;
    return [j[0].display_name.split(",")[0], +j[0].lat, +j[0].lon];
  }

  function iniciar() {
    const app = document.getElementById("camp-app");
    if (!app || app.dataset.ok) return;
    app.dataset.ok = "1";
    const $ = (id) => document.getElementById(id);
    const selReg = $("camp-regiao"), selRaio = $("camp-raio"), cidade = $("camp-cidade");
    const resumo = $("camp-resumo"), lista = $("camp-lista"), gps = $("camp-gps");

    REGIOES.forEach((r, i) => selReg.add(new Option(r[0], i)));
    const salvo = lerLS("camp-regiao");
    if (salvo !== null && REGIOES[salvo]) selReg.value = salvo;
    const raioSalvo = lerLS("camp-raio");
    if (raioSalvo) selRaio.value = raioSalvo;

    let mapa = null, camada = null, ponto = REGIOES[selReg.value], pedido = 0;
    if (window.L) {
      mapa = L.map("camp-mapa", { scrollWheelZoom: false }).setView([ponto[1], ponto[2]], 9);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa);
      camada = L.layerGroup().addTo(mapa);
    } else {
      $("camp-mapa").innerHTML = '<p class="camp-aviso">Não foi possível carregar o mapa. A lista abaixo continua funcionando.</p>';
    }

    const linkMaps = (c) =>
      `https://www.google.com/maps/dir/?api=1&destination=${c.la},${c.lo}`;

    async function atualizar() {
      const meu = ++pedido;
      const raio = +selRaio.value;
      resumo.textContent = `Procurando campings num raio de ${raio} km · ${ponto[0]}…`;
      lista.innerHTML = "";
      if (mapa) {
        camada.clearLayers();
        L.circle([ponto[1], ponto[2]], { radius: raio * 1000, color: "#f28f3b", weight: 1, fillOpacity: 0.04 }).addTo(camada);
        L.circleMarker([ponto[1], ponto[2]], { radius: 7, color: "#fff", weight: 2, fillColor: "#f28f3b", fillOpacity: 1 })
          .bindTooltip(ponto[0]).addTo(camada);
        mapa.fitBounds(L.latLng(ponto[1], ponto[2]).toBounds(raio * 2000));
      }
      let dados;
      try { dados = await buscarCampings(ponto[1], ponto[2], raio); }
      catch (e) {
        if (meu !== pedido) return;
        resumo.textContent = "O serviço de mapas está ocupado agora. Tente de novo em alguns segundos.";
        return;
      }
      if (meu !== pedido) return;
      const itens = dados.map((c) => ({ ...c, dist: km(ponto[1], ponto[2], c.la, c.lo) }))
        .filter((c) => c.dist <= raio)
        .sort((a, b) => (a.semNome - b.semNome) || (a.dist - b.dist));
      resumo.textContent = itens.length
        ? `${itens.length} camping${itens.length > 1 ? "s" : ""} num raio de ${raio} km · ${ponto[0]}`
        : `Nenhum camping cadastrado no mapa num raio de ${raio} km · ${ponto[0]}. Tente um raio maior.`;
      lista.innerHTML = itens.map((c, i) => {
        const tags = [c.pago, c.barraca && "Barraca", c.motorhome && "Motorhome", c.luz && "Energia", c.banho && "Chuveiro"]
          .filter(Boolean).map((t) => `<span class="camp-tag">${t}</span>`).join("");
        const extra = [
          c.site && `<a href="${esc(c.site)}" target="_blank" rel="noopener">site</a>`,
          c.fone && `<a href="tel:${esc(c.fone.replace(/[^\d+]/g, ""))}">${esc(c.fone)}</a>`,
        ].filter(Boolean).join(" · ");
        return `<li class="camp-item${c.semNome ? " sem-nome" : ""}" data-i="${i}">
          <div class="camp-topo"><strong>${esc(c.nome)}</strong><span class="camp-dist">${Math.round(c.dist)} km</span></div>
          <div class="camp-info">${esc(c.cidade)}${c.cidade && tags ? " " : ""}${tags}</div>
          <div class="camp-acoes"><a class="camp-rota" href="${linkMaps(c)}" target="_blank" rel="noopener">Como chegar ↗</a>${extra ? " · " + extra : ""}</div>
        </li>`;
      }).join("");
      if (mapa) {
        const marcadores = itens.map((c) =>
          L.marker([c.la, c.lo]).bindPopup(
            `<strong>${esc(c.nome)}</strong><br>${Math.round(c.dist)} km<br><a href="${linkMaps(c)}" target="_blank" rel="noopener">Como chegar ↗</a>`
          ).addTo(camada));
        lista.querySelectorAll(".camp-item").forEach((li) => li.addEventListener("click", (ev) => {
          if (ev.target.closest("a")) return;
          const m = marcadores[+li.dataset.i];
          mapa.setView(m.getLatLng(), 13); m.openPopup();
          $("camp-mapa").scrollIntoView({ behavior: "smooth", block: "center" });
        }));
      }
    }

    selReg.addEventListener("change", () => {
      ponto = REGIOES[selReg.value]; gravarLS("camp-regiao", selReg.value);
      cidade.value = ""; gps.textContent = "📍 Usar minha localização"; atualizar();
    });
    selRaio.addEventListener("change", () => { gravarLS("camp-raio", selRaio.value); atualizar(); });

    $("camp-form").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const t = cidade.value.trim();
      if (!t) return;
      resumo.textContent = `Localizando "${t}"…`;
      try {
        const p = await geocodificar(t);
        if (!p) { resumo.textContent = `Não encontrei "${t}". Tente "cidade, UF".`; return; }
        ponto = p; gps.textContent = "📍 Usar minha localização"; atualizar();
      } catch (e) { resumo.textContent = "Não consegui localizar agora. Tente de novo ou escolha uma região."; }
    });

    if (!navigator.geolocation) gps.style.display = "none";
    gps.addEventListener("click", () => {
      gps.textContent = "📍 Localizando…";
      navigator.geolocation.getCurrentPosition(
        (p) => { ponto = ["Sua localização", p.coords.latitude, p.coords.longitude];
          gps.textContent = "📍 Usando sua localização"; cidade.value = ""; atualizar(); },
        () => { gps.textContent = "📍 Localização indisponível"; },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    });

    atualizar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
