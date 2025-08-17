// ===============================
// Gera versão baseada na data (AAAA-MM-DD)
// Assim só força recarregar uma vez por dia
// ===============================
function versioned(file) {
  const today = new Date().toISOString().split("T")[0];
  return file + "?v=" + today;
}

// ===============================
// Carrega componentes externos (header, footer, etc.) com tratamento de erro
// ===============================
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

// ===============================
// Adiciona automaticamente CSS, fontes, favicon e FontAwesome no <head>
// ===============================
function addHeadAssets() {
  const head = document.head;

  // --- FontAwesome CSS ---
  const faCSS = document.createElement("link");
  faCSS.rel = "stylesheet";
  faCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css";
  head.appendChild(faCSS);

  // --- Google Fonts ---
  const fonts = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,100..900;1,100..900&display=swap",
    "https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&display=swap",
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,100..900;1,100..900&display=swap",
    "https://fonts.googleapis.com/css2?family=Radi+Canada+Big:ital,wght@0,100..900;1,100..900&display=swap"
  ];
  fonts.forEach(url => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    head.appendChild(link);
  });

  // --- Favicon ---
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9tj8z8mRqNsuuTEB6c8y4amv89AfM6AlyEZhxG_f-4vPqhkCfa_YsjxKpnbxVPal0hPYTivPgrM2JNp5rxAkK38Nb2jwUJK4sup-TdHItNfGHrrEHZ0764ppYgCqynkIE66Z4Pq9uD2btQ3l4Q2axbp-ukGP4NggTNj5qfJXDloj5hDTISz4Ewpf8khc/s1600/favicon.png";
  head.appendChild(favicon);

  // --- FontAwesome JS ---
  const faJS = [
    "https://kit.fontawesome.com/d10173a287.js",
    "https://kit.fontawesome.com/14e69425b5.js"
  ];
  faJS.forEach(url => {
    const script = document.createElement("script");
    script.src = url;
    script.crossOrigin = "anonymous";
    script.defer = true;
    head.appendChild(script);
  });
}

// ===============================
// Evento principal após DOM carregado
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // --- Injetar assets no <head> ---
  addHeadAssets();

  // --- Carregar header e footer ---
  loadComponent("header", "/assets/header.html");
  loadComponent("footer", "/assets/footer.html");

// --- Forçar cache busting apenas no CSS e JS ---
document.querySelectorAll("link[rel='stylesheet'], script[src]").forEach(el => {
  const srcAttr = el.tagName === "LINK" ? "href" : "src";
  const original = el.getAttribute(srcAttr);
  if (original && !original.includes("?v=")) {
    el.setAttribute(srcAttr, versioned(original));
  }
});

