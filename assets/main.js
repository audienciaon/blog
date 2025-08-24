(function () {
  const head = document.head || document.getElementsByTagName("head")[0];

  function addLink(href) {
    if (![...head.querySelectorAll("link")].some(l => l.href === href)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      head.appendChild(link);
    }
  }

  const googleFonts = [
    "https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100..900;1,100..900&display=swap",
    "https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:ital,wght@0,100..900;1,100..900&display=swap",
    "https://fonts.googleapis.com/css2?family=Fira+Sans+Extra+Condensed:ital,wght@0,100..900;1,100..900&display=swap",
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,100..900;1,100..900&display=swap"
  ];

  googleFonts.forEach(addLink);
})();










// ===============================
// Injeta CSS, Google Fonts, favicon e FontAwesome no <head>
// com verificação de carregamento das fontes
// ===============================
(function () {
  function ensureLink({ rel, href, attrs = {} }) {
    const head = document.head || document.getElementsByTagName("head")[0];
    if (!head) return null;

    // Evita duplicatas pelo href+rel
    const exists = [...head.querySelectorAll(`link[rel="${rel}"]`)]
      .some(l => l.href === href);
    if (exists) return null;

    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    Object.entries(attrs).forEach(([k, v]) => (link[k] = v));
    head.appendChild(link);
    return link;
  }

  function ensureScript(src) {
    const head = document.head || document.getElementsByTagName("head")[0];
    if (!head) return null;
    if ([...head.querySelectorAll("script")].some(s => s.src === src)) return null;
    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.defer = true;
    head.appendChild(script);
    return script;
  }

  function addHeadAssets() {
    // --- FontAwesome CSS ---
    ensureLink({
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css"
    });

    // --- Preconnect para Google Fonts ---
    ensureLink({ rel: "preconnect", href: "https://fonts.googleapis.com" });
    ensureLink({
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      attrs: { crossOrigin: "anonymous" }
    });

    // --- Google Fonts (apenas URLs CSS válidas) ---
    const fontEntries = [
      { name: "Fira Sans", url: "https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Fira Sans Condensed", url: "https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Fira Sans Extra Condensed", url: "https://fonts.googleapis.com/css2?family=Fira+Sans+Extra+Condensed:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Archivo", url: "https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Archivo Narrow", url: "https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Asap", url: "https://fonts.googleapis.com/css2?family=Asap:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Asap Condensed", url: "https://fonts.googleapis.com/css2?family=Asap+Condensed:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Space Grotesk", url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Plus Jakarta Sans", url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Sofia Sans", url: "https://fonts.googleapis.com/css2?family=Sofia+Sans:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Sofia Sans Condensed", url: "https://fonts.googleapis.com/css2?family=Sofia+Sans+Condensed:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Sofia Sans Extra Condensed", url: "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Sofia Sans Semi Condensed", url: "https://fonts.googleapis.com/css2?family=Sofia+Sans+Semi+Condensed:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Fraunces", url: "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Radio Canada Big", url: "https://fonts.googleapis.com/css2?family=Radio+Canada+Big:ital,wght@0,100..900;1,100..900&display=swap" },
      { name: "Geist", url: "https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&display=swap" }
    ];

    fontEntries.forEach(f => ensureLink({ rel: "stylesheet", href: f.url }));

    // --- Favicon ---
    ensureLink({
      rel: "icon",
      href: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9tj8z8mRqNsuuTEB6c8y4amv89AfM6AlyEZhxG_f-4vPqhkCfa_YsjxKpnbxVPal0hPYTivPgrM2JNp5rxAkK38Nb2jwUJK4sup-TdHItNfGHrrEHZ0764ppYgCqynkIE66Z4Pq9uD2btQ3l4Q2axbp-ukGP4NggTNj5qfJXDloj5hDTISz4Ewpf8khc/s1600/favicon.png",
      attrs: { type: "image/png" }
    });

    // --- FontAwesome JS (se necessário) ---
    ["https://kit.fontawesome.com/d10173a287.js",
     "https://kit.fontawesome.com/14e69425b5.js"].forEach(ensureScript);

    // --- Verificação de carregamento das fontes (opcional, mas útil p/ debug) ---
    if (document.fonts && document.fonts.load) {
      const checks = fontEntries.map(f => document.fonts.load(`1em "${f.name}"`));
      Promise.allSettled(checks).then(results => {
        const failed = results
          .map((r, i) => (r.status === "fulfilled" ? null : fontEntries[i].name))
          .filter(Boolean);
        if (failed.length) {
          console.warn("[Fonts] Falharam ao carregar:", failed);
        } else {
          console.info("[Fonts] Todas carregadas.");
        }
        document.documentElement.classList.add("fonts-ready");
      });
    }
  }

  // Executa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addHeadAssets, { once: true });
  } else {
    addHeadAssets();
  }
})();















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





  // ===============================
  // Setas dos outraspaginas 
  // ===============================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.outraspaginas');
  if (!container) return;

  let btnLeft = document.querySelector('.arrow-left');
  let btnRight = document.querySelector('.arrow-right');

  // cria botão se não existir
  const criarBotao = (classe, texto) => {
    const btn = document.createElement('button');
    btn.className = `arrow ${classe}`;
    btn.textContent = texto;
    btn.type = "button";
    container.parentNode.insertBefore(btn, 
      classe === 'arrow-left' ? container : container.nextSibling);
    return btn;
  };

  if (!btnLeft) btnLeft = criarBotao('arrow-left', '❮');
  if (!btnRight) btnRight = criarBotao('arrow-right', '❯');

  const gap = 20; 
  const item = container.querySelector('a');
  const itemWidth = item ? item.offsetWidth + gap : 200; // fallback
  const scrollAmount = itemWidth * 3;

  btnLeft.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  btnRight.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
});
