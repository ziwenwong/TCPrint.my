const state = {
  pricing: null,
  storageMode: "-",
};

const defaultImages = {
  "label-sticker": "/assets/images/product-label-sticker.png",
  "large-format-sticker": "/assets/images/product-large-format-sticker.png",
  "light-box-sticker": "/assets/images/product-light-box-sticker.png",
  "foamboard-mounting": "/assets/images/product-foamboard-mounting.png",
  banner: "/assets/images/product-banner.png",
  "bunting-roll": "/assets/images/product-bunting-roll.png",
  "bunting-normal": "/assets/images/product-bunting-normal.png",
  "bunting-custom": "/assets/images/product-bunting-custom.png",
  poster: "/assets/images/product-poster.png",
  "business-card": "/assets/images/product-business-card.png",
  "custom-printing": "/assets/images/product-custom-printing.png",
  "other-printing": "/assets/images/product-other-printing.png",
};

const formulaOptions = [
  ["tier", "Tier by quantity"],
  ["area_sqft", "Area sqft"],
  ["fixed", "Fixed price"],
  ["quote", "Quote only"],
  ["addon_each", "Add-on each"],
];

const els = {
  loginPanel: document.querySelector("#loginPanel"),
  dashboardPanel: document.querySelector("#dashboardPanel"),
  loginForm: document.querySelector("#loginForm"),
  passwordInput: document.querySelector("#passwordInput"),
  loginMessage: document.querySelector("#loginMessage"),
  logoutButton: document.querySelector("#logoutButton"),
  pricingForm: document.querySelector("#pricingForm"),
  adminRows: document.querySelector("#adminRows"),
  saveMessage: document.querySelector("#saveMessage"),
  historyList: document.querySelector("#historyList"),
  adminStorageMode: document.querySelector("#adminStorageMode"),
  settingWhatsapp: document.querySelector("#settingWhatsapp"),
  settingWest: document.querySelector("#settingWest"),
  settingEast: document.querySelector("#settingEast"),
  settingPickup: document.querySelector("#settingPickup"),
  addProductButton: document.querySelector("#addProductButton"),
  addOptionButton: document.querySelector("#addOptionButton"),
};

