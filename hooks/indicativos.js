// Consulta de indicativos: decodifica o indicativo pelas regras do Ato Anatel 3448/2026
// e oferece links para bases externas (QRZ, HamQTH, aprs.fi, PSK Reporter).
(function () {
  // Tabela II (efetivos, classes A/B): prefixo+dígito -> UF
  const AB = {
    PT8: "Acre", PP7: "Alagoas", PQ8: "Amapá", PP8: "Amazonas", PY6: "Bahia", PT7: "Ceará",
    PT2: "Distrito Federal", PP1: "Espírito Santo", PP2: "Goiás", PR8: "Maranhão", PY9: "Mato Grosso",
    PT9: "Mato Grosso do Sul", PY4: "Minas Gerais", PR7: "Paraíba", PY5: "Paraná", PY8: "Pará",
    PY7: "Pernambuco", PS8: "Piauí", PY1: "Rio de Janeiro", PS7: "Rio Grande do Norte",
    PY3: "Rio Grande do Sul", PW8: "Rondônia", PV8: "Roraima", PP5: "Santa Catarina",
    PY2: "São Paulo", PR2: "São Paulo", PP6: "Sergipe", PQ2: "Tocantins",
  };
  // Classe C: PU + dígito (o dígito indica a região; a UF exata depende da faixa do sufixo)
  const REGIAO = {
    1: "ES ou RJ", 2: "SP, DF, GO ou TO", 3: "RS", 4: "MG", 5: "PR ou SC", 6: "BA ou SE",
    7: "AL, CE, PB, PE ou RN", 8: "AC, AP, AM, MA, PA, PI, RO ou RR", 9: "MT ou MS",
  };
  const ILHAS = { F: "Fernando de Noronha", M: "Martim Vaz", R: "Atol das Rocas",
    S: "Penedos de São Pedro e São Paulo", T: "Trindade", A: "Região Antártica" };
  const PROIBIDOS = ["DDD", "SNM", "SOS", "SVH", "TTT", "XXX", "PAN", "RRR"];
  const BR = /^(P[P-Y]|Z[V-Z])/;

  function analisar(bruto) {
    const original = bruto.trim().toUpperCase().replace(/\s+/g, "");
    const partes = original.split("/");
    const call = partes.reduce((a, b) => (b.length > a.length ? b : a), "");
    const extras = partes.filter((p) => p !== call);
    const r = { call, extras, itens: [], alertas: [], br: false };
    const m = call.match(/^([A-Z]{1,2}|[A-Z][0-9]|[0-9][A-Z])([0-9])([A-Z0-9]+)$/);
    if (!m) { r.titulo = "Formato não reconhecido"; r.alertas.push("Um indicativo tem prefixo, um dígito e um sufixo — por exemplo PU2UKV."); return r; }
    const [, pref, dig, suf] = m;
    const pd = pref + dig;
    r.br = BR.test(call);
    if (!r.br) {
      r.titulo = "Indicativo estrangeiro";
      r.itens.push(["Prefixo", pd], ["País", "Fora do Brasil — consulte o QRZ ou o HamQTH abaixo"]);
      return r;
    }
    r.itens.push(["Prefixo", pref], ["Dígito de região", dig], ["Sufixo", suf]);
    const letras = /^[A-Z]+$/.test(suf);

    if (pref.startsWith("Z") || (!AB[pd] && pref !== "PU" && !(pd === "PV2") && dig !== "0")) {
      r.titulo = "Indicativo especial (temporário)";
      r.itens.push(["Tipo", "Especial — concedido para eventos e válido só durante o evento"],
        ["Região", REGIAO[dig] || "—"]);
      if (pref.startsWith("Z")) r.itens.push(["Série", "ZV–ZZ: aberta às classes A, B e C"]);
      else r.itens.push(["Série", "PP–PX especial: restrita à classe A com histórico em concursos internacionais"]);
      if (/^W/.test(suf)) r.itens.push(["Classe provável", "C (sufixo especial de classe C começa com W)"]);
      return r;
    }
    if (dig === "0") {
      r.titulo = pref === "PU" ? "Ilha oceânica ou Antártica — classe C" : "Ilha oceânica, Antártica ou estação espacial";
      const loc = ILHAS[suf[0]];
      r.itens.push(["Local", loc || "Não identificado pela primeira letra do sufixo"]);
      if (suf[0] === "Z" || suf[1] === "Z") r.itens.push(["Operador", "Estrangeiro"]);
      return r;
    }
    if (!letras) r.alertas.push("Sufixo de indicativo efetivo só tem letras.");
    if (pref === "PU" || pd === "PV2") {
      r.titulo = "Indicativo efetivo — classe C";
      r.itens.push(["Classe", "C (iniciante)"],
        ["UF", pd === "PV2" ? "São Paulo" : `Região ${dig}: ${REGIAO[dig]}`]);
      if (suf.length !== 3) r.alertas.push("Classe C usa sufixo de exatamente 3 letras.");
    } else {
      r.titulo = "Indicativo efetivo — classe A ou B";
      r.itens.push(["Classe", "A ou B (o prefixo não diferencia as duas)"], ["UF", AB[pd]]);
      if (suf.length < 2 || suf.length > 3) r.alertas.push("Classes A e B usam sufixo de 2 ou 3 letras.");
    }
    if (suf.length === 3 && suf[0] === "Z") r.itens.push(["Operador", "Estrangeiro licenciado no Brasil (sufixo iniciado por Z)"]);
    if (suf.length === 3 && suf[0] === "Q") r.alertas.push("Sufixos QAA–QZZ não são permitidos.");
    if (PROIBIDOS.some((p) => suf.includes(p))) r.alertas.push("Esse sufixo contém uma combinação proibida pela Anatel.");
    return r;
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function iniciar() {
    const form = document.getElementById("ind-form");
    if (!form || form.dataset.ok) return;
    form.dataset.ok = "1";
    const campo = document.getElementById("ind-campo"), saida = document.getElementById("ind-saida");

    function mostrar(valor) {
      if (!valor.trim()) { saida.innerHTML = ""; return; }
      const r = analisar(valor);
      const c = encodeURIComponent(r.call);
      const links = [
        ["QRZ.com", `https://www.qrz.com/db/${c}`, "nome, QTH e QSL (quando o colega se cadastrou)"],
        ["HamQTH", `https://www.hamqth.com/${c}`, "perfil gratuito, muitos brasileiros cadastrados"],
        ["aprs.fi", `https://aprs.fi/#!call=a%2F${c}*`, "última posição APRS, se transmitir"],
        ["PSK Reporter", `https://pskreporter.info/pskmap.html?preset&callsign=${c}`, "onde está sendo ouvido em FT8 e modos digitais"],
      ];
      saida.innerHTML = `
        <div class="ind-card">
          <div class="ind-call">${esc(r.call || valor)}${r.extras.length ? `<span class="ind-extra">/${esc(r.extras.join("/"))}</span>` : ""}</div>
          <div class="ind-titulo">${esc(r.titulo)}</div>
          ${r.itens.length ? `<dl>${r.itens.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>` : ""}
          ${r.extras.length ? `<p class="ind-nota">Complemento /${esc(r.extras.join("/"))}: indica operação portátil, móvel ou em outra região.</p>` : ""}
          ${r.alertas.map((a) => `<p class="ind-alerta">⚠ ${esc(a)}</p>`).join("")}
        </div>
        ${r.call ? `<p class="ind-sub">Ver informações do operador em:</p>
        <div class="ind-links">${links.map(([n, u, d]) => `<a href="${u}" target="_blank" rel="noopener"><strong>${n} ↗</strong><span>${d}</span></a>`).join("")}</div>` : ""}`;
      try { history.replaceState(null, "", "?c=" + encodeURIComponent(valor.trim().toUpperCase())); } catch (e) {}
    }

    form.addEventListener("submit", (e) => { e.preventDefault(); mostrar(campo.value); });
    const q = new URLSearchParams(location.search).get("c");
    if (q) { campo.value = q; mostrar(q); }
  }

  window.__analisarIndicativo = analisar;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
