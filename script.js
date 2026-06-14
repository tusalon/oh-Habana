const totalPages = 9;
let currentPage = 1;

const pageImage = document.querySelector("#menuPage");
const pageNow = document.querySelector("#pageNow");
const pageTotal = document.querySelector("#pageTotal");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const thumbs = document.querySelector("#thumbs");

pageTotal.textContent = String(totalPages);

function pagePath(page) {
  return `assets/pages/page-${String(page).padStart(2, "0")}.jpg`;
}

function thumbPath(page) {
  return `assets/thumbs/page-${String(page).padStart(2, "0")}.jpg`;
}

function renderThumbs() {
  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement("button");
    button.className = "thumb";
    button.type = "button";
    button.dataset.page = String(page);
    button.setAttribute("aria-label", `Abrir página ${page}`);

    const image = document.createElement("img");
    image.src = thumbPath(page);
    image.alt = "";

    const label = document.createElement("span");
    label.textContent = `Página ${page}`;

    button.append(image, label);
    button.addEventListener("click", () => setPage(page));
    thumbs.append(button);
  }
}

function setPage(page) {
  currentPage = Math.min(totalPages, Math.max(1, page));
  pageImage.src = pagePath(currentPage);
  pageImage.alt = `Página ${currentPage} del menú OH Habana`;
  pageNow.textContent = String(currentPage);
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  document.querySelectorAll(".thumb").forEach((thumb) => {
    thumb.setAttribute("aria-current", thumb.dataset.page === String(currentPage) ? "true" : "false");
  });
}

prevBtn.addEventListener("click", () => setPage(currentPage - 1));
nextBtn.addEventListener("click", () => setPage(currentPage + 1));

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") setPage(currentPage - 1);
  if (event.key === "ArrowRight") setPage(currentPage + 1);
});

renderThumbs();
setPage(1);
