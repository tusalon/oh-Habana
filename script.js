const totalPages = 9;
let currentPage = 1;

const pageImage = document.querySelector("#menuPage");
const pageNow = document.querySelector("#pageNow");
const pageTotal = document.querySelector("#pageTotal");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const thumbs = document.querySelector("#thumbs");
const assetVersion = "20260614-2";
const loadedPages = new Set();
let requestId = 0;

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

function renderThumbs() {
  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement("button");
    button.className = "thumb";
    button.type = "button";
    button.dataset.page = String(page);
    button.setAttribute("aria-label", `Abrir pagina ${page}`);

    const image = document.createElement("img");
    image.src = thumbPath(page);
    image.alt = "";

    const label = document.createElement("span");
    label.textContent = `Pagina ${page}`;

    button.append(image, label);
    button.addEventListener("click", () => setPage(page));
    thumbs.append(button);
  }
}

function updateControls() {
  pageNow.textContent = String(currentPage);
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  document.querySelectorAll(".thumb").forEach((thumb) => {
    thumb.setAttribute("aria-current", thumb.dataset.page === String(currentPage) ? "true" : "false");
  });
}

function setPage(page) {
  currentPage = Math.min(totalPages, Math.max(1, page));
  const nextPage = currentPage;
  const nextSrc = pagePath(nextPage);
  const thisRequest = requestId + 1;

  requestId = thisRequest;
  updateControls();
  pageImage.style.opacity = loadedPages.has(nextPage) ? "1" : "0.45";

  const nextImage = new Image();
  nextImage.onload = () => {
    if (thisRequest !== requestId) return;
    loadedPages.add(nextPage);
    pageImage.src = nextSrc;
    pageImage.alt = `Pagina ${nextPage} del menu OH Habana`;
    pageImage.style.opacity = "1";
  };
  nextImage.onerror = () => {
    if (thisRequest !== requestId) return;
    pageImage.style.opacity = "1";
  };
  nextImage.src = nextSrc;
}

prevBtn.addEventListener("click", () => setPage(currentPage - 1));
nextBtn.addEventListener("click", () => setPage(currentPage + 1));

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") setPage(currentPage - 1);
  if (event.key === "ArrowRight") setPage(currentPage + 1);
});

renderThumbs();
setPage(1);
