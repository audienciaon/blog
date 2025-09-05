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
      next.addEventListener('click', () => carrossel.scrollBy({ left: 300, behavior: 'smooth' }));
      prev.addEventListener('click', () => carrossel.scrollBy({ left: -300, behavior: 'smooth' }));
    }
  });

  // --- Carrossel da página inicial (últimas atualizações do GitHub) ---
  const user = "audienciaon"; 
  const repo = "blog"; 
  const branch = "main"; 
  const MAX_RENDER = 12; 
  const PLACEHOLDER = "https://via.placeholder.com/300x180?text=Sem+imagem"; 
  const arquivosIgnorados = ["index.html","pesquisa.html"];

  async function carregarAtualizacoes() {
    const container = document.querySelector('.producoesnoar');
    if (!container) return;
    container.innerHTML = "";

    try {
      const commitsRes = await fetch(`https://api.github.com/repos/${user}/${repo}/commits?sha=${branch}&per_page=50`);
      const commits = await commitsRes.json();

      const files = [];
      const seen = new Set();

      for (let i=0;i<commits.length && files.length<MAX_RENDER*3;i++){
        const c = commits[i];
        try {
          const commitRes = await fetch(c.url);
          const commitData = await commitRes.json();
          (commitData.files||[]).forEach(f=>{
            const filename = f.filename;
            const base = filename.split("/").pop();
            if (!filename.endsWith(".html")) return;
            if (arquivosIgnorados.includes(base)) return;
            const firstPart = filename.split("/")[0];
            if (firstPart==="assets" || firstPart==="p") return;
            if (!seen.has(filename)) { seen.add(filename); files.push(filename); }
          });
        } catch {}
      }

      const uniqueFiles = files.slice(0, MAX_RENDER);

      for(const path of uniqueFiles){
        const pageUrl = `https://${user}.github.io/${repo}/${path}`;
        let imgSrc = PLACEHOLDER;

        try{
          const htmlRes = await fetch(pageUrl);
          if(htmlRes.ok){
            const htmlText = await htmlRes.text();
            const doc = new DOMParser().parseFromString(htmlText,"text/html");
            const imgEl = doc.querySelector(".publicacao img") || doc.querySelector("img");
            if(imgEl?.src) imgSrc = new URL(imgEl.src,pageUrl).href;
          }
        }catch{}

        const div = document.createElement("div");
        div.className = "item";

        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = path.split('/').pop();
        img.loading = "lazy";
        img.onerror = () => substituirImagem(img);

        const a = document.createElement("a");
        a.href = pageUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.appendChild(img);

        div.appendChild(a);

        // só adiciona ao container depois que a imagem carregar
        if (img.complete) {
          container.appendChild(div);
        } else {
          img.addEventListener("load", ()=>container.appendChild(div));
        }
      }

    } catch(e){ console.error("Erro ao carregar atualizações",e);}
  }

  carregarAtualizacoes();

});
