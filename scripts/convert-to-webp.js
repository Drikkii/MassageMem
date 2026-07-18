const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMG_ROOT = path.join(__dirname, "..", "img");
const INPUT_EXT = new Set([".png", ".jpg", ".jpeg"]);

function webpOptions(meta, inputSize) {
  if (!meta.hasAlpha) {
    return { quality: 86, effort: 6, smartSubsample: true };
  }

  const pixels = (meta.width || 0) * (meta.height || 0);
  const largeAsset = inputSize > 400 * 1024 || pixels > 1_500_000;

  if (largeAsset) {
    return { quality: 90, alphaQuality: 100, effort: 6, smartSubsample: true };
  }

  return { lossless: true, effort: 6 };
}

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!INPUT_EXT.has(ext)) return null;

  const outputPath = filePath.slice(0, -ext.length) + ".webp";
  const inputSize = fs.statSync(filePath).size;
  const image = sharp(filePath);
  const meta = await image.metadata();
  const options = webpOptions(meta, inputSize);

  await image.webp(options).toFile(outputPath);

  const after = fs.statSync(outputPath).size;
  const rel = path.relative(IMG_ROOT, outputPath).replace(/\\/g, "/");
  const mode = options.lossless
    ? "lossless+alpha"
    : meta.hasAlpha
      ? "quality+alpha"
      : "quality";

  return { rel, before: inputSize, after, mode };
}

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(fullPath)));
      continue;
    }
    const converted = await convertFile(fullPath);
    if (converted) results.push(converted);
  }

  return results;
}

walk(IMG_ROOT)
  .then((results) => {
    let saved = 0;
    for (const item of results) {
      saved += item.before - item.after;
      console.log(
        `${item.rel}: ${(item.before / 1024).toFixed(1)} KB -> ${(item.after / 1024).toFixed(1)} KB (${item.mode})`,
      );
    }
    console.log(`\nConverted ${results.length} files, saved ${(saved / 1024 / 1024).toFixed(2)} MB total.`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
