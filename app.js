const btns = document.querySelectorAll(".filter button");
const cards = document.querySelectorAll(".card");

btns.forEach((button) => {
  button.addEventListener("click", (e) => {
    // Retire l’active de TOUS les boutons du filtre uniquement
    btns.forEach((b) => b.classList.remove("active"));

    // Ajoute l’active sur celui cliqué
    e.currentTarget.classList.add("active");

    // Filtrage
    const filter = e.currentTarget.dataset.name;

    cards.forEach((card) => {
      if (filter === "tous" || card.dataset.name === filter) {
        card.classList.remove("hide");
      } else {
        card.classList.add("hide");
      }
    });
  });
});

const images = Array.from(document.querySelectorAll(".card img"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".close-lightbox");
const prevBtn = document.querySelector(".prev-lightbox");
const nextBtn = document.querySelector(".next-lightbox");

let currentIndex = 0;

images.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index;
    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
  });
});

closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
});

prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
});

nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex].src;
});

document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "Escape") closeBtn.click();
  }
});
