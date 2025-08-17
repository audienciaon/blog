// Gera versão baseada na data (AAAA-MM-DD)
// Assim só força recarregar uma vez por dia
function versioned(file) {
  const today = new Date().toISOString().split("T")[0];
  return file + "?v=" + today;
}

// Carrega componentes externos (header, footer, etc.)
async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const resp = await fetch(versioned(file));
    if (!resp.ok) throw new Error(`Erro ao carregar ${file}`);
    el.innerHTML = await resp.text();
  } catch (err) {
    console.error(err);
    el.innerHTML = `<div style="color:red;font-size:14px">
      Falha ao carregar <strong>${file}</strong>
    </div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Carregar header e footer
  loadComponent("header", "/assets/header.html");
  loadComponent("footer", "/assets/footer.html");

  // Forçar CSS/JS a recarregar também
  document.querySelectorAll("link[rel='stylesheet'], script[src]").forEach(el => {
    const srcAttr = el.tagName === "LINK" ? "href" : "src";
    const original = el.getAttribute(srcAttr);
    // Só altera se não tiver ?v= já definido
    if (original && !original.includes("?v=")) {
      el.setAttribute(srcAttr, versioned(original));
    }
  });
});
