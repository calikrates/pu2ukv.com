// Filtro simples para a tabela de repetidoras (compatível com navegação instantânea do Material)
function ativarFiltro() {
  const campo = document.getElementById("filtro-rep");
  if (!campo || campo.dataset.ok) return;
  campo.dataset.ok = "1";
  const tabela = campo.parentElement.querySelector("table") || document.querySelector(".md-typeset table");
  if (!tabela) return;
  campo.addEventListener("input", () => {
    const q = campo.value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    tabela.querySelectorAll("tbody tr").forEach((tr) => {
      const txt = tr.textContent.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      tr.style.display = txt.includes(q) ? "" : "none";
    });
  });
}
if (typeof document$ !== "undefined") { document$.subscribe(ativarFiltro); }
else { document.addEventListener("DOMContentLoaded", ativarFiltro); }
