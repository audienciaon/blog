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

// --- Aplicar background desfocado ---
function applyBackgroundBlur(selector) {
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
    document.documentElement.style.backgroundImage = `url(${canvas.toDataURL("image/png")})`;
    document.documentElement.style.backgroundSize = "cover";
    document.documentElement.style.backgroundPosition = "center";
    document.documentElement.style.backgroundRepeat = "no-repeat";
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


  // --- Disqus (robusto, logs e observer) ---
  (function () {
    const DISQUS_SHORTNAME = 'audienciaon';
    const path = window.location.pathname || '';
    const isExcluded = () => {
      const p = path.toLowerCase();
      if (p === '/' || p === '/blog/') return true;
      if (p.endsWith('/index.html') || p.endsWith('index.html')) return true;
      if (p.endsWith('/pesquisa.html') || p.endsWith('pesquisa.html')) return true;
      return false;
    };

    if (isExcluded()) {
      console.log('Disqus: página excluída ->', path);
      return;
    }

    if (document.getElementById('disqus_thread')) {
      console.log('Disqus: já inserido, abortando');
      return;
    }

    if (!/^https?:/.test(location.protocol)) {
      console.warn('Disqus: protocolo não suportado:', location.protocol);
      return;
    }

    function createThreadAndLoad(targetEl) {
      if (!targetEl || document.getElementById('disqus_thread')) return false;
      const thread = document.createElement('div');
      thread.id = 'disqus_thread';
      targetEl.appendChild(thread);

      window.disqus_config = function () {
        this.page.url = window.location.href;
        this.page.identifier = window.location.pathname;
      };

      const d = document;
      const s = d.createElement('script');
      s.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
      s.async = true;
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);

      console.log('Disqus: script injetado em', targetEl);
      return true;
    }

    function tryInsertNow() {
      const publicacao = document.querySelector('.publicacao');
      const paginaInicial = document.querySelector('#paginainicial');

      if (publicacao) return createThreadAndLoad(publicacao);
      if (paginaInicial) return createThreadAndLoad(paginaInicial);
      return false;
    }

    if (tryInsertNow()) return;

    console.log('Disqus: alvo não encontrado — iniciando observer (20s timeout)...');
    const observer = new MutationObserver((muts, obs) => {
      if (tryInsertNow()) {
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      try { observer.disconnect(); } catch (e) {}
      if (!document.getElementById('disqus_thread')) {
        console.warn('Disqus: timeout - elemento alvo não apareceu em 20s');
      }
    }, 20000);
  })();


}); // fecha DOMContentLoaded