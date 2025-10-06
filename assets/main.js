document.addEventListener("DOMContentLoaded", async () => {

  // --- Google Analytics GA4 ---
  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-8PEB40B65W";
  document.head.appendChild(gaScript);

  gaScript.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-8PEB40B65W');
  };

  // --- Versionamento ---
  const versioned = file => file + "?v=" + new Date().toISOString().split("T")[0];

  // --- Carrega componentes ---
  async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const resp = await fetch(versioned(file));
      if (!resp.ok) throw new Error(`Erro ao carregar ${file}`);
      el.innerHTML = await resp.text();
    } catch (err) {
      console.error(err);
      el.innerHTML = `<div style="color:red;font-size:14px">Falha ao carregar <strong>${file}</strong></div>`;
    }
  }

  await loadComponent("header", "https://audienciaon.github.io/blog/assets/header.html");
  await loadComponent("footer", "https://audienciaon.github.io/blog/assets/footer.html");

  // --- Carrega fontes e CSS ---
  const head = document.head;
  const fontsCSS = [
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@100;200;300;400;500;600;700;800;900&display=block",
    "https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;200;300;400;500;600;700;800;900&display=block",
    "https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:wght@100;200;300;400;500;600;700;800;900&display=block",
    "https://fonts.googleapis.com/css2?family=Fira+Sans+Extra+Condensed:wght@100;200;300;400;500;600;700;800;900&display=block",
    "https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=block",
    "https://fonts.googleapis.com/css2?family=Fraunces:wght@100;200;300;400;500;600;700;800;900&display=block",
    "https://fonts.googleapis.com/css2?family=Radio+Canada+Big:wght@100;200;300;400;500;600;700;800;900&display=block"
  ];
  fontsCSS.forEach(url => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    head.appendChild(link);
  });

  const faCSS = document.createElement("link");
  faCSS.rel = "stylesheet";
  faCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css";
  head.appendChild(faCSS);

  // --- Redirecionamento de links /search/ ---
  document.querySelectorAll("a[href*='/search/']").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const href = new URL(link.href, window.location.origin).pathname.split("/search/")[1];
      if (!href) return;
      const finalURL = `/blog/pesquisa?q=${encodeURIComponent(href.replace(/\+/g,' '))}`;
      window.location.href = finalURL;
    });
  });

  // --- Bloqueia até fontes carregarem ---
  document.fonts.ready.then(() => {
    document.documentElement.classList.add("fonts-loaded");
  });

  // --- Substituir imagens com erro ---
  const FALLBACK = "https://audienciaon.github.io/capas/adefinir.png";
  function substituirImagem(img) {
    img.onerror = null;
    img.src = FALLBACK + "?cb=" + Date.now();
  }


  




// --- Aplicar background desfocado com fade de 4s sem piscar ---
function applyBackgroundBlur(selector, duration = 4000) {
  const imgEl = document.querySelector(selector);
  if (!imgEl) return;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgEl.src;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    ctx.filter = "blur(300px) brightness(0.8) saturate(2)";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const bgUrl = `url(${canvas.toDataURL("image/png")})`;

    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      backgroundImage: bgUrl,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      opacity: "0",
      transition: `opacity ${duration/1000}s ease`,
      pointerEvents: "none",
      zIndex: "-1"
    });

    document.body.appendChild(overlay);

    // dispara o fade in
    requestAnimationFrame(() => overlay.style.opacity = "1");
  };
}


  


// Sempre aplica para o cabeçalho
applyBackgroundBlur(".cabecalho .informacoes .info2 img");

