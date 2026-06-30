document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const scrollTop = document.querySelector(".scroll-top");

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem("somnus-theme", theme);
    if (themeToggle) themeToggle.textContent = theme === "dark" ? "☼" : "☾";
  };

  applyTheme(root.dataset.theme || "light");
  themeToggle?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  document.querySelectorAll("pre").forEach((pre) => {
    const code = pre.querySelector("code");
    const lang = code?.dataset.lang || "";

    if (lang === "mermaid") {
      pre.classList.add("mermaid");
      pre.textContent = code.textContent;
      return;
    }

    const shell = document.createElement("div");
    shell.className = "code-shell";
    pre.parentNode.insertBefore(shell, pre);
    shell.appendChild(pre);

    const button = document.createElement("button");
    button.className = "code-copy";
    button.type = "button";
    button.textContent = "复制";
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(code?.textContent || pre.textContent || "");
      button.textContent = "已复制";
      setTimeout(() => {
        button.textContent = "复制";
      }, 1400);
    });
    shell.appendChild(button);
  });

  const renderMermaid = () => {
    if (!window.mermaid || !document.querySelector(".mermaid")) return;
    window.mermaid.initialize({
      startOnLoad: false,
      theme: root.dataset.theme === "dark" ? "dark" : "default",
      securityLevel: "loose"
    });
    window.mermaid.run({ querySelector: ".mermaid" });
  };

  if (window.mermaid) {
    renderMermaid();
  } else {
    window.addEventListener("load", renderMermaid, { once: true });
  }

  const updateScroll = () => {
    scrollTop?.classList.toggle("is-visible", window.scrollY > 480);
  };
  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });
  scrollTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});