function money(value) {
  return "RM" + Number(value || 0).toFixed(2);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(value) {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "new-product";
}

function imageForRow(row) {
  return row.image || defaultImages[row.productSlug] || "/assets/images/product-custom-printing.png";
}

function numberInput(value, step) {
  return '<input type="number" min="0" step="' + step + '" value="' + (value ?? "") + '" />';
}

function formulaSelect(value) {
  return '<select data-field="formula">' + formulaOptions.map((option) => {
    return '<option value="' + option[0] + '"' + (value === option[0] ? " selected" : "") + ">" + option[1] + "</option>";
  }).join("") + "</select>";
}

function quantityLabel(row) {
  if (row.minQty && row.maxQty) return row.minQty + " - " + row.maxQty;
  if (row.minQty && !row.maxQty) return row.minQty + " and above";
  return "Any";
}

function showLogin(message) {
  els.loginPanel.hidden = false;
  els.dashboardPanel.hidden = true;
  els.logoutButton.hidden = true;
  els.loginMessage.textContent = message || "";
}

function showDashboard() {
  els.loginPanel.hidden = true;
  els.dashboardPanel.hidden = false;
  els.logoutButton.hidden = false;
}

async function api(path, options) {
  const response = await fetch(path, Object.assign({ headers: { "Content-Type": "application/json" } }, options || {}));
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload;
}

async function loadAdminPricing() {
  try {
    const payload = await api("/api/admin/pricing");
    state.pricing = payload.pricing;
    state.storageMode = payload.storageMode;
    renderDashboard();
    showDashboard();
  } catch (error) {
    showLogin("");
  }
}

function renderDashboard() {
  const pricing = state.pricing;
  els.adminStorageMode.textContent = state.storageMode || "-";
  els.settingWhatsapp.value = pricing.settings.whatsappNumber || "";
  els.settingWest.value = pricing.settings.postageWest || 8;
  els.settingEast.value = pricing.settings.postageEast || 30;
  els.settingPickup.value = pricing.settings.pickupAddress || "";

  els.adminRows.innerHTML = pricing.rows
    .map((row, index) => {
      const price = Number(row.unitPrice || 0);
      const cost = Number(row.unitCost || 0);
      const profit = price - cost;
      const profitClass = profit >= 0 ? "profit-positive" : "profit-negative";
      return '<tr data-row="' + index + '">' +
        '<td class="check-cell"><input type="checkbox" data-field="enabled" ' + (row.enabled !== false ? "checked" : "") + ' /></td>' +
        '<td class="image-cell">' +
          '<img class="admin-image-preview" src="' + escapeHtml(imageForRow(row)) + '" alt="" />' +
          '<input class="image-url-input" data-field="image" value="' + escapeHtml(imageForRow(row)) + '" />' +
          '<input class="image-file-input" data-image-upload type="file" accept="image/*" />' +
        '</td>' +
        '<td><input data-field="group" value="' + escapeHtml(row.group || "") + '" /></td>' +
        '<td><input data-field="category" value="' + escapeHtml(row.category || "") + '" /></td>' +
        '<td><input data-field="product" value="' + escapeHtml(row.product || "") + '" /></td>' +
        '<td><input data-field="productSlug" value="' + escapeHtml(row.productSlug || "") + '" /></td>' +
        '<td><input data-field="size" value="' + escapeHtml(row.size || "") + '" /></td>' +
        '<td>' + formulaSelect(row.formula || "quote") + '</td>' +
        '<td><input data-field="basis" value="' + escapeHtml(row.basis || "") + '" /></td>' +
        '<td>' + numberInput(row.minQty, "1").replace("<input", '<input data-field="minQty"') + '</td>' +
        '<td>' + numberInput(row.maxQty, "1").replace("<input", '<input data-field="maxQty"') + '</td>' +
        '<td>' + numberInput(row.unitPrice, "0.01").replace("<input", '<input data-field="unitPrice"') + '</td>' +
        '<td>' + numberInput(row.unitCost, "0.01").replace("<input", '<input data-field="unitCost"') + '</td>' +
        '<td class="profit-cell ' + profitClass + '">' + (row.unitPrice == null ? "-" : money(profit)) + '</td>' +
        '<td><textarea data-field="notes">' + escapeHtml(row.notes || "") + '</textarea></td>' +
        '<td class="row-actions">' +
          '<button class="button ghost compact" data-action="duplicate" type="button">Copy</button>' +
          '<button class="button ghost compact danger" data-action="delete" type="button">Delete</button>' +
        '</td>' +
      '</tr>';
    })
    .join("");

  renderHistory();
}

function renderHistory() {
  const history = state.pricing.history || [];
  if (!history.length) {
    els.historyList.innerHTML = '<p>No pricing changes recorded yet.</p>';
    return;
  }
  els.historyList.innerHTML = history.slice(0, 12).map((entry) => {
    const changes = (entry.changes || []).map((change) => escapeHtml(change.product + " " + change.field + ": " + change.from + " -> " + change.to)).join("<br>");
    return '<article class="history-item"><strong>' + new Date(entry.at).toLocaleString() + '</strong><p>' + (changes || "Settings updated") + '</p></article>';
  }).join("");
}

function updateProfit(tr) {
  const price = Number(tr.querySelector('[data-field="unitPrice"]').value || 0);
  const cost = Number(tr.querySelector('[data-field="unitCost"]').value || 0);
  const profitCell = tr.querySelector(".profit-cell");
  const profit = price - cost;
  profitCell.className = "profit-cell " + (profit >= 0 ? "profit-positive" : "profit-negative");
  profitCell.textContent = money(profit);
}

function normalizeNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function collectRow(tr, fallback) {
  const row = Object.assign({}, fallback || {});
  tr.querySelectorAll("[data-field]").forEach((input) => {
    const field = input.dataset.field;
    if (field === "enabled") row.enabled = input.checked;
    else if (["unitPrice", "unitCost", "minQty", "maxQty"].includes(field)) row[field] = normalizeNumber(input.value);
    else row[field] = input.value.trim();
  });
  row.productSlug = slugify(row.productSlug || row.product);
  row.group = row.group || "custom";
  row.category = row.category || row.group;
  row.product = row.product || "New Product";
  row.size = row.size || "To confirm";
  row.basis = row.basis || (row.formula === "quote" ? "quote" : "pcs");
  row.formula = row.formula || "quote";
  row.status = row.status || "Active";
  row.id = row.id || "custom-" + Date.now();
  return row;
}

function preferredProductImage(rows, slug) {
  const sameProductRows = rows.filter((row) => row.productSlug === slug);
  const fallback = defaultImages[slug] || "/assets/images/product-custom-printing.png";
  const custom = sameProductRows.find((row) => row.image && row.image !== fallback);
  if (custom) return custom.image;
  const saved = sameProductRows.find((row) => row.image);
  return saved ? saved.image : fallback;
}

function syncProductImages(rows) {
  const slugs = Array.from(new Set(rows.map((row) => row.productSlug)));
  slugs.forEach((slug) => {
    const image = preferredProductImage(rows, slug);
    rows.forEach((row) => {
      if (row.productSlug === slug) row.image = image;
    });
  });
}

function collectPricing() {
  const next = JSON.parse(JSON.stringify(state.pricing));
  next.settings.whatsappNumber = els.settingWhatsapp.value.trim();
  next.settings.postageWest = Number(els.settingWest.value || 0);
  next.settings.postageEast = Number(els.settingEast.value || 0);
  next.settings.pickupAddress = els.settingPickup.value.trim();
  next.rows = Array.from(els.adminRows.querySelectorAll("tr[data-row]")).map((tr) => {
    const index = Number(tr.dataset.row);
    return collectRow(tr, next.rows[index]);
  });
  syncProductImages(next.rows);
  return next;
}

function createProductRow() {
  const stamp = Date.now();
  return {
    id: "custom-" + stamp,
    group: "custom",
    category: "New Category",
    product: "New Product",
    productSlug: "new-product-" + stamp,
    size: "To confirm",
    basis: "quote",
    minQty: null,
    maxQty: null,
    unitPrice: null,
    unitCost: null,
    formula: "quote",
    status: "Quote",
    enabled: true,
    image: "/assets/images/product-custom-printing.png",
    notes: "Follow-up quotation",
  };
}

function duplicateRow(row) {
  const next = JSON.parse(JSON.stringify(row || createProductRow()));
  next.id = next.productSlug + "-option-" + Date.now();
  next.size = "New option";
  next.minQty = null;
  next.maxQty = null;
  return next;
}

function showSaveMessage(message, success) {
  els.saveMessage.className = "form-message admin-save-message" + (success ? " success" : "");
  els.saveMessage.textContent = message;
}

function highlightFirstRow() {
  const firstRow = els.adminRows.querySelector("tr");
  if (!firstRow) return;
  firstRow.classList.add("recently-added");
  firstRow.scrollIntoView({ block: "center", behavior: "smooth" });
}

function syncVisibleProductImage(sourceTr, image) {
  const slug = sourceTr.querySelector('[data-field="productSlug"]')?.value;
  if (!slug) return;
  els.adminRows.querySelectorAll("tr[data-row]").forEach((tr) => {
    const rowSlug = tr.querySelector('[data-field="productSlug"]')?.value;
    if (rowSlug !== slug) return;
    const imageInput = tr.querySelector('[data-field="image"]');
    const preview = tr.querySelector(".admin-image-preview");
    if (imageInput) imageInput.value = image;
    if (preview) preview.src = image || "/assets/images/product-custom-printing.png";
  });
}

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", () => reject(new Error("Could not read image file")));
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("error", () => reject(new Error("Could not load image file")));
      image.addEventListener("load", () => {
        const maxSide = 1400;
        const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      });
      image.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.loginMessage.textContent = "Checking...";
  try {
    await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password: els.passwordInput.value }) });
    els.passwordInput.value = "";
    await loadAdminPricing();
  } catch (error) {
    els.loginMessage.textContent = error.message;
  }
});

