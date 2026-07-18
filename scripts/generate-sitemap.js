const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.join(__dirname, "..");
const configPath = path.join(rootDir, "js", "site-config.js");
const outputPath = path.join(rootDir, "sitemap.xml");

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(configPath, "utf8"), context);
const site = context.window.SITE;

if (!site?.getSitemapUrls) {
  console.error("Не удалось прочитать маршруты из js/site-config.js");
  process.exit(1);
}

const lastmod = new Date().toISOString().slice(0, 10);
const urls = site.getSitemapUrls();

const body = urls
  .map(
    ({ loc, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

fs.writeFileSync(outputPath, xml, "utf8");
console.log(`Sitemap обновлён: ${outputPath} (${urls.length} URL, lastmod ${lastmod})`);
