document.addEventListener("DOMContentLoaded", () => {
  const gallery = new MauGallery(".gallery", {
    columns: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 3,
      xl: 3,
    },
    lightBox: true,
    lightboxId: "myAwesomeLightbox",
    showTags: true,
    tagsPosition: "top",
  });

  // Affiche la galerie (remplace fadeIn)
  const galleryElement = document.querySelector(".gallery");
  if (galleryElement) {
    galleryElement.style.display = "grid"; // ou "flex" selon ton CSS
    galleryElement.style.opacity = 0;
    let opacity = 0;
    const fade = setInterval(() => {
      opacity += 0.05;
      galleryElement.style.opacity = opacity;
      if (opacity >= 1) clearInterval(fade);
    }, 25); // 25ms × 20 = ~0.5s pour imiter fadeIn(500)
  }
});
