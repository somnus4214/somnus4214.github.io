(() => {
  const enhanceImages = () => {
    const images = Array.from(document.querySelectorAll(".body img"));

    images.forEach((image, index) => {
      if (image.dataset.somnusImageEnhanced === "true") return;
      image.dataset.somnusImageEnhanced = "true";

      if (!image.hasAttribute("loading")) {
        image.setAttribute("loading", index === 0 ? "eager" : "lazy");
      }

      if (!image.hasAttribute("decoding")) {
        image.setAttribute("decoding", "async");
      }

      if (!image.hasAttribute("fetchpriority")) {
        image.setAttribute("fetchpriority", index === 0 ? "high" : "low");
      }

      const parent = image.parentElement;
      if (!parent || parent.classList.contains("somnus-image-frame")) return;

      const frame = document.createElement("span");
      frame.className = "somnus-image-frame is-loading";
      parent.insertBefore(frame, image);
      frame.appendChild(image);

      const markLoaded = () => {
        frame.classList.remove("is-loading");
        frame.classList.add("is-loaded");
      };

      if (image.complete && image.naturalWidth > 0) {
        markLoaded();
      } else {
        image.addEventListener("load", markLoaded, { once: true });
        image.addEventListener("error", markLoaded, { once: true });
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceImages, { once: true });
  } else {
    enhanceImages();
  }
})();
