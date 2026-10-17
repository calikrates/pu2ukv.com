// Repetidoras: escolha a região (ou use o GPS) e veja as repetidoras no raio escolhido.
(function () {
  const REGIOES = [
    ["Osasco / Zona Oeste", -23.53, -46.79],
    ["São Paulo (Centro)", -23.55, -46.63],
    ["São Paulo (Zona Norte)", -23.48, -46.62],
    ["São Paulo (Zona Sul)", -23.65, -46.70],
    ["São Paulo (Zona Leste)", -23.54, -46.47],
    ["ABC Paulista", -23.66, -46.53],
    ["Guarulhos", -23.46, -46.53],
    ["Mogi das Cruzes / Alto Tietê", -23.52, -46.19],
    ["Jundiaí", -23.19, -46.88],
    ["Campinas", -22.91, -47.06],
    ["Bragança Paulista / Atibaia", -22.95, -46.54],
    ["Sorocaba", -23.50, -47.46],
    ["Piracicaba", -22.73, -47.65],
    ["Baixada Santista", -23.96, -46.33],
    ["Vale do Paraíba (S. J. dos Campos)", -23.18, -45.89],
    ["Vale do Paraíba (Taubaté)", -23.03, -45.56],
    ["Litoral Norte (Caraguatatuba)", -23.62, -45.41],
    ["Vale do Ribeira (Registro)", -24.49, -47.84],
    ["Sul de Minas (Pouso Alegre)", -22.23, -45.94],
    ["São Carlos / Araraquara", -21.90, -48.03],
    ["Ribeirão Preto", -21.18, -47.81],
    ["Botucatu / Bauru", -22.60, -48.75],
    ["Itapeva / Sudoeste Paulista", -23.98, -48.88],
    ["Rio de Janeiro", -22.91, -43.20],
    ["Sul Fluminense (Volta Redonda)", -22.52, -44.10],
    ["Curitiba", -25.43, -49.27],
  ];

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const km = (a, b, c, d) => {
    const R = 6371, r = Math.PI / 180;
    const x = Math.sin(((c - a) * r) / 2) ** 2 +
      Math.cos(a * r) * Math.cos(c * r) * Math.sin(((d - b) * r) / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  };
  const tom = (t) => (/^(DMR|D-STAR)/.test(t) ? t : /sem tom/i.test(t) || !t ? "Sem tom" : "CTCSS " + t);
  const lerLS = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const gravarLS = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  function iniciar() {
    const app = document.getElementById("rep-app");
    if (!app || app.dataset.ok) return;
    app.dataset.ok = "1";
    const dados = JSON.parse(document.getElementById("rep-dados").textContent);
    const selReg = document.getElementById("rep-regiao");
    const selRaio = document.getElementById("rep-raio");
    const busca = document.getElementById("rep-busca");
    const resumo = document.getElementById("rep-resumo");
    const corpo = document.getElementById("rep-corpo");
    const gps = document.getElementById("rep-gps");
    let ponto = null; // [nome, lat, lon]

    REGIOES.forEach((r, i) => selReg.add(new Option(r[0], i)));
    const salvo = lerLS("rep-regiao");
    if (salvo !== null && REGIOES[salvo]) selReg.value = salvo;
    const raioSalvo = lerLS("rep-raio");
    if (raioSalvo) selRaio.value = raioSalvo;
    ponto = REGIOES[selReg.value];

    function render() {
      const raio = +selRaio.value, q = norm(busca.value.trim());
      const lista = dados
        .map((d) => ({ ...d, dist: km(ponto[1], ponto[2], d.la, d.lo) }))
        .filter((d) => d.dist <= raio)
        .filter((d) => !q || norm(`${d.f} ${d.t} ${d.c} ${d.k}`).includes(q))
        .sort((a, b) => a.dist - b.dist);
      corpo.innerHTML = lista.map((d) => {
        const tx = (parseFloat(d.f) + d.o).toFixed(3);
        const cls = parseFloat(d.f) > 400 ? "uhf" : "vhf";
        return `<tr class="${cls}"><td><strong>${d.f}</strong></td><td>${d.o > 0 ? "+" : "−"}${Math.abs(d.o)}</td>` +
          `<td>${tx}</td><td>${tom(d.t)}</td><td>${d.c}</td><td><code>${d.k}</code></td>` +
          `<td>${Math.round(d.dist)} km</td></tr>`;
      }).join("");
      resumo.textContent = lista.length
        ? `${lista.length} repetidora${lista.length > 1 ? "s" : ""} num raio de ${raio} km · ${ponto[0]}`
        : `Nenhuma repetidora cadastrada num raio de ${raio} km · ${ponto[0]}. Tente um raio maior.`;
    }

    selReg.addEventListener("change", () => {
      ponto = REGIOES[selReg.value]; gravarLS("rep-regiao", selReg.value);
      gps.textContent = "📍 Usar minha localização"; render();
    });
    selRaio.addEventListener("change", () => { gravarLS("rep-raio", selRaio.value); render(); });
    busca.addEventListener("input", render);

    if (!navigator.geolocation) gps.style.display = "none";
    gps.addEventListener("click", () => {
      gps.textContent = "📍 Localizando…";
      navigator.geolocation.getCurrentPosition(
        (p) => {
          ponto = ["Sua localização", p.coords.latitude, p.coords.longitude];
          gps.textContent = "📍 Usando sua localização";
          render();
        },
        () => { gps.textContent = "📍 Localização indisponível"; },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    });

    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
