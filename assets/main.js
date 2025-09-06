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
      ctx.filter = "blur(300px)";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      document.documentElement.style.backgroundImage = `url(${canvas.toDataURL("image/png")})`;
      document.documentElement.style.backgroundSize = "cover";
      document.documentElement.style.backgroundPosition = "center";
      document.documentElement.style.backgroundRepeat = "no-repeat";
    };
  }

  applyBackgroundBlur(".cabecalho .informacoes .info2 img");
  if (window.location.pathname.includes("/p/")) {
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
    mainSecond.style.maxHeight = "80vh"; // você pode ajustar
  }








  
  // --- Ajusta textos das barras ---
  document.querySelectorAll(".grafico-comparacao .linha .espaco .barra").forEach(b => {
    let texto = b.textContent.trim();

    // 1 - Substituições
    texto = texto.replace("ª Reapresentação", "ªR")
                 .replace("ª Temporada", "ªT");

    // 2 - Tratamento de corte
    let [antes, depois] = texto.split(" - ");
    if (depois) {
      if (antes.length > 21) antes = antes.slice(0, 21) + "...";
      texto = antes + " - " + depois;
    } else {
      if (texto.length > 25) texto = texto.slice(0, 25) + "...";
    }

    b.textContent = texto;
  });

}); // fecha apenas o DOMContentLoaded
