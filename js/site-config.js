window.SITE = {
  name: "Екатерина Мухина",
  tagline: "Массажист и мастер эстетической косметологии",
  year: 2026,
  url: "https://spaexpert-em.ru",
  github: "https://github.com/Drikkii/MassageMem",
  developer: "Drikki",
  locale: "ru_RU",
  defaultImage: "img/Mem-Photoroom2-Photoroom2-Photoroom.png",
  defaultDescription:
    "Екатерина Мухина — массажист и мастер эстетической косметологии в Калининграде. Профессиональный массаж лица и тела, эстетический уход, наставничество и сотрудничество с салонами.",
  defaultKeywords:
    "массаж Калининград, массажист Калининград, эстетическая косметология, массаж лица, массаж тела, Екатерина Мухина",
  contacts: {
    phone: "+79182859762",
    phoneDisplay: "+7 918 285-97-62",
    telegram: "https://t.me/+79182859762",
    max: "https://max.ru/u/f9LHodD0cOLo2NtgSTw4LF1wSlZf-BcsgWfnTfkEkZUt6sDx6EYAVwN54SU",
    vk: "https://vk.com/ekaterina_mukhina_cosmo",
    email: "mukhina.cosmo@mail.ru",
    city: "Калининград",
    address: "Малоярославская ул., 6",
    addressFull: "г. Калининград, Малоярославская ул., 6",
  },
  yandex: {
    profileUrl: "https://yandex.ru/maps/org/massazhny_kabinet/178427435576/",
    mapEmbedUrl:
      "https://yandex.ru/map-widget/v1/?ll=20.545701%2C54.720559&mode=search&oid=178427435576&ol=biz&z=16.57",
    reviewsEmbedUrl: "https://yandex.ru/maps-reviews-widget/178427435576?comments",
    orgName: "Массажный кабинет",
  },
  routes: {
    home: {
      path: "index.html",
      title: "Екатерина Мухина — Массажист и мастер эстетической косметологии",
      description:
        "Екатерина Мухина — массажист и мастер эстетической косметологии в Калининграде. Индивидуальные протоколы ухода, массаж лица и тела, запись на процедуры.",
      keywords:
        "массаж Калининград, массажист, эстетическая косметология, массаж лица, массаж тела, Екатерина Мухина",
      changefreq: "weekly",
      priority: "1.0",
      inSitemap: true,
    },
    about: {
      path: "index.html",
      title: "О мастере — Екатерина Мухина",
      description:
        "О мастере Екатерине Мухиной: опыт в эстетической косметологии и массаже, индивидуальный подход и профессиональный уход в Калининграде.",
      keywords: "о мастере, массажист Калининград, эстетическая косметология, Екатерина Мухина",
      inSitemap: false,
    },
    test: {
      path: "test.html",
      title: "Тест: какой массаж мне подойдет — Екатерина Мухина",
      description:
        "Пройдите тест и узнайте, какой вид массажа вам подойдет. Екатерина Мухина — массажист и мастер эстетической косметологии в Калининграде.",
      keywords: "тест массаж, какой массаж подойдет, массаж Калининград",
      changefreq: "monthly",
      priority: "0.7",
      inSitemap: true,
    },
    price: {
      path: "price.html",
      title: "Прайс — Екатерина Мухина",
      description:
        "Прайс на массаж и эстетические процедуры у Екатерины Мухиной в Калининграде. Актуальные цены и запись на сеанс.",
      keywords: "прайс массаж, цены массаж Калининград, стоимость массажа",
      changefreq: "weekly",
      priority: "0.8",
      inSitemap: true,
    },
    mentoring: {
      path: "mentoring.html",
      title: "Наставничество — Екатерина Мухина",
      description:
        "Наставничество для специалистов индустрии красоты от Екатерины Мухиной: обучение, сопровождение и профессиональный рост.",
      keywords: "наставничество косметология, обучение массажу, менторство beauty",
      changefreq: "monthly",
      priority: "0.6",
      inSitemap: true,
    },
    salons: {
      path: "salons.html",
      title: "Сотрудничество с салонами — Екатерина Мухина",
      description:
        "Сотрудничество с салонами красоты: внедрение стандартов сервиса, обучение команды и авторские протоколы от Екатерины Мухиной.",
      keywords: "сотрудничество салон красоты, стандарты сервиса, обучение салон",
      changefreq: "monthly",
      priority: "0.6",
      inSitemap: true,
    },
    privacy: {
      path: "privacy.html",
      title: "Политика конфиденциальности — Екатерина Мухина",
      description:
        "Политика конфиденциальности сайта Екатерины Мухиной: порядок обработки и защиты персональных данных.",
      keywords: "политика конфиденциальности, персональные данные",
      changefreq: "yearly",
      priority: "0.3",
      inSitemap: true,
    },
    contacts: {
      path: "contacts.html",
      title: "Контакты — Екатерина Мухина",
      description:
        "Контакты Екатерины Мухиной в Калининграде: адрес массажного кабинета, телефон, электронная почта и карта проезда.",
      keywords: "контакты массажист Калининград, адрес массажный кабинет, Екатерина Мухина",
      changefreq: "monthly",
      priority: "0.8",
      inSitemap: true,
    },
  },
};

window.SITE.getBasePath = function getBasePath() {
  const { pathname } = window.location;
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] || "";

  if (last.endsWith(".html")) {
    segments.pop();
  }

  return segments.length ? `/${segments.join("/")}/` : "/";
};

window.SITE.pageUrl = function pageUrl(routeKey) {
  const route = window.SITE.routes[routeKey];
  if (!route) return window.SITE.getBasePath();

  const base = window.SITE.getBasePath();
  const rootPath = base.endsWith("/") ? base : `${base}/`;

  if (route.path.startsWith("http")) return route.path;
  return `${rootPath}${route.path}`;
};

window.SITE.getAbsoluteUrl = function getAbsoluteUrl(routeKey) {
  const base = window.SITE.url.replace(/\/$/, "");
  const route = window.SITE.routes[routeKey];

  if (!route) return `${base}/`;
  if (routeKey === "home" || route.path === "index.html") return `${base}/`;
  return `${base}/${route.path}`;
};

window.SITE.getSitemapUrls = function getSitemapUrls() {
  const seen = new Set();

  return Object.entries(window.SITE.routes)
    .filter(([, route]) => route.inSitemap)
    .map(([key, route]) => ({
      key,
      loc: window.SITE.getAbsoluteUrl(key),
      changefreq: route.changefreq || "monthly",
      priority: route.priority || "0.5",
    }))
    .filter((entry) => {
      if (seen.has(entry.loc)) return false;
      seen.add(entry.loc);
      return true;
    });
};
