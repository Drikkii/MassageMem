(function () {
  const analytics = window.SITE?.analytics;
  if (!analytics) return;

  function loadGoogleAnalytics(measurementId) {
    if (!measurementId || window.__siteGaLoaded) return;
    window.__siteGaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.siteAnalytics = "google";
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      send_page_view: true,
    });
  }

  function isHiddenMetrikaPixel(node) {
    return (
      node.tagName === "IMG" &&
      /\/watch\/\d+/.test(node.getAttribute("src") || "") &&
      (node.getAttribute("style") || "").includes("-9999")
    );
  }

  function suppressYandexMetrikaUi() {
    const selectors = [
      'a[href*="metrika.yandex.ru"]',
      'a[href*="metrika.yandex.com"]',
      'img[src*="informer.yandex.ru"]',
      'iframe[src*="metrika.yandex"]',
      '[class*="ym-informer"]',
      '[id*="ym-informer"]',
      '[class*="metrika-site"]',
      '[id*="metrika-site"]',
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        if (isHiddenMetrikaPixel(node)) return;
        node.remove();
      });
    });

    document.querySelectorAll("body > *").forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.dataset.siteAnalytics === "yandex-noscript") return;

      const html = node.outerHTML.slice(0, 4000);
      if (/dikidi/i.test(html)) return;

      const style = window.getComputedStyle(node);
      if (style.position !== "fixed" && style.position !== "sticky") return;

      const rect = node.getBoundingClientRect();
      const nearCorner =
        rect.bottom >= window.innerHeight - 140 && rect.right >= window.innerWidth - 140;

      if (!nearCorner || rect.width > 320 || rect.height > 320) return;
      if (!/metrika|informer|mc\.yandex|yandex\.ru\/stat/i.test(html)) return;

      node.remove();
    });
  }

  function watchYandexMetrikaUi() {
    suppressYandexMetrikaUi();

    if (window.__siteYmUiObserver) return;
    window.__siteYmUiObserver = new MutationObserver(() => {
      suppressYandexMetrikaUi();
    });
    window.__siteYmUiObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function loadYandexMetrika(counterId, options) {
    if (!counterId || window.__siteYmLoaded) return;
    window.__siteYmLoaded = true;

    window.ym =
      window.ym ||
      function ym() {
        (window.ym.a = window.ym.a || []).push(arguments);
      };
    window.ym.l = Date.now();

    const scriptUrl = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;
    let scriptExists = false;

    for (let index = 0; index < document.scripts.length; index += 1) {
      if (document.scripts[index].src === scriptUrl) {
        scriptExists = true;
        break;
      }
    }

    if (!scriptExists) {
      const script = document.createElement("script");
      script.async = true;
      script.src = scriptUrl;
      script.dataset.siteAnalytics = "yandex";
      document.head.appendChild(script);
    }

    if (options?.ecommerce === "dataLayer") {
      window.dataLayer = window.dataLayer || [];
    }

    const initOptions = {
      ssr: options?.ssr !== false,
      webvisor: options?.webvisor !== false,
      clickmap: options?.clickmap !== false,
      trackLinks: options?.trackLinks !== false,
      accurateTrackBounce: options?.accurateTrackBounce !== false,
      referrer: document.referrer,
      url: location.href,
    };

    if (options?.ecommerce) {
      initOptions.ecommerce = options.ecommerce;
    }

    window.ym(Number(counterId), "init", initOptions);

    const noscript = document.createElement("noscript");
    noscript.dataset.siteAnalytics = "yandex-noscript";
    noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${counterId}" style="position:absolute; left:-9999px;" alt="" /></div>`;
    document.body.appendChild(noscript);

    watchYandexMetrikaUi();
    window.setTimeout(suppressYandexMetrikaUi, 1000);
    window.setTimeout(suppressYandexMetrikaUi, 3000);
  }

  loadGoogleAnalytics(analytics.googleAnalyticsId);
  loadYandexMetrika(analytics.yandexMetrikaId, analytics.yandexMetrika);
})();
