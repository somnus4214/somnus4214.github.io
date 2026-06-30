document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-query");
  const output = document.getElementById("search-results");
  if (!input || !output) return;

  const buildIndex = () => {
    if (!window.elasticlunr || !window.searchIndex) return null;
    return window.elasticlunr.Index.load(window.searchIndex);
  };

  const index = buildIndex();
  const docs = window.searchIndex?.documentStore?.docs || {};

  const snippet = (doc, term) => {
    const source = `${doc.description || ""} ${doc.body || ""}`.replace(/\s+/g, " ").trim();
    const at = source.toLocaleLowerCase().indexOf(term.toLocaleLowerCase());
    if (at < 0) return source.slice(0, 150);
    const start = Math.max(0, at - 56);
    return `${start > 0 ? "..." : ""}${source.slice(start, at + 120)}${at + 120 < source.length ? "..." : ""}`;
  };

  const render = () => {
    const term = input.value.trim();
    output.textContent = "";
    if (!term) return;

    if (!index) {
      output.textContent = "搜索索引还没有加载完成。";
      return;
    }

    const results = index.search(term, {
      fields: {
        title: { boost: 3 },
        description: { boost: 2 },
        body: { boost: 1 }
      },
      expand: true
    }).slice(0, 20);

    if (!results.length) {
      output.textContent = "没有找到结果。";
      return;
    }

    results.forEach((result) => {
      const doc = docs[result.ref];
      if (!doc) return;

      const item = document.createElement("article");
      item.className = "search-result";
      item.innerHTML = `
        <h2><a href="${result.ref}">${doc.title || result.ref}</a></h2>
        <p>${snippet(doc, term)}</p>
      `;
      output.appendChild(item);
    });
  };

  input.addEventListener("input", render);
});
