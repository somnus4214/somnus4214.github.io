(function () {
  "use strict";

  function getMermaidScriptUrl() {
    var baseMeta = document.querySelector('meta[name="base"]');
    var baseUrl = baseMeta && baseMeta.content ? baseMeta.content.replace(/\/$/, "") : "";
    return baseUrl + "/js/mermaid.js";
  }

  function normalizeMermaidBlocks() {
    var codeBlocks = document.querySelectorAll(
      'pre > code[data-lang="mermaid"], pre > code.language-mermaid, pre > code[class~="language-mermaid"]'
    );

    codeBlocks.forEach(function (code) {
      var pre = code.parentElement;
      if (!pre || pre.classList.contains("mermaid")) {
        return;
      }

      pre.className = "mermaid";
      pre.removeAttribute("style");
      pre.textContent = code.textContent;
    });
  }

  function loadMermaid() {
    return new Promise(function (resolve, reject) {
      if (window.mermaid) {
        resolve(window.mermaid);
        return;
      }

      var existing = document.querySelector('script[data-apollo-mermaid="true"]');
      if (existing) {
        existing.addEventListener("load", function () {
          resolve(window.mermaid);
        });
        existing.addEventListener("error", reject);
        return;
      }

      var script = document.createElement("script");
      script.src = getMermaidScriptUrl();
      script.defer = true;
      script.dataset.apolloMermaid = "true";
      script.addEventListener("load", function () {
        resolve(window.mermaid);
      });
      script.addEventListener("error", reject);
      document.head.appendChild(script);
    });
  }

  function renderMermaidBlocks() {
    normalizeMermaidBlocks();

    if (!document.querySelector(".mermaid")) {
      return;
    }

    loadMermaid()
      .then(function (mermaid) {
        if (mermaid && mermaid.run) {
          mermaid.run({ querySelector: ".mermaid" });
        }
      })
      .catch(function (error) {
        console.error("Failed to render Mermaid diagrams", error);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMermaidBlocks);
  } else {
    renderMermaidBlocks();
  }
})();
