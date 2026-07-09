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
      link.href = window.SITE.pageUrl(routeKey);
    });
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

  function setLink(rel, href) {
    if (!href) return;

    let node = document.querySelector(`link[rel="${rel}"]`);
    if (!node) {
      node = document.createElement("link");
      node.rel = rel;
      document.head.appendChild(node);
    }

    node.href = href;
  }

  function applyJsonLd(pageKey, canonicalUrl, description) {
    const existing = document.getElementById("site-jsonld");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "site-jsonld";
    script.type = "application/ld+json";

    const graph = [
      {
        "@type": "WebSite",
        "@id": `${window.SITE.url}/#website`,
        url: `${window.SITE.url}/`,
        name: window.SITE.name,
        description: window.SITE.defaultDescription,
        inLanguage: "ru-RU",
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: document.title,
        description,
        isPartOf: { "@id": `${window.SITE.url}/#website` },
        inLanguage: "ru-RU",
      },
    ];

    if (pageKey === "home") {
      graph.push({
        "@type": ["Person", "HealthAndBeautyBusiness"],
        "@id": `${window.SITE.url}/#business`,
        name: window.SITE.name,
        description: window.SITE.defaultDescription,
        url: `${window.SITE.url}/`,
        image: `${window.SITE.url}/${window.SITE.defaultImage}`,
        telephone: window.SITE.contacts.phone,
        email: window.SITE.contacts.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: window.SITE.contacts.address,
          addressLocality: window.SITE.contacts.city,
          addressCountry: "RU",
        },
        areaServed: {
          "@type": "City",
          name: window.SITE.contacts.city,
        },
        sameAs: [window.SITE.contacts.telegram, window.SITE.yandex?.profileUrl].filter(Boolean),
      });
    }

    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });

    document.head.appendChild(script);
  }

  function applyPageMeta() {
    const currentPage = document.body.dataset.page || "home";
    const route = window.SITE.routes[currentPage] || window.SITE.routes.home;
    const title = route.title || window.SITE.routes.home.title;
    const description = route.description || window.SITE.defaultDescription;
    const keywords = route.keywords || window.SITE.defaultKeywords;
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

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", window.SITE.name);
    setMeta("property", "og:locale", window.SITE.locale);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", imageUrl);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);

    setLink("canonical", canonicalUrl);
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
      applyYandexMap(root);
    });

    applySiteLinks(document.body);
    applyCity(document.body);
    applyAddress(document.body);
    applyYandexMap(document.body);
    applyPageMeta();
    document.dispatchEvent(new CustomEvent("site:layout-ready"));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLayout().catch((error) => {
      console.error(error);
    });
  });
})();
