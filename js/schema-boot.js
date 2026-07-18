(function () {
  const pageKey = document.body?.dataset?.page || "home";
  if (!window.SITE?.buildPageSchemaGraph) return;

  document.getElementById("site-jsonld-boot")?.remove();

  const route = window.SITE.routes[pageKey] || window.SITE.routes.home;
  const script = document.createElement("script");
  script.id = "site-jsonld-boot";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": window.SITE.buildPageSchemaGraph(
      pageKey,
      route.title,
      route.description,
    ),
  });
  document.head.appendChild(script);
})();
