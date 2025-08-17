function versioned(file) {
  return file + "?v=" + new Date().getTime();
}

document.addEventListener("DOMContentLoaded", () => {
  // Carregar header e footer já com cache busting
  loadComponent("header", versioned("/assets/header.html"));
  loadComponent("footer", versioned("/assets/footer.html"));

  // Forçar CSS/JS a recarregar também
  document.querySelectorAll("link[rel='stylesheet'], script[src]").forEach(el => {
    const srcAttr = el.tagName === "LINK" ? "href" : "src";
    el.setAttribute(srcAttr, versioned(el.getAttribute(srcAttr)));
  });
});
