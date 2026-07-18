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
│   └── config.php          # Локальный конфиг (не коммитить пароли)
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

---

## Конфигурация

Все основные данные сайта — в **`js/site-config.js`**:

- имя, описание, контакты (телефон, email, адрес);
- ссылки на Telegram, MAX, VK, Яндекс.Карты;
- URL онлайн-записи DIKIDI;
- SEO-ключевые слова, верификация Яндекс/Google;
- ID счётчиков аналитики;
- маршруты страниц для навигации и sitemap.

После изменения маршрутов перегенерируйте sitemap:

```bash
npm run generate:sitemap
```

### Почта (формы на Beget)

1. Скопируйте `api/config.example.php` → `api/config.php`
2. Укажите SMTP-пароль от почты `noreply@spaexpert-em.ru`
3. **Не публикуйте** `config.php` с паролем в открытый репозиторий

---

## SEO и микроразметка

- **Meta-теги:** description, keywords, geo, canonical, Open Graph, Twitter Card
- **JSON-LD (Schema.org):** LocalBusiness, Person, WebSite, WebPage, BreadcrumbList, ContactPage, AboutPage, SiteNavigationElement
- **Файлы:** `sitemap.xml`, `robots.txt`, `site.webmanifest`
- **Верификация:** meta-теги + `yandex_293bcd7b06fd60cb.html` для Яндекс.Вебмастера

Разметка подключается через `schema-boot.js` (ранняя загрузка) и дополняется `layout.js` после инициализации страницы.

---

## Аналитика

| Сервис | Где настраивается |
|--------|-------------------|
| Яндекс.Метрика | `site-config.js` → `analytics.yandexMetrikaId` |
| Google Analytics 4 | `site-config.js` → `analytics.googleAnalyticsId` |

Скрипты загружаются из `js/analytics.js` только при указанных ID.

---

## npm-скрипты

```bash
# Установка зависимостей (sharp для конвертации изображений)
npm install

# Генерация sitemap.xml из site-config.js
npm run generate:sitemap

# Конвертация изображений в WebP
npm run convert:webp
```

---

## Деплой на Beget

Загрузите содержимое папки `MassageMem/` в `public_html/`:

- все `.html`, `css/`, `js/`, `img/`, `favicon/`, `partials/`;
- `api/` с настроенным `config.php`;
- `sitemap.xml`, `robots.txt`, `.htaccess`, `site.webmanifest`;
- файлы верификации Яндекса.

Проверьте:

- canonical-URL: `https://spaexpert-em.ru` (без `www`);
- редирект `www` → без `www` в `.htaccess`;
- sitemap добавлен в [Яндекс.Вебмастер](https://webmaster.yandex.ru).

---

## Разработка

- Локально можно открыть `index.html` через любой static server или Live Server.
- Partials (`header`, `footer`, `location`) подгружаются через `fetch` — для корректной работы нужен HTTP-сервер, не `file://`.
- Версии CSS/JS кэшируются query-параметром `?v=` — при деплое обновляйте `assetsVersion` в `site-config.js`.

---

## Автор сайта

Разработка: [Drikki](https://github.com/Drikkii) — [github.com/Drikkii/MassageMem](https://github.com/Drikkii/MassageMem)
