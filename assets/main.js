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

  // --- Reduzir texto em barras dos gráficos ---
  document.querySelectorAll(".grafico-comparacao-producoes .linha .espaco .barra").forEach(b => {
    let texto = b.textContent.trim();
    texto = texto.replace("ª Reapresentação", "ªR")
                 .replace("ª Temporada", "ªT");
    let [antes, depois] = texto.split(" - ");
    if (depois) {
      if (antes.length > 21) antes = antes.slice(0, 21) + "...";
      texto = antes + " - " + depois;
    } else {
      if (texto.length > 25) texto = texto.slice(0, 25) + "...";
    }
    b.textContent = texto;
  });

  // --- Disqus ---
  var disqus_config = function () {
    this.page.url = window.location.href;
    this.page.identifier = document.title;
  };
  (function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://audienciaon.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();

  // --- Favicon ---
  (function() {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'https://audienciaon.github.io/emissoras/aon.png';
    document.head.appendChild(link);
  })();

  // --- Carrossel da página inicial ---
  const user = "audienciaon"; 
  const repo = "blog"; 
  const branch = "main"; 
  const MAX_RENDER = 12; 
  const PLACEHOLDER = "https://via.placeholder.com/300x180?text=Sem+imagem"; 
  const arquivosIgnorados = [ "index.html", "pesquisa.html" ];

  async function carregarAtualizacoes() { 
    const container = document.getElementById("atualizacoes"); 
    if (!container) return;

    try { 
      const commitsURL = `https://api.github.com/repos/${user}/${repo}/commits?sha=${branch}&per_page=50`; 
      const res = await fetch(commitsURL); 
      const commits = await res.json(); 

      let files = []; 

      for (let commit of commits) { 
        const commitRes = await fetch(commit.url); 
        const commitData = await commitRes.json(); 

        commitData.files?.forEach(f => { 
          if (f.filename.endsWith(".html") && !arquivosIgnorados.includes(f.filename.split("/").pop()) && !f.filename.startsWith("assets") && !f.filename.startsWith("p")) { 
            files.push(f.filename); 
          } 
        }); 
      } 

      const uniqueFiles = [...new Set(files)].slice(0, MAX_RENDER); 

      await Promise.all(uniqueFiles.map(async (path) => { 
        const url = `https://${user}.github.io/${repo}/${path}`; 
        let img = PLACEHOLDER; 

        try { 
          const htmlRes = await fetch(url); 
          const htmlText = await htmlRes.text(); 
          const doc = new DOMParser().parseFromString(htmlText, "text/html"); 
          const imgEl = doc.querySelector(".publicacao img") || doc.querySelector("img"); 
          if (imgEl?.src) img = imgEl.src; 
        } catch {} 

        const div = document.createElement("div"); 
        div.className = "item"; 
        div.innerHTML = `<a href="${url}"><img src="${img}" alt="${path.split('/').pop()}" loading="lazy" /></a>`; 
        container.appendChild(div); 
      })); 

    } catch (e) { 
      console.error("Erro ao carregar atualizações", e); 
    } 
  } 

  setTimeout(() => carregarAtualizacoes(), 0);

});
