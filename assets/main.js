// ===============================
// Google Analytics GA4
// ===============================
(function() {
  // Cria o script do GA4 de forma assíncrona
  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-8PEB40B65W";
  document.head.appendChild(gaScript);

  // Inicializa o GA4
  const gaInit = document.createElement("script");
  gaInit.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-8PEB40B65W');
  `;
  document.head.appendChild(gaInit);
})();


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
loadComponent("header", "https://audienciaon.github.io/blog/assets/header.html");
loadComponent("footer", "https://audienciaon.github.io/blog/assets/footer.html");

// --- Forçar cache busting apenas no CSS e JS ---
document.querySelectorAll("link[rel='stylesheet'], script[src]").forEach(el => {
  const srcAttr = el.tagName === "LINK" ? "href" : "src";
  const original = el.getAttribute(srcAttr);
  if (original && !original.includes("?v=")) {
    el.setAttribute(srcAttr, versioned(original));
  }
});

 // ===============================
  // Plano de fundo desfocado
  // ===============================
  const applyBackgroundBlur = (selector) => {
    const imgEl = document.querySelector(selector);
    if (!imgEl || !imgEl.src) {
      console.warn("Imagem não encontrada, tentando novamente...");
      setTimeout(() => applyBackgroundBlur(selector), 300);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgEl.src;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.filter = "blur(300px)";
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

      const blurredDataURL = canvas.toDataURL("image/png");

      const html = document.documentElement;
      html.style.backgroundImage = `url(${blurredDataURL})`;
      html.style.backgroundSize = "cover";
      html.style.backgroundPosition = "center";
      html.style.backgroundRepeat = "no-repeat";

      console.log("Background desfocado aplicado.");
    };

    img.onerror = function () {
      console.warn("Falha ao carregar a imagem.");
    };
  };

  // Fundo da página principal
  applyBackgroundBlur(".cabecalho .informacoes .info2 img");

  // Fundo de páginas de horário
  if (window.location.pathname.includes("/p/")) {
    applyBackgroundBlur(".pagina-horario-noar .conteudo img");
  }
});


document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // Redirecionamento de links /search/
  // ===============================
  document.querySelectorAll("a[href*='/search/']").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();

      let href = this.getAttribute("href");

      // Remove domínio se for link absoluto
      if (href.startsWith("http")) {
        const url = new URL(href);
        href = url.pathname;
      }

      // Extrai a query após /search/
      const parts = href.split("/search/");
      if (parts.length < 2) return;
      const query = parts[1];

      // Redireciona para a página de pesquisa com query string
      const searchURL = "https://audienciaon.github.io/blog/pesquisa";
      const finalURL = `${searchURL}?q=${encodeURIComponent(query.replace(/\+/g, ' '))}`;
      window.location.href = finalURL;
    });
  });

  // ===============================
  // Preenchimento automático do input de pesquisa
  // ===============================
  if (window.location.pathname.includes("/blog/pesquisa")) {
    const params = new URLSearchParams(window.location.search);
    const searchInput = document.querySelector("input[type=text]");
    if (searchInput) searchInput.value = params.get("q") || "";
  }
});


