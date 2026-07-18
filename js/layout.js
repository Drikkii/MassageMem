(function () {
  function resolveAssetUrl(path) {
    const base = window.SITE.getBasePath();
    const rootPath = base.endsWith("/") ? base : `${base}/`;
    return `${rootPath}${path.replace(/^\//, "")}`;
  }

  function applySiteLinks(root) {
    root.querySelectorAll("[data-site-link]").forEach((link) => {
      const routeKey = link.getAttribute("data-site-link");
      if (!routeKey) return;

      if (routeKey === "booking" && window.SITE.booking?.url) {
        link.href = window.SITE.booking.url;
        return;
      }

      link.href = window.SITE.pageUrl(routeKey);
    });
  }

  function loadDikidiWidget() {
    const scriptUrl = window.SITE.booking?.scriptUrl;
    if (!scriptUrl || document.querySelector("[data-dikidi-widget]")) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptUrl;
    script.dataset.dikidiWidget = "true";
    script.async = true;
    document.body.appendChild(script);
  }

  function applyActivePage(root) {
    const currentPage = document.body.dataset.page || "home";

    root.querySelectorAll("[data-site-link]").forEach((link) => {
      const routeKey = link.getAttribute("data-site-link");
      const isActive =
        routeKey === currentPage || (currentPage === "home" && routeKey === "about");

      link.classList.toggle("is-active", isActive);
    });
  }

  function setMeta(attr, key, value) {
    if (!value) return;

    let node = document.querySelector(`meta[${attr}="${key}"]`);
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute(attr, key);
      document.head.appendChild(node);
    }

    node.setAttribute("content", value);
  }

  function setLink(rel, href, options = {}) {
    if (!href) return;

    let selector = `link[rel="${rel}"]`;
    if (options.sizes) {
      selector += `[sizes="${options.sizes}"]`;
    } else if (options.type) {
      selector += `[type="${options.type}"]`;
    }

    let node = document.querySelector(selector);
    if (!node) {
      node = document.createElement("link");
      node.rel = rel;
      document.head.appendChild(node);
    }

    node.href = href;
    if (options.type) node.type = options.type;
    if (options.sizes) node.sizes = options.sizes;
    if (options.title) node.title = options.title;
  }

  function applyFaviconLinks() {
    const favicon = window.SITE.favicon;
    if (!favicon) return;

    const base = window.SITE.url.replace(/\/$/, "");
    const assetUrl = (path) => `${base}/${path.replace(/^\//, "")}`;

    document
      .querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
      .forEach((node) => node.remove());

    setLink("icon", assetUrl(favicon.ico), { type: "image/x-icon" });
    setLink("shortcut icon", assetUrl(favicon.ico), { type: "image/x-icon" });
    setLink("icon", assetUrl(favicon.png32), {
      type: "image/png",
      sizes: "32x32",
    });
    setLink("icon", assetUrl(favicon.png16), {
      type: "image/png",
      sizes: "16x16",
    });
    setLink("apple-touch-icon", assetUrl(favicon.apple), { sizes: "180x180" });
    setLink("manifest", assetUrl(favicon.manifest));
  }

  function applyJsonLd(pageKey, canonicalUrl, description) {
    document.getElementById("site-jsonld-boot")?.remove();

    const existing = document.getElementById("site-jsonld");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "site-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": window.SITE.buildPageSchemaGraph(pageKey, document.title, description),
    });
    document.head.appendChild(script);
  }

  function applyPageMeta() {
    const currentPage = document.body.dataset.page || "home";
    const route = window.SITE.routes[currentPage] || window.SITE.routes.home;
    const title = route.title || window.SITE.routes.home.title;
    const description = route.description || window.SITE.defaultDescription;
    const keywords =
      (window.SITE.getKeywords && window.SITE.getKeywords(currentPage)) ||
      route.keywords ||
      window.SITE.defaultKeywords;
    const canonicalUrl = window.SITE.getAbsoluteUrl(currentPage);
    const imageUrl = `${window.SITE.url}/${window.SITE.defaultImage}`;

    document.title = title;
    document.documentElement.lang = "ru";

    setMeta("name", "description", description);
    setMeta("name", "keywords", keywords);
    setMeta("name", "robots", "index, follow");
    setMeta("name", "author", window.SITE.name);
    setMeta("name", "geo.region", "RU-KGD");
    setMeta("name", "geo.placename", window.SITE.contacts.city);

    const geo = window.SITE.seo?.geo;
    if (geo) {
      setMeta("name", "geo.position", `${geo.latitude};${geo.longitude}`);
      setMeta("name", "ICBM", `${geo.latitude}, ${geo.longitude}`);
    }

    setMeta("name", "yandex-verification", window.SITE.seo?.yandexVerification);
    setMeta("name", "google-site-verification", window.SITE.seo?.googleVerification);

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", `${window.SITE.name} — массаж Калининград`);
    setMeta("property", "og:locale", window.SITE.locale);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", imageUrl);
    setMeta(
      "property",
      "og:image:alt",
      `${window.SITE.name} — профессиональный массаж в Калининграде`,
    );

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);

    setLink("canonical", canonicalUrl);
    setLink("sitemap", `${window.SITE.url.replace(/\/$/, "")}/sitemap.xml`, {
      type: "application/xml",
      title: "Sitemap",
    });
    applyFaviconLinks();
    applyJsonLd(currentPage, canonicalUrl, description);
  }

  function applyYear(root) {
    root.querySelectorAll("[data-site-year]").forEach((node) => {
      node.textContent = String(window.SITE.year);
    });
  }

  function applyCity(root) {
    if (!window.SITE?.contacts?.city) return;

    root.querySelectorAll("[data-site-city]").forEach((node) => {
      node.textContent = window.SITE.contacts.city;
    });
  }

  function applyAddress(root) {
    if (!window.SITE?.contacts?.address) return;

    root.querySelectorAll("[data-site-address]").forEach((node) => {
      node.textContent = window.SITE.contacts.address;
    });
  }

  function applyGithubCredit(root) {
    if (!window.SITE?.github) return;

    root.querySelectorAll("[data-site-github]").forEach((link) => {
      link.href = window.SITE.github;
      if (window.SITE.developer) {
        link.textContent = `made by ${window.SITE.developer}`;
      }
    });
  }

  function applyEmail(root) {
    const email = window.SITE?.contacts?.email;
    if (!email) return;

    root.querySelectorAll("[data-site-email]").forEach((node) => {
      node.textContent = email;
      const link = node.closest("a");
      if (link) {
        link.href = `mailto:${email}`;
      }
    });
  }

  function applyYandexMap(root) {
    if (!window.SITE?.yandex) return;

    root.querySelectorAll("[data-yandex-map]").forEach((frame) => {
      frame.src = window.SITE.yandex.mapEmbedUrl;
    });

    root.querySelectorAll("[data-yandex-reviews]").forEach((frame) => {
      if (window.SITE.yandex.reviewsEmbedUrl) {
        frame.src = window.SITE.yandex.reviewsEmbedUrl;
      }
    });

    root.querySelectorAll("[data-yandex-profile]").forEach((link) => {
      link.href = window.SITE.yandex.profileUrl;
    });
  }

  async function loadPartial(targetId, partialPath) {
    const target = document.getElementById(targetId);
    if (!target) return null;

    const response = await fetch(resolveAssetUrl(partialPath));
    if (!response.ok) {
      throw new Error(`Не удалось загрузить ${partialPath}`);
    }

    target.innerHTML = await response.text();
    return target;
  }

  async function initLayout() {
    const loaders = [
      loadPartial("site-header", "partials/header.html"),
      loadPartial("site-location", "partials/location.html"),
      loadPartial("site-footer", "partials/footer.html"),
    ];

    const [headerRoot, locationRoot, footerRoot] = await Promise.all(loaders);

    [headerRoot, locationRoot, footerRoot].forEach((root) => {
      if (!root) return;
      applySiteLinks(root);
      applyActivePage(root);
      applyYear(root);
      applyCity(root);
      applyAddress(root);
      applyGithubCredit(root);
      applyEmail(root);
      applyYandexMap(root);
    });

    applySiteLinks(document.body);
    applyCity(document.body);
    applyAddress(document.body);
    applyEmail(document.body);
    applyYandexMap(document.body);
    applyPageMeta();
    loadDikidiWidget();
    document.dispatchEvent(new CustomEvent("site:layout-ready"));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLayout().catch((error) => {
      console.error(error);
    });
  });
})();
