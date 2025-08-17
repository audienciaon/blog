async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (el) {
    const resp = await fetch(file);
    el.innerHTML = await resp.text();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "/assets/header.html");
  loadComponent("footer", "/assets/footer.html");
});
