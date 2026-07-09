(function () {
  const header = document.querySelector(".header");
  const experienceItems = document.querySelectorAll(".experience-item");
  const heroContent = document.querySelector(".hero-content");
  const heroPhoto = document.querySelector(".hero-photo");
  const maxLink = document.querySelector("[data-max-link]");

  const CONTACTS = {
    phone: "+79182859762",
    telegram: "https://t.me/+79182859762",
    max: "https://max.ru/u/f9LHodD0cOLo2NtgSTw4LF1wSlZf-BcsgWfnTfkEkZUt6sDx6EYAVwN54SU",
  };

  function initContactLinks() {
    const phoneLink = document.querySelector(".header-phone");
    const telegramLink = document.querySelector(".header-contacts .social-link:not(.social-link--max)");

    if (phoneLink) {
      phoneLink.href = `tel:${CONTACTS.phone}`;
    }

    if (telegramLink) {
      telegramLink.href = CONTACTS.telegram;
    }

    if (maxLink && CONTACTS.max) {
      maxLink.href = CONTACTS.max;
    }
  }

  const HERO_PHOTO_HEIGHT_RATIO = 0.85;

  function syncHeroPhotoHeight() {
    if (!heroContent || !heroPhoto || window.innerWidth <= 980) {
      if (heroPhoto) heroPhoto.style.height = "";
      return;
    }

    heroPhoto.style.height = `${Math.round(heroContent.offsetHeight * HERO_PHOTO_HEIGHT_RATIO)}px`;
  }

  function initHeroPhotoHeight() {
    if (!heroContent || !heroPhoto) return;

    syncHeroPhotoHeight();
    window.addEventListener("resize", syncHeroPhotoHeight);
    window.addEventListener("load", syncHeroPhotoHeight);

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(syncHeroPhotoHeight);
      observer.observe(heroContent);
    }
  }

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    }
  }

  function initScrollReveal() {
    if (!experienceItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    experienceItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.08}s`;
      observer.observe(item);
    });
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  initContactLinks();
  initHeroPhotoHeight();
  initScrollReveal();
  initSmoothAnchors();
})();
