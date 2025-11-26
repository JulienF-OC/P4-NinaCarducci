class MauGallery {
  constructor(selector, options = {}) {
    this.options = Object.assign(
      {
        columns: 3,
        lightBox: true,
        lightboxId: null,
        showTags: true,
        tagsPosition: "bottom",
        navigation: true,
      },
      options
    );

    this.gallery = document.querySelector(selector);
    if (!this.gallery) return;

    this.tagsCollection = [];
    this.init();
  }

  init() {
    this.createRowWrapper();
    this.wrapImages();
    if (this.options.showTags) this.showTags();
    if (this.options.lightBox) this.createLightBox();
    this.addListeners();
    this.fadeInGallery();
  }

  createRowWrapper() {
    if (!this.gallery.querySelector(".gallery-items-row")) {
      const row = document.createElement("div");
      row.className = "gallery-items-row row";
      this.gallery.appendChild(row);
    }
  }

  wrapImages() {
    const images = this.gallery.querySelectorAll(".gallery-item");
    images.forEach((img) => {
      // Wrap in column
      const colDiv = document.createElement("div");
      colDiv.className = "item-column mb-4";

      // Bootstrap responsive columns
      if (typeof this.options.columns === "number") {
        colDiv.classList.add(`col-${Math.ceil(12 / this.options.columns)}`);
      } else {
        if (this.options.columns.xs)
          colDiv.classList.add(
            `col-${Math.ceil(12 / this.options.columns.xs)}`
          );
        if (this.options.columns.sm)
          colDiv.classList.add(
            `col-sm-${Math.ceil(12 / this.options.columns.sm)}`
          );
        if (this.options.columns.md)
          colDiv.classList.add(
            `col-md-${Math.ceil(12 / this.options.columns.md)}`
          );
        if (this.options.columns.lg)
          colDiv.classList.add(
            `col-lg-${Math.ceil(12 / this.options.columns.lg)}`
          );
        if (this.options.columns.xl)
          colDiv.classList.add(
            `col-xl-${Math.ceil(12 / this.options.columns.xl)}`
          );
      }

      // Append image to column and column to row
      colDiv.appendChild(img);
      this.gallery.querySelector(".gallery-items-row").appendChild(colDiv);

      // Collect tags
      const tag = img.dataset.galleryTag;
      if (tag && !this.tagsCollection.includes(tag)) {
        this.tagsCollection.push(tag);
      }

      img.classList.add("img-fluid"); // responsive
    });
  }

  showTags() {
    const ul = document.createElement("ul");
    ul.className = "my-4 tags-bar nav nav-pills";
    ul.innerHTML = `<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>`;
    this.tagsCollection.forEach((tag) => {
      const li = document.createElement("li");
      li.className = "nav-item";
      li.innerHTML = `<span class="nav-link" data-images-toggle="${tag}">${tag}</span>`;
      ul.appendChild(li);
    });
    if (this.options.tagsPosition === "top") {
      this.gallery.prepend(ul);
    } else {
      this.gallery.appendChild(ul);
    }
  }

  createLightBox() {
    const lightboxId = this.options.lightboxId || "galleryLightbox";
    const div = document.createElement("div");
    div.className = "modal fade";
    div.id = lightboxId;
    div.tabIndex = -1;
    div.setAttribute("role", "dialog");
    div.setAttribute("aria-hidden", "true");
    div.innerHTML = `
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body position-relative text-center">
            ${
              this.options.navigation
                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;font-size:24px;display:flex;align-items:center;justify-content:center;">&lt;</div>'
                : ""
            }
            <img class="lightboxImage img-fluid" alt="Image de la lightbox" />
            ${
              this.options.navigation
                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;font-size:24px;display:flex;align-items:center;justify-content:center;">&gt;</div>'
                : ""
            }
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(div);
    this.lightbox = div;
  }

  addListeners() {
    // Tags filtering
    const tagSpans = this.gallery.querySelectorAll(".tags-bar .nav-link");
    tagSpans.forEach((span) => {
      span.addEventListener("click", () => this.filterByTag(span));
    });

    // Lightbox open
    const images = this.gallery.querySelectorAll(".gallery-item");
    images.forEach((img) => {
      img.addEventListener("click", () => this.openLightBox(img));
    });

    if (this.options.navigation) {
      const prev = this.lightbox.querySelector(".mg-prev");
      const next = this.lightbox.querySelector(".mg-next");
      prev && prev.addEventListener("click", () => this.prevImage());
      next && next.addEventListener("click", () => this.nextImage());
    }
  }

  filterByTag(span) {
    const tag = span.dataset.imagesToggle;
    const siblings =
      span.parentElement.parentElement.querySelectorAll(".nav-link");
    siblings.forEach((s) => s.classList.remove("active", "active-tag"));
    span.classList.add("active", "active-tag");

    const items = this.gallery.querySelectorAll(".item-column");
    items.forEach((col) => {
      const img = col.querySelector(".gallery-item");
      if (tag === "all" || img.dataset.galleryTag === tag) {
        col.style.display = "block";
      } else {
        col.style.display = "none";
      }
    });
  }

  fadeInGallery() {
    this.gallery.style.display = "grid"; // ou "flex"
    this.gallery.style.opacity = 0;
    let opacity = 0;
    const interval = setInterval(() => {
      opacity += 0.05;
      this.gallery.style.opacity = opacity;
      if (opacity >= 1) clearInterval(interval);
    }, 25);
  }

  openLightBox(img) {
    const lightboxImg = this.lightbox.querySelector(".lightboxImage");
    lightboxImg.src = img.src;
    bootstrap.Modal.getOrCreateInstance(this.lightbox).show();
  }

  prevImage() {
    this.navigateImage(-1);
  }
  nextImage() {
    this.navigateImage(1);
  }

  navigateImage(step) {
    const lightboxImg = this.lightbox.querySelector(".lightboxImage");
    const activeTag = this.gallery.querySelector(".tags-bar .active-tag")
      .dataset.imagesToggle;
    const visibleImages = Array.from(
      this.gallery.querySelectorAll(".gallery-item")
    ).filter(
      (img) => activeTag === "all" || img.dataset.galleryTag === activeTag
    );

    const index = visibleImages.findIndex((img) => img.src === lightboxImg.src);
    let nextIndex =
      (index + step + visibleImages.length) % visibleImages.length;
    lightboxImg.src = visibleImages[nextIndex].src;
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  new MauGallery(".gallery", {
    columns: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
    lightBox: true,
    lightboxId: "myAwesomeLightbox",
    showTags: true,
    tagsPosition: "top",
  });
});