// Aplica para páginas /p/, exceto /p/pesquisa e index
if (
  !window.location.pathname.includes("pesquisa.html") &&
  !window.location.pathname.endsWith("index.html") &&
  window.location.href !== "https://audienciaon.github.io/blog/"
) {
  applyBackgroundBlur(".pagina-horario-noar .conteudo img");
}


  // --- Inicializa todos os carrosséis ---
  const carrosselWrappers = document.querySelectorAll('.producoesnoar-wrapper');
  carrosselWrappers.forEach(wrapper => {
    const carrossel = wrapper.querySelector('.producoesnoar');
    const next = wrapper.querySelector('.next');
    const prev = wrapper.querySelector('.prev');
    if (next && prev && carrossel) {
      next.addEventListener('click', () =>
        carrossel.scrollBy({ left: 300, behavior: 'smooth' })
      );
      prev.addEventListener('click', () =>
        carrossel.scrollBy({ left: -300, behavior: 'smooth' })
      );
    }
  });

  carregarAtualizacoes();

  // --- Scroll interno do segundo elemento de <main> ---
  const mainSecond = document.querySelector("main > :nth-child(2)");
  if (mainSecond) {
    mainSecond.style.overflow = "auto";
    mainSecond.style.maxHeight = "80vh";
  }

  // --- Scroll interno do segundo elemento de <main> (ajustado) ---
  (function () {
    const debounce = (fn, wait = 80) => {
      let t;
      return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
    };

    function setupMainSecond() {
      const main = document.querySelector("main");
      if (!main) return false;
      const elementos = Array.from(main.children).filter(n => n.nodeType === 1);
      const mainSecond = elementos[1];
      if (!mainSecond) return false;

      mainSecond.style.overflowY = "auto";
      mainSecond.style.overflowX = "hidden";
      mainSecond.style.webkitOverflowScrolling = "touch";

      function ajustarAltura() {
        const rect = mainSecond.getBoundingClientRect();
        const top = rect.top;
        const bottomOffset = 18; // folga do rodapé
        const max = Math.max(120, Math.floor(window.innerHeight - top - bottomOffset));
        mainSecond.style.maxHeight = max + "px";
      }

      ajustarAltura();
      window.addEventListener("resize", debounce(ajustarAltura, 60));
      return true;
    }

    if (!setupMainSecond()) {
      const obs = new MutationObserver((muts, o) => {
        if (setupMainSecond()) o.disconnect();
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  })();

  (function () {
  function ajustarTextosDasBarras() {
    const barras = document.querySelectorAll(".grafico-comparacao .linha .espaco .barra");
    if (!barras.length) return;

    barras.forEach(b => {
      if (!b.dataset.origText) b.dataset.origText = b.textContent.trim();

      let raw = b.dataset.origText.replace(/\s+/g, " ").trim();
      raw = raw.replace(/ª\s*reapresenta/gi, "ªR")
               .replace(/ª\s*temporad/gi, "ªT");

      const parts = raw.split(/\s*[-–—]\s*/);
      let antes = parts.shift() || "";
      const depois = parts.length ? parts.join(" - ") : "";

      if (depois) {
        if (antes.length > 21) antes = antes.slice(0, 21) + "...";
        raw = antes + " - " + depois;
      } else {
        if (raw.length > 25) raw = raw.slice(0, 25) + "...";
      }

      b.textContent = raw;
    });
  }

  // roda após carregar a página
  window.addEventListener("load", ajustarTextosDasBarras);

  // observa mudanças na página
  const observer = new MutationObserver(() => ajustarTextosDasBarras());
  observer.observe(document.body, { childList: true, subtree: true });
})();


    // --- Lazy load resultados ---
  const container = document.querySelector(".pagina-pesquisa .resultados");
  if (container) {
    const totalItens = 10000;
    const lote = 40;
    const passo = 20;
    let carregados = 0;

    function criarItem(i) {
      const item = document.createElement("div");
      item.className = "item";
      item.textContent = "Item " + i;
      return item;
    }

    function carregarMais(qtd) {
      const limite = Math.min(carregados + qtd, totalItens);
      for (let i = carregados; i < limite; i++) {
        container.appendChild(criarItem(i + 1));
      }
      carregados = limite;
    }

    carregarMais(lote);

    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        carregarMais(passo);
      }
    });
  }



  // --- Drag to scroll no segundo elemento de <main> ---
  const mainSecondDrag = document.querySelector("main > :nth-child(2)");
  if (mainSecondDrag) {
    let isDown = false;
    let startY;
    let scrollTop;

    mainSecondDrag.addEventListener("mousedown", e => {
      isDown = true;
      startY = e.pageY - mainSecondDrag.offsetTop;
      scrollTop = mainSecondDrag.scrollTop;
      mainSecondDrag.style.cursor = "grabbing";
      e.preventDefault();
    });

    window.addEventListener("mouseup", () => {
      isDown = false;
      if (mainSecondDrag) mainSecondDrag.style.cursor = "default";
    });

    mainSecondDrag.addEventListener("mousemove", e => {
      if (!isDown) return;
      const y = e.pageY - mainSecondDrag.offsetTop;
      const walk = (y - startY) * 1; // velocidade
      mainSecondDrag.scrollTop = scrollTop - walk;
    });
  }

  // --- Scroll global do mouse para o segundo elemento de <main> ---
  window.addEventListener("wheel", e => {
    if (!mainSecondDrag) return;
    if (window.innerWidth > 1000) { // desktop
      e.preventDefault();
      mainSecondDrag.scrollTop += e.deltaY;
    }
  }, { passive: false });


})