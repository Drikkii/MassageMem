(function () {
  function getContacts() {
    return window.SITE?.contacts || {};
  }

  function initContactLinks() {
    const contacts = getContacts();

    document.querySelectorAll(".header-phone, .footer-phone, .contacts-phone").forEach((phoneLink) => {
      if (!contacts.phone) return;
      phoneLink.href = `tel:${contacts.phone}`;
      if (contacts.phoneDisplay) {
        phoneLink.textContent = contacts.phoneDisplay;
      }
    });

    document.querySelectorAll(
      ".header-contacts .social-link:not(.social-link--max), .footer-telegram, .contacts-messenger:not([data-max-link])"
    ).forEach((telegramLink) => {
      if (!contacts.telegram) return;
      telegramLink.href = contacts.telegram;
    });

    document.querySelectorAll("[data-max-link]").forEach((link) => {
      if (contacts.max) {
        link.href = contacts.max;
      }
    });

    document.querySelectorAll("[data-vk-link]").forEach((link) => {
      if (contacts.vk) {
        link.href = contacts.vk;
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
    const desktopQuery = window.matchMedia("(min-width: 981px)");

    if (!lightbox || !stage || !cards.length) return;

    let lastFocusedElement = null;

    function isDesktop() {
      return desktopQuery.matches;
    }

    function getCardLabel(card) {
      return card.querySelector(".price-banner-wrap--contraindications")
        ? "Открыть противопоказания на весь экран"
        : "Открыть меню массажа на весь экран";
    }

    function updateCardInteractivity() {
      cards.forEach((card) => {
        if (isDesktop()) {
          card.setAttribute("role", "button");
          card.setAttribute("tabindex", "0");
          card.setAttribute("aria-label", getCardLabel(card));
        } else {
          card.removeAttribute("role");
          card.removeAttribute("tabindex");
          card.removeAttribute("aria-label");
        }
      });
    }

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
      if (!isDesktop()) return;

      lastFocusedElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : card;
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
        if (!isDesktop()) return;

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

    const handleViewportChange = () => {
      updateCardInteractivity();
      if (!isDesktop() && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    };

    updateCardInteractivity();
    desktopQuery.addEventListener("change", handleViewportChange);
  }

  function initPhotoLightbox() {
    if (document.body.dataset.page !== "mentoring") return;

    const triggers = document.querySelectorAll(".hero-photo-trigger");
    const lightbox = document.getElementById("mentoring-photo-lightbox");
    const closeButton = lightbox?.querySelector(".photo-lightbox-close");
    const lightboxImage = lightbox?.querySelector(".photo-lightbox-image");

    if (!triggers.length || !lightbox || !lightboxImage) return;

    let lastFocusedElement = null;

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-photo-lightbox-open");

      if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
      }
    }

    function openLightbox(trigger) {
      const image = trigger.querySelector("img");

      if (!image) return;

      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;

      lastFocusedElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : trigger;

      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      lightbox.classList.add("is-open");
      document.body.classList.add("is-photo-lightbox-open");
      closeButton?.focus();
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => openLightbox(trigger));
    });

    closeButton?.addEventListener("click", closeLightbox);

    lightbox.querySelectorAll("[data-photo-lightbox-close]").forEach((element) => {
      element.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  function initMentoringApplicationModal() {
    if (document.body.dataset.page !== "mentoring") return;

    const openButton = document.getElementById("mentoring-application-open");
    const modal = document.getElementById("mentoring-application-modal");
    const thanksPopup = document.getElementById("mentoring-thanks-popup");
    const form = document.getElementById("mentoring-application-form");
    const error = document.getElementById("mentoring-application-error");
    const closeButton = modal?.querySelector(".application-modal-close");

    if (!openButton || !modal || !thanksPopup || !form || !error) return;

    const phoneInput = form.querySelector('input[name="phone"]');
    const PHONE_PREFIX = "+7";

    let lastFocusedElement = null;
    let thanksCloseTimer = null;

    function clearThanksCloseTimer() {
      if (thanksCloseTimer !== null) {
        window.clearTimeout(thanksCloseTimer);
        thanksCloseTimer = null;
      }
    }

    function resetForm() {
      form.reset();
      if (phoneInput instanceof HTMLInputElement) {
        phoneInput.value = "";
      }
    }

    function getFullPhone() {
      if (!(phoneInput instanceof HTMLInputElement)) return PHONE_PREFIX;
      const digits = phoneInput.value.replace(/\D/g, "");
      return digits ? `${PHONE_PREFIX}${digits}` : PHONE_PREFIX;
    }

    function bindPhoneInput() {
      if (!(phoneInput instanceof HTMLInputElement)) return;

      phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
      });
    }

    bindPhoneInput();

    function closeThanksPopup() {
      clearThanksCloseTimer();
      thanksPopup.classList.remove("is-open");
      thanksPopup.hidden = true;
      thanksPopup.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-thanks-popup-open");

      if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
      }
    }

    const thanksMessage = thanksPopup.querySelector("#mentoring-thanks-message");

    function openThanksPopup() {
      clearThanksCloseTimer();

      if (thanksMessage) {
        thanksMessage.textContent = "Спасибо за заявку! Я скоро с вами свяжусь.";
      }

      thanksPopup.hidden = false;
      thanksPopup.setAttribute("aria-hidden", "false");
      thanksPopup.classList.add("is-open");
      document.body.classList.add("is-thanks-popup-open");

      thanksCloseTimer = window.setTimeout(closeThanksPopup, 2000);
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-application-modal-open");
      error.hidden = true;
      error.textContent = "";
      resetForm();
    }

    function openModal() {
      clearThanksCloseTimer();
      lastFocusedElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : openButton;

      error.hidden = true;
      error.textContent = "";
      resetForm();

      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("is-open");
      document.body.classList.add("is-application-modal-open");

      const nameInput = form.querySelector('input[name="name"]');
      if (nameInput instanceof HTMLInputElement) {
        nameInput.focus();
      }
    }

    function normalizePhone(value) {
      const digits = value.replace(/\D/g, "");
      return digits ? `+7${digits.replace(/^7/, "")}` : "+7";
    }

    openButton.addEventListener("click", openModal);
    closeButton?.addEventListener("click", closeModal);

    modal.querySelectorAll("[data-application-close]").forEach((element) => {
      element.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }

      if (event.key === "Escape" && thanksPopup.classList.contains("is-open")) {
        closeThanksPopup();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!window.SiteForms?.sendLead) {
        error.textContent = "Форма не загружена. Обновите страницу.";
        error.hidden = false;
        return;
      }

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const phone = normalizePhone(getFullPhone());
      const comment = String(formData.get("comment") || "").trim();
      const submitButton = form.querySelector("[data-application-submit]");

      if (!name) {
        error.textContent = "Укажите имя.";
        error.hidden = false;
        return;
      }

      if (phone.length < 12) {
        error.textContent = "Укажите корректный номер телефона.";
        error.hidden = false;
        return;
      }

      error.hidden = true;
      error.textContent = "";

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
        submitButton.textContent = "Отправка…";
      }

      window.SiteForms.sendLead({
        _subject: "Заявка на наставничество",
        fields: {
          "Тип заявки": "Наставничество",
          Страница: document.title,
          URL: window.location.href,
          Имя: name,
          Телефон: phone,
          ...(comment ? { Комментарий: comment } : {}),
        },
      })
        .then(() => {
          closeModal();
          window.setTimeout(openThanksPopup, 150);
        })
        .catch((submitError) => {
          const phoneDisplay = getContacts().phoneDisplay || getContacts().phone || "";
          error.textContent =
            submitError?.message ||
            `Не удалось отправить заявку. Позвоните${phoneDisplay ? `: ${phoneDisplay}` : ""}.`;
          error.hidden = false;
        })
        .finally(() => {
          if (submitButton instanceof HTMLButtonElement) {
            submitButton.disabled = false;
            submitButton.textContent = "Отправить заявку";
          }
        });
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
    initPhotoLightbox();
    initMentoringApplicationModal();
    onScroll();
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  if (document.getElementById("site-header")) {
    document.addEventListener("site:layout-ready", init, { once: true });
  } else {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  }
})();
