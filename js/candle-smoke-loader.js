(function () {
  const MOBILE_BREAKPOINT = 1100;
  const THREE_URL = "https://unpkg.com/three@0.128.0/build/three.min.js";
  const SMOKE_URL = "js/candle-smoke.js";

  let loading = false;
  let loaded = false;

  function shouldLoad() {
    return (
      document.getElementById("hero-candle-smoke") &&
      window.innerWidth > MOBILE_BREAKPOINT &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  }

  async function loadSmokeAssets() {
    if (loaded || loading || !shouldLoad()) return;

    loading = true;

    try {
      if (typeof THREE === "undefined") {
        await loadScript(THREE_URL);
      }

      if (!loaded) {
        await loadScript(SMOKE_URL);
        loaded = true;
      }
    } catch (error) {
      loading = false;
    }
  }

  function boot() {
    loadSmokeAssets();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener("resize", () => {
    if (!loaded && !loading) {
      loadSmokeAssets();
    }
  });
})();
