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
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans&display=swap",
    "https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap",
    "https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed&display=swap",
    "https://fonts.googleapis.com/css2?family=Fira+Sans+Extra+Condensed&display=swap",
    "https://fonts.googleapis.com/css2?family=Geist&display=swap",
    "https://fonts.googleapis.com/css2?family=Fraunces&display=swap",
    "https://fonts.googleapis.com/css2?family=Radio+Canada+Big&display=swap"
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

  // --- Aplicar background desfocado ---
  const applyBackgroundBlur = selector => {
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
      ctx.filter = "blur(300px)";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      document.documentElement.style.backgroundImage = `url(${canvas.toDataURL("image/png")})`;
      document.documentElement.style.backgroundSize = "cover";
      document.documentElement.style.backgroundPosition = "center";
      document.documentElement.style.backgroundRepeat = "no-repeat";
    };
  };

  applyBackgroundBlur(".cabecalho .informacoes .info2 img");
  if (window.location.pathname.includes("/p/")) {
    applyBackgroundBlur(".pagina-horario-noar .conteudo img");
  }

  // --- Setas das outras páginas ---
  const container = document.querySelector('.outraspaginas');
  if (container) {
    let btnLeft = document.querySelector('.arrow-left');
    let btnRight = document.querySelector('.arrow-right');
    const criarBotao = (classe, texto) => {
      const btn = document.createElement('button');
      btn.className = `arrow ${classe}`;
      btn.textContent = texto;
      btn.type = "button";
      container.parentNode.insertBefore(btn, classe === 'arrow-left' ? container : container.nextSibling);
      return btn;
    };
    if (!btnLeft) btnLeft = criarBotao('arrow-left', '❮');
    if (!btnRight) btnRight = criarBotao('arrow-right', '❯');
    const gap = 20; 
    const item = container.querySelector('a');
    const scrollAmount = item ? (item.offsetWidth + gap) * 3 : 200;
    btnLeft.addEventListener('click', () => container.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    btnRight.addEventListener('click', () => container.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
  }

});
