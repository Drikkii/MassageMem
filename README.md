# MassageMem — сайт Екатерины Мухиной

Официальный сайт массажиста и мастера эстетической косметологии **Екатерины Мухиной** (бренд **SPA Expert**) в Калининграде.

- **Продакшен:** [https://spaexpert-em.ru](https://spaexpert-em.ru)
- **Демо (GitHub Pages):** [https://drikkii.github.io/MassageMem/](https://drikkii.github.io/MassageMem/)

---

## О проекте

Статический многостраничный сайт-визитка с онлайн-записью, прайсом, контактами и формами заявок. Главная страница одновременно выполняет роль раздела «О мастере».

Основные задачи сайта:

- представление услуг (массаж лица и тела, эстетическая косметология, наставничество);
- онлайн-запись через **DIKIDI**;
- SEO для запросов «массаж Калининград», «SPA Expert», «тайский массаж» и др.;
- интеграция с **Яндекс.Метрикой**, **Google Analytics 4** и **Яндекс.Картами**.

---

## Технологии

| Категория | Стек |
|-----------|------|
| Разметка | HTML5 |
| Стили | CSS3 (кастомные переменные, адаптивная вёрстка) |
| Скрипты | Vanilla JavaScript (без React/Vue) |
| Шрифты | Google Fonts — Cormorant Garamond, Montserrat |
| Изображения | WebP |
| Серверная часть | PHP 8+ (отправка форм по SMTP) |
| Хостинг | Beget (`public_html/`) |
| Веб-сервер | Apache (`.htaccess`: редиректы, MIME-типы) |
| Сборка | Node.js (только dev-скрипты: sitemap, конвертация изображений) |
| Аналитика | Яндекс.Метрика, Google Analytics 4 |
| Запись | DIKIDI widget |
| SEO | JSON-LD (Schema.org), Open Graph, sitemap.xml, robots.txt |

Фреймворки и CMS **не используются** — сайт собран вручную из HTML-страниц и переиспользуемых partials.

---

## Структура проекта

```
MassageMem/
├── index.html              # Главная («О мастере»)
├── price.html              # Прайс
├── test.html               # Тест «Какой массаж выбрать»
├── contacts.html           # Контакты
├── mentoring.html          # Наставничество
├── salons.html             # Сотрудничество с салонами
├── privacy.html            # Политика конфиденциальности
├── css/
│   └── style.css           # Основные стили
├── js/
│   ├── site-config.js      # Конфигурация сайта (контакты, SEO, маршруты)
│   ├── layout.js           # Шапка, подвал, meta-теги, JSON-LD
│   ├── schema-boot.js      # Ранняя подгрузка JSON-LD в <head>
│   ├── main.js             # UI: меню, lightbox, прайс, контакты
│   ├── analytics.js        # Метрика и GA4
│   ├── forms.js            # Отправка форм
│   └── candle-smoke-loader.js
├── partials/
│   ├── header.html
│   ├── footer.html
│   └── location.html       # Блок с картой Яндекса
├── api/
│   ├── lead.php            # Обработчик заявок
│   ├── smtp.php            # SMTP-клиент
│   ├── config.example.php  # Пример конфигурации почты
│   └── config.php          # Локальный конфиг
├── scripts/
│   ├── generate-sitemap.js # Генерация sitemap.xml из site-config.js
│   └── convert-to-webp.js  # Конвертация изображений в WebP
├── img/                    # Изображения
├── favicon/                # Иконки сайта
├── sitemap.xml
├── robots.txt
├── site.webmanifest
├── .htaccess
└── yandex_*.html           # Файл верификации Яндекс.Вебмастера
```

---

## Страницы

| Страница | URL | Назначение |
|----------|-----|------------|
| Главная / О мастере | `/` | Описание, услуги, опыт работы |
| Прайс | `/price.html` | Меню массажа и противопоказания |
| Тест | `/test.html` | Подбор вида массажа (в разработке) |
| Контакты | `/contacts.html` | Адрес, телефон, мессенджеры |
| Наставничество | `/mentoring.html` | Обучение специалистов |
| Салоны | `/salons.html` | Сотрудничество с салонами |
| Политика | `/privacy.html` | Политика конфиденциальности |

Маршруты, title, description и приоритеты для sitemap задаются в `js/site-config.js` → `routes`.

## Автор сайта

Разработка: [Drikki](https://github.com/Drikkii) — [github.com/Drikkii/MassageMem](https://github.com/Drikkii/MassageMem)
