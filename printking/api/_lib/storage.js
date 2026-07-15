const fs = require("fs/promises");
const path = require("path");
const { cloneDefaultPricing } = require("./defaultPricing");

const KEY = "printking:pricing:v1";
const LOCAL_FILE = path.join(process.cwd(), ".data", "pricing.json");

function redisUrl() {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
}

function redisToken() {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
}

function hasKv() {
  return Boolean(redisUrl() && redisToken());
}

function storageMode() {
  if (hasKv()) return "Upstash Redis";
  if (process.env.VERCEL === "1") return "Default data - connect Upstash Redis to save";
  return "Local JSON file";
}

async function readFromKv() {
  const response = await fetch(redisUrl() + "/get/" + encodeURIComponent(KEY), {
    headers: { Authorization: "Bearer " + redisToken() },
    cache: "no-store"
  });
  if (!response.ok) throw new Error("Could not read Upstash Redis pricing");
  const payload = await response.json();
  if (!payload.result) return null;
  return typeof payload.result === "string" ? JSON.parse(payload.result) : payload.result;
}

async function writeToKv(data) {
  const response = await fetch(redisUrl() + "/set/" + encodeURIComponent(KEY), {
    method: "POST",
    headers: {
      Authorization: "Bearer " + redisToken(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error("Could not save to Upstash Redis: " + text);
  }
}

async function readLocal() {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch (error) {
    return null;
  }
}

async function writeLocal(data) {
  if (process.env.VERCEL === "1") {
    throw new Error("Persistent admin saving on Vercel requires Upstash Redis REST environment variables.");
  }
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(data, null, 2));
}

async function getPricing() {
  if (hasKv()) {
    const data = await readFromKv();
    return data || cloneDefaultPricing();
  }
  return (await readLocal()) || cloneDefaultPricing();
}

function normalizeNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function slugify(value) {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "new-product";
}

function cleanImage(value) {
  const image = String(value || "").trim();
  if (!image) return "";
  if (image.length > 3500000) return "";
  if (image.startsWith("/assets/images/")) return image;
  if (image.startsWith("https://") || image.startsWith("http://")) return image;
  if (image.startsWith("data:image/")) return image;
  return "";
}

function normalizeFormula(value) {
  const formula = String(value || "quote");
  return ["tier", "area_sqft", "fixed", "quote", "addon_each"].includes(formula) ? formula : "quote";
}

function sanitizeRow(row, index, usedIds) {
  const product = String(row.product || "New Product").trim();
  const productSlug = slugify(row.productSlug || product);
  let id = String(row.id || productSlug + "-" + (index + 1)).trim();
  if (!id) id = productSlug + "-" + (index + 1);
  while (usedIds.has(id)) id = id + "-" + (index + 1);
  usedIds.add(id);

  return {
    id,
    group: String(row.group || "custom").trim() || "custom",
    category: String(row.category || row.group || "Custom").trim() || "Custom",
    product,
    productSlug,
    size: String(row.size || "To confirm").trim() || "To confirm",
    basis: String(row.basis || "quote").trim() || "quote",
    minQty: normalizeNumber(row.minQty),
    maxQty: normalizeNumber(row.maxQty),
    unitPrice: normalizeNumber(row.unitPrice),
    unitCost: normalizeNumber(row.unitCost),
    formula: normalizeFormula(row.formula),
    status: String(row.status || "Active").trim() || "Active",
    enabled: row.enabled !== false,
    image: cleanImage(row.image),
    notes: String(row.notes || ""),
  };
}

function sanitizePricing(data) {
  data = data || {};
  const clean = cloneDefaultPricing();
  clean.version = 1;
  clean.updatedAt = new Date().toISOString();
  clean.settings = {
    whatsappNumber: String(data.settings && data.settings.whatsappNumber || clean.settings.whatsappNumber).replace(/\D/g, ""),
    postageWest: normalizeNumber(data.settings && data.settings.postageWest) ?? clean.settings.postageWest,
    postageEast: normalizeNumber(data.settings && data.settings.postageEast) ?? clean.settings.postageEast,
    pickupAddress: String(data.settings && data.settings.pickupAddress || clean.settings.pickupAddress)
  };
  const incomingRows = Array.isArray(data.rows) && data.rows.length ? data.rows : clean.rows;
  const usedIds = new Set();
  clean.rows = incomingRows.map((row, index) => sanitizeRow(row, index, usedIds));
  clean.history = Array.isArray(data.history) ? data.history.slice(0, 60) : [];
  return clean;
}

function diffPricing(before, after) {
  const changes = [];
  const beforeRows = new Map((before.rows || []).map((row) => [row.id, row]));
  const afterRows = new Map((after.rows || []).map((row) => [row.id, row]));
  (after.rows || []).forEach((row) => {
    const prev = beforeRows.get(row.id);
    if (!prev) {
      changes.push({ product: row.product + " / " + row.size, field: "row", from: "", to: "added" });
      return;
    }
    ["group", "category", "product", "productSlug", "size", "basis", "minQty", "maxQty", "unitPrice", "unitCost", "formula", "enabled", "image", "notes"].forEach((field) => {
      if (String(prev[field]) !== String(row[field])) {
        changes.push({
          product: row.product + " / " + row.size,
          field,
          from: field === "image" ? "previous image" : prev[field],
          to: field === "image" ? "updated image" : row[field]
        });
      }
    });
  });
  (before.rows || []).forEach((row) => {
    if (!afterRows.has(row.id)) changes.push({ product: row.product + " / " + row.size, field: "row", from: "existing", to: "deleted" });
  });
  return changes;
}

async function savePricing(data) {
  const before = await getPricing();
  const clean = sanitizePricing(data);
  clean.history = [
    { at: clean.updatedAt, changes: diffPricing(before, clean) },
    ...(before.history || [])
  ].slice(0, 60);
  if (hasKv()) await writeToKv(clean);
  else await writeLocal(clean);
  return clean;
}

function publicPricing(data) {
  return {
    version: data.version,
    updatedAt: data.updatedAt,
    settings: data.settings,
    rows: data.rows.map((row) => {
      const { unitCost, ...publicRow } = row;
      return publicRow;
    })
  };
}

module.exports = { getPricing, publicPricing, savePricing, storageMode };