els.logoutButton.addEventListener("click", async () => {
  await api("/api/admin/logout", { method: "POST" }).catch(() => {});
  showLogin("Logged out.");
});

els.pricingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showSaveMessage("Saving...", false);
  try {
    const next = collectPricing();
    const payload = await api("/api/admin/pricing", { method: "PUT", body: JSON.stringify(next) });
    state.pricing = payload.pricing;
    state.storageMode = payload.storageMode;
    renderDashboard();
    showSaveMessage("Saved. Public website will refresh from the backend.", true);
  } catch (error) {
    showSaveMessage(error.message, false);
  }
});

els.addProductButton.addEventListener("click", () => {
  state.pricing = collectPricing();
  state.pricing.rows.unshift(createProductRow());
  renderDashboard();
  showSaveMessage("New category / product added at the top. Remember to save changes.", true);
  highlightFirstRow();
});

els.addOptionButton.addEventListener("click", () => {
  state.pricing = collectPricing();
  const base = state.pricing.rows[0] || createProductRow();
  state.pricing.rows.unshift(duplicateRow(base));
  renderDashboard();
  showSaveMessage("New option added at the top. Edit it, then save changes.", true);
  highlightFirstRow();
});

els.adminRows.addEventListener("input", (event) => {
  const tr = event.target.closest("tr");
  if (!tr) return;
  if (event.target.matches('[data-field="unitPrice"], [data-field="unitCost"]')) updateProfit(tr);
  if (event.target.matches('[data-field="product"]')) {
    const slugInput = tr.querySelector('[data-field="productSlug"]');
    if (!slugInput.value.trim()) slugInput.value = slugify(event.target.value);
  }
  if (event.target.matches('[data-field="image"]')) {
    const preview = tr.querySelector(".admin-image-preview");
    preview.src = event.target.value || "/assets/images/product-custom-printing.png";
    syncVisibleProductImage(tr, event.target.value);
    showSaveMessage("Product image synced to all options with the same slug. Click Save Changes to update the website.", true);
  }
});

els.adminRows.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const tr = button.closest("tr");
  const index = Number(tr.dataset.row);
  state.pricing = collectPricing();
  if (button.dataset.action === "duplicate") {
    state.pricing.rows.splice(index + 1, 0, duplicateRow(state.pricing.rows[index]));
  }
  if (button.dataset.action === "delete") {
    state.pricing.rows.splice(index, 1);
  }
  renderDashboard();
});

els.adminRows.addEventListener("change", async (event) => {
  if (!event.target.matches("[data-image-upload]")) return;
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const tr = event.target.closest("tr");
  const imageInput = tr.querySelector('[data-field="image"]');
  const preview = tr.querySelector(".admin-image-preview");
  showSaveMessage("Preparing image...", false);
  try {
    const dataUrl = await resizeImageFile(file);
    imageInput.value = dataUrl;
    preview.src = dataUrl;
    syncVisibleProductImage(tr, dataUrl);
    showSaveMessage("Image prepared. Click Save Changes to update the website.", true);
  } catch (error) {
    showSaveMessage(error.message, false);
  }
});

loadAdminPricing();
