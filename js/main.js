(function () {
  function getContacts() {
    return window.SITE?.contacts || {
      phone: "+79182859762",
      telegram: "https://t.me/+79182859762",
      max: "https://max.ru/u/f9LHodD0cOLo2NtgSTw4LF1wSlZf-BcsgWfnTfkEkZUt6sDx6EYAVwN54SU",
      email: "mukhina.cosmo@mail.ru",
    };
  }

  function initContactLinks() {
    const contacts = getContacts();

    document.querySelectorAll(".header-phone, .footer-phone, .contacts-phone").forEach((phoneLink) => {
      phoneLink.href = `tel:${contacts.phone}`;
      if (contacts.phoneDisplay) {
        phoneLink.textContent = contacts.phoneDisplay;
      }
    });

    document.querySelectorAll(
      ".header-contacts .social-link:not(.social-link--max), .footer-telegram, .contacts-messenger:not([data-max-link])"
    ).forEach((telegramLink) => {
      telegramLink.href = contacts.telegram;
    });

    document.querySelectorAll("[data-max-link]").forEach((link) => {
      if (contacts.max) {
        link.href = contacts.max;
      }
    });

    document.querySelectorAll(".footer-email, .contacts-email").forEach((emailLink) => {
      if (contacts.email) {
        emailLink.href = `mailto:${contacts.email}`;
        emailLink.textContent = contacts.email;
      }
    });
  }

  function initHeaderContactsLayout() {
    const headerTop = document.querySelector(".header-top");
    const brand = document.querySelector(".brand--header");
    const contacts = document.querySelector(".header-top .header-contacts");
    const mobileBreakpoint = 980;
    const gap = 8;

    if (!headerTop || !brand || !contacts) return;

    function updateLayout() {
      if (window.innerWidth > mobileBreakpoint) {
        headerTop.classList.remove("is-contacts-inline");
        return;
      }

      headerTop.classList.add("is-contacts-inline");

      requestAnimationFrame(() => {
        if (window.innerWidth > mobileBreakpoint) return;

        const brandRect = brand.getBoundingClientRect();
        const contactsRect = contacts.getBoundingClientRect();
        const overlaps = contactsRect.left < brandRect.right + gap;

        headerTop.classList.toggle("is-contacts-inline", !overlaps);
      });
    }

    updateLayout();
    window.addEventListener("resize", updateLayout);
    window.addEventListener("load", updateLayout);

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(updateLayout);
      observer.observe(headerTop);
      observer.observe(brand);
      observer.observe(contacts);
    }
  }

  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    const navLinks = nav ? nav.querySelectorAll("a") : [];
    const mobileBreakpoint = 980;

    if (!toggle || !nav) return;

    function closeNav() {
      toggle.classList.remove("is-open");
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Открыть меню");
      document.body.classList.remove("is-nav-open");
    }

    function openNav() {
      toggle.classList.add("is-open");
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Закрыть меню");
      document.body.classList.add("is-nav-open");
    }

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();

      if (nav.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    document.addEventListener("click", (event) => {
      if (window.innerWidth > mobileBreakpoint) return;
      if (!nav.classList.contains("is-open")) return;

      const target = event.target;
      if (!(target instanceof Node)) return;
      if (toggle.contains(target) || nav.contains(target)) return;

      closeNav();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= mobileBreakpoint) {
          closeNav();
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > mobileBreakpoint) {
        closeNav();
      }
    });
  }

  const HERO_PHOTO_HEIGHT_RATIO = 0.85;

  function syncHeroPhotoHeight() {
    const heroContent = document.querySelector(".hero-content");
    const heroPhoto = document.querySelector(".hero-photo");

    if (!heroContent || !heroPhoto || window.innerWidth <= 1100) {
      if (heroPhoto) heroPhoto.style.height = "";
      return;
    }

    heroPhoto.style.height = `${Math.round(heroContent.offsetHeight * HERO_PHOTO_HEIGHT_RATIO)}px`;
  }

  function initHeroPhotoHeight() {
    const heroContent = document.querySelector(".hero-content");
    const heroPhoto = document.querySelector(".hero-photo");

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
    const header = document.querySelector(".header");
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    }
  }

  function initScrollReveal() {
    const experienceItems = document.querySelectorAll(".experience-item");
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

  function initReviewsInteraction() {
    const frame = document.querySelector(".location-reviews-frame");
    if (!frame) return;

    const focusFrame = () => {
      try {
        frame.focus({ preventScroll: true });
      } catch (error) {
        frame.focus();
      }
    };

    frame.addEventListener("mouseenter", focusFrame);
    frame.addEventListener("touchstart", focusFrame, { passive: true });
  }

  function initPriceLightbox() {
    if (document.body.dataset.page !== "price") return;

    const lightbox = document.getElementById("price-lightbox");
    const stage = document.getElementById("price-lightbox-stage");
    const closeButton = lightbox?.querySelector(".price-lightbox-close");
    const cards = document.querySelectorAll(".price-gallery .price-card");

    if (!lightbox || !stage || !cards.length) return;

    let lastFocusedElement = null;

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-price-lightbox-open");
      stage.innerHTML = "";

      if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
      }
    }

    function openLightbox(card) {
      lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : card;
      const clone = card.cloneNode(true);
      clone.removeAttribute("role");
      clone.removeAttribute("tabindex");
      clone.removeAttribute("aria-label");

      stage.innerHTML = "";
      stage.appendChild(clone);

      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      lightbox.classList.add("is-open");
      document.body.classList.add("is-price-lightbox-open");
      closeButton?.focus();
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => openLightbox(card));

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(card);
        }
      });
    });

    closeButton?.addEventListener("click", closeLightbox);

    lightbox.querySelectorAll("[data-price-lightbox-close]").forEach((element) => {
      element.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  function init() {
    initContactLinks();
    initHeaderContactsLayout();
    initMobileNav();
    initHeroPhotoHeight();
    initScrollReveal();
    initSmoothAnchors();
    initReviewsInteraction();
    initPriceLightbox();
    onScroll();
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  if (document.getElementById("site-header")) {
    document.addEventListener("site:layout-ready", init, { once: true });
  } else {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  }
})();
