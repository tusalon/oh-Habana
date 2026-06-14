const sections = [
  "Portada",
  "Info",
  "Entrantes",
  "Pastas",
  "Del mar",
  "Carnes",
  "Arroces",
  "Bar",
  "Cafes",
];
const totalPages = sections.length;
let currentPage = 1;

const pageStack = document.querySelector("#pageStack");
const pageNow = document.querySelector("#pageNow");
const pageTotal = document.querySelector("#pageTotal");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const thumbs = document.querySelector("#thumbs");
const assetVersion = "20260614-4";

pageTotal.textContent = String(totalPages);

function versioned(path) {
  return `${path}?v=${assetVersion}`;
}

function pagePath(page) {
  return versioned(`assets/pages/page-${String(page).padStart(2, "0")}.jpg`);
}

function thumbPath(page) {
  return versioned(`assets/thumbs/page-${String(page).padStart(2, "0")}.jpg`);
}

function renderPages() {
  for (let page = 1; page <= totalPages; page += 1) {
    const image = document.createElement("img");
    image.className = "menu-page";
    image.dataset.page = String(page);
    image.src = pagePath(page);
    image.alt = `${sections[page - 1]} - menu OH Habana`;
    image.loading = page === 1 ? "eager" : "lazy";
    image.decoding = "async";
    pageStack.append(image);
  }
}

function renderThumbs() {
  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement("button");
    button.className = "thumb";
    button.type = "button";
    button.dataset.page = String(page);
    button.setAttribute("aria-label", `Abrir ${sections[page - 1]}`);

    const image = document.createElement("img");
    image.src = thumbPath(page);
    image.alt = "";

    const label = document.createElement("span");
    label.textContent = sections[page - 1];

    button.append(image, label);
    button.addEventListener("click", () => setPage(page));
    thumbs.append(button);
  }
}

function setPage(page) {
  currentPage = Math.min(totalPages, Math.max(1, page));
  pageNow.textContent = String(currentPage);
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  document.querySelectorAll(".thumb").forEach((thumb) => {
    thumb.setAttribute("aria-current", thumb.dataset.page === String(currentPage) ? "true" : "false");
  });

  document.querySelectorAll(".menu-page").forEach((image) => {
    image.classList.toggle("is-active", image.dataset.page === String(currentPage));
  });
}

prevBtn.addEventListener("click", () => setPage(currentPage - 1));
nextBtn.addEventListener("click", () => setPage(currentPage + 1));

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") setPage(currentPage - 1);
  if (event.key === "ArrowRight") setPage(currentPage + 1);
});

renderPages();
renderThumbs();
setPage(1);
