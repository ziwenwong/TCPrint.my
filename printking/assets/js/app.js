const state = {
  pricing: null,
  publicRows: [],
  products: [],
  activeFilter: "all",
  previousProduct: "",
};

const els = {
  customerNameInput: document.querySelector("#customerNameInput"),
  customerPhoneInput: document.querySelector("#customerPhoneInput"),
  customerEmailInput: document.querySelector("#customerEmailInput"),
  storageMode: document.querySelector("#storageMode"),
  updatedAt: document.querySelector("#updatedAt"),
  filters: document.querySelector("#filters"),
  productGrid: document.querySelector("#productGrid"),
  inboxMoreButton: document.querySelector("#inboxMoreButton"),
  productSelect: document.querySelector("#productSelect"),
  labelSizeField: document.querySelector("#labelSizeField"),
  labelSizeSelect: document.querySelector("#labelSizeSelect"),
  materialField: document.querySelector("#materialField"),
  materialSelect: document.querySelector("#materialSelect"),
  laminationField: document.querySelector("#laminationField"),
  laminationSelect: document.querySelector("#laminationSelect"),
  buntingTypeField: document.querySelector("#buntingTypeField"),
  buntingTypeSelect: document.querySelector("#buntingTypeSelect"),
  widthField: document.querySelector("#widthField"),
  heightField: document.querySelector("#heightField"),
  unitField: document.querySelector("#unitField"),
  widthInput: document.querySelector("#widthInput"),
  heightInput: document.querySelector("#heightInput"),
  unitSelect: document.querySelector("#unitSelect"),
  quantityInput: document.querySelector("#quantityInput"),
  eyeletField: document.querySelector("#eyeletField"),
  eyeletSelect: document.querySelector("#eyeletSelect"),
  deliverySelect: document.querySelector("#deliverySelect"),
  remarkInput: document.querySelector("#remarkInput"),
  formMessage: document.querySelector("#formMessage"),
  whatsappButton: document.querySelector("#whatsappButton"),
  refreshButton: document.querySelector("#refreshButton"),
  totalPrice: document.querySelector("#totalPrice"),
  unitPrice: document.querySelector("#unitPrice"),
  printingPrice: document.querySelector("#printingPrice"),
  addonPrice: document.querySelector("#addonPrice"),
  postagePrice: document.querySelector("#postagePrice"),
  priceRule: document.querySelector("#priceRule"),
  quoteNote: document.querySelector("#quoteNote"),
  productPreview: document.querySelector("#productPreview"),
  previewTitle: document.querySelector("#previewTitle"),
  previewSticker: document.querySelector("#previewSticker"),
  previewSizeText: document.querySelector("#previewSizeText"),
  previewNote: document.querySelector("#previewNote"),
};

function money(value) {
  return "RM" + Number(value || 0).toFixed(2);
}

const productImages = {
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

function quantityLabel(row) {
  if (row.minQty && row.maxQty) return row.minQty + " - " + row.maxQty;
  if (row.minQty && !row.maxQty) return row.minQty + " and above";
  return "Any";
}

function dimensionToFeet(value, unit) {
  return unit === "cm" ? value / 30.48 : value;
}

function areaSqft(width, height, unit) {
  return dimensionToFeet(width, unit) * dimensionToFeet(height, unit);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function productData(slug) {
  return activeRows().find((row) => row.productSlug === slug) || null;
}

function isStickerProduct(slug) {
  const row = productData(slug);
  const text = ((row && (row.group + " " + row.category + " " + row.product)) || slug).toLowerCase();
  return text.includes("sticker");
}

function hasTierOptions(slug) {
  return rowsBySlug(slug).some((row) => row.formula === "tier");
}

function isAreaProduct(slug) {
  const base = productBaseSlug(slug);
  return rowsBySlug(slug).some((row) => row.formula === "area_sqft") || ["large-format-sticker", "light-box-sticker", "foamboard-mounting", "banner", "bunting-custom"].includes(slug) || (base === "bunting" && els.buntingTypeSelect.value === "bunting-custom");
}

function parseSizeText(sizeText) {
  const matches = String(sizeText || "").match(/([\d.]+)\s*cm\s*x\s*([\d.]+)/i);
  if (!matches) return null;
  return { width: Number(matches[1]), height: Number(matches[2]), unit: "cm" };
}

function selectedSize() {
  const slug = els.productSelect.value;
  if (hasTierOptions(slug)) {
    return parseSizeText(els.labelSizeSelect.value) || { width: 5, height: 5, unit: "cm" };
  }
  if (isAreaProduct(slug)) {
    return {
      width: Number(els.widthInput.value || 0),
      height: Number(els.heightInput.value || 0),
      unit: els.unitSelect.value,
    };
  }
  if (productBaseSlug(slug) === "bunting") {
    return { width: 80, height: 200, unit: "cm" };
  }
  return null;
}

function sizeLabel(size) {
  if (!size || !size.width || !size.height) return "Custom size";
  return size.width + (size.unit === "feet" ? "ft" : "cm") + " x " + size.height + (size.unit === "feet" ? "ft" : "cm");
}

function quantityValue() {
  const value = Math.floor(Number(els.quantityInput.value || 0));
  return Number.isFinite(value) ? value : 0;
}

function activeRows() {
  return state.publicRows.filter((row) => row.enabled !== false);
}

function rowsBySlug(slug) {
  return activeRows().filter((row) => row.productSlug === slug);
}

function rowById(id) {
  return activeRows().find((row) => row.id === id);
}

function productImageForSlug(slug) {
  const rows = rowsBySlug(slug);
  const fallback = productImages[slug] || "/assets/images/product-custom-printing.png";
  const custom = rows.find((row) => row.image && row.image !== fallback);
  if (custom) return custom.image;
  const saved = rows.find((row) => row.image);
  return saved ? saved.image : fallback;
}

function uniqueProducts() {
  const map = new Map();
  activeRows().forEach((row) => {
    const slug = row.productSlug;
    if (slug === "banner-eyelet") return;
    if (!map.has(slug)) {
      map.set(slug, {
        slug,
        group: row.group,
          product: row.product,
          category: row.category,
          description: row.notes || row.formula || "Printing service",
          image: productImageForSlug(slug),
      });
    }
  });
  return Array.from(map.values());
}

function productBaseSlug(slug) {
  if (slug === "banner-eyelet") return "banner";
  if (slug === "bunting-roll" || slug === "bunting-normal" || slug === "bunting-custom") return "bunting";
  return slug;
}

function renderFilters() {
  const categories = ["all"].concat(Array.from(new Set(activeRows().map((row) => row.group))));
  els.filters.innerHTML = categories
    .map((category) => {
      const count = category === "all" ? uniqueProducts().length : uniqueProducts().filter((product) => product.group === category).length;
      const label = category === "all" ? "ALL" : category.toUpperCase();
      return '<button class="filter-button ' + (state.activeFilter === category ? "active" : "") + '" type="button" data-filter="' + category + '"><span>' + label + '</span><strong>' + count + '</strong></button>';
    })
    .join("");

  els.filters.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = button.dataset.filter;
      renderFilters();
      renderProducts();
    });
  });
}

function renderProducts() {
  const products = uniqueProducts().filter((product) => state.activeFilter === "all" || product.group === state.activeFilter);
  els.productGrid.innerHTML = products
    .map((product) => {
      const rows = rowsBySlug(product.slug);
      const sample = rows.find((row) => row.unitPrice !== null && row.unitPrice !== undefined);
      const price = sample ? money(sample.unitPrice) + " / " + sample.basis : "To confirm";
      return '<article class="product-card"><img class="product-image" src="' + product.image + '" alt="' + product.product + ' sample image" loading="lazy" /><div class="product-card-body"><span class="tag">' + product.category + '</span><strong>' + product.product + '</strong><p>' + product.description + '</p></div><div class="tag-row"><span class="tag">' + price + '</span><a class="button ghost" href="#quote" data-quote-product="' + product.slug + '">Order Now</a></div></article>';
    })
    .join("");

  els.productGrid.querySelectorAll("[data-quote-product]").forEach((link) => {
    link.addEventListener("click", () => {
      els.productSelect.value = link.dataset.quoteProduct;
      updateFormVisibility();
      calculateQuote();
    });
  });
}

function renderProductSelect(selectedSlug) {
  state.products = uniqueProducts().filter((product) => product.slug !== "banner-eyelet");
  els.productSelect.innerHTML = state.products
    .map((product) => '<option value="' + product.slug + '">' + product.product + '</option>')
    .join("");
  if (selectedSlug && state.products.some((product) => product.slug === selectedSlug)) {
    els.productSelect.value = selectedSlug;
  } else if (state.products.some((product) => product.slug === "label-sticker")) {
    els.productSelect.value = "label-sticker";
  }
}

function renderLabelSizes(slug, selectedSize) {
  const labelRows = rowsBySlug(slug || "label-sticker").filter((row) => row.formula === "tier");
  const sizes = Array.from(new Set(labelRows.map((row) => row.size)));
  els.labelSizeSelect.innerHTML = sizes.map((size) => '<option value="' + size + '">' + size + '</option>').join("");
  if (selectedSize && sizes.includes(selectedSize)) els.labelSizeSelect.value = selectedSize;
}


function updateFormVisibility() {
  const slug = els.productSelect.value;
  const productChanged = slug !== state.previousProduct;
  if (["bunting-roll", "bunting-normal", "bunting-custom"].includes(slug) && els.buntingTypeSelect.value !== slug) {
    els.buntingTypeSelect.value = slug;
  }
  const base = productBaseSlug(slug);
  const isTier = hasTierOptions(slug);
  const isArea = isAreaProduct(slug);
  const isBunting = base === "bunting";
  const isSticker = isStickerProduct(slug);

  renderLabelSizes(slug, els.labelSizeSelect.value);
  els.labelSizeField.hidden = !isTier;
  els.materialField.hidden = !isSticker;
  els.laminationField.hidden = !isSticker;
  els.buntingTypeField.hidden = !isBunting;
  els.widthField.hidden = !isArea;
  els.heightField.hidden = !isArea;
  els.unitField.hidden = !isArea;
  els.eyeletField.hidden = slug !== "banner";

  if (productChanged) {
    if (isTier) els.quantityInput.value = "100";
    else if (isArea) els.quantityInput.value = "";
    else if (!els.quantityInput.value) els.quantityInput.value = "1";
  }

  state.previousProduct = slug;
  updatePreview();
}

function updatePreview() {
  const slug = els.productSelect.value;
  const productOption = els.productSelect.options[els.productSelect.selectedIndex];
  const title = productOption ? productOption.textContent : "PrintKing Product";
  const size = selectedSize();
  const showStickerMockup = isStickerProduct(slug);

  els.productPreview.hidden = false;
  els.previewTitle.textContent = title;
  els.previewSizeText.textContent = sizeLabel(size);

  if (showStickerMockup && size && size.width && size.height) {
    const widthCm = size.unit === "feet" ? size.width * 30.48 : size.width;
    const heightCm = size.unit === "feet" ? size.height * 30.48 : size.height;
    const longest = Math.max(widthCm, heightCm, 1);
    const scale = Math.min(7.4, 172 / longest);
    const stickerWidth = clamp(widthCm * scale, 58, 190);
    const stickerHeight = clamp(heightCm * scale, 42, 160);
    els.previewSticker.style.setProperty("--preview-w", stickerWidth + "px");
    els.previewSticker.style.setProperty("--preview-h", stickerHeight + "px");
    els.previewSticker.classList.remove("muted-preview");
    els.previewNote.textContent = "Preview follows the selected size proportion.";
    return;
  }

  els.previewSticker.style.setProperty("--preview-w", "140px");
  els.previewSticker.style.setProperty("--preview-h", "84px");
  els.previewSticker.classList.add("muted-preview");
  els.previewNote.textContent = "Final mockup can be confirmed by WhatsApp.";
}

function postage() {
  const settings = state.pricing.settings || {};
  if (els.deliverySelect.value === "east") return Number(settings.postageEast || 30);
  if (els.deliverySelect.value === "pickup") return 0;
  return Number(settings.postageWest || 8);
}

function findTierRow(slug, size, qty) {
  return rowsBySlug(slug).find((row) => row.formula === "tier" && row.size === size && qty >= Number(row.minQty || 0) && (!row.maxQty || qty <= Number(row.maxQty)));
}

function calculateQuote() {
  if (!state.pricing) return null;
  const slug = els.productSelect.value;
  const qty = quantityValue();
  const width = Number(els.widthInput.value || 0);
  const height = Number(els.heightInput.value || 0);
  const unit = els.unitSelect.value;
  let row = null;
  let unitPrice = 0;
  let printing = 0;
  let addon = 0;
  let rule = "-";
  let note = "Final price depends on artwork, size and finishing.";

  if (hasTierOptions(slug)) {
    row = findTierRow(slug, els.labelSizeSelect.value, qty);
    if (row) {
      unitPrice = Number(row.unitPrice || 0);
      printing = unitPrice * qty;
      rule = row.size + " / " + quantityLabel(row);
      note = row.notes || note;
    }
  } else if (slug === "banner") {
    row = rowsBySlug("banner").find((item) => item.formula === "area_sqft");
    unitPrice = Number(row && row.unitPrice || 0);
    printing = areaSqft(width, height, unit) * unitPrice * qty;
    if (els.eyeletSelect.value === "1") {
      const eyelet = rowById("banner-eyelet");
      addon = Number(eyelet && eyelet.unitPrice || 0) * qty;
    }
    rule = "Area sq ft x " + money(unitPrice) + " x quantity";
  } else if (productBaseSlug(slug) === "bunting") {
    const selected = els.buntingTypeSelect.value;
    row = rowById(selected);
    if (selected === "bunting-custom") {
      unitPrice = Number(row && row.unitPrice || 0);
      printing = areaSqft(width, height, unit) * unitPrice * qty;
      rule = "Area sq ft x " + money(unitPrice) + " x quantity";
    } else {
      unitPrice = Number(row && row.unitPrice || 0);
      printing = unitPrice * qty;
      rule = "Fixed price x quantity";
    }
  } else {
    row = rowsBySlug(slug)[0];
    if (row && row.formula === "area_sqft") {
      unitPrice = Number(row.unitPrice || 0);
      printing = areaSqft(width, height, unit) * unitPrice * qty;
      rule = "Area sq ft x " + money(unitPrice) + " x quantity";
    } else if (row && row.formula === "fixed") {
      unitPrice = Number(row.unitPrice || 0);
      printing = unitPrice * qty;
      rule = "Fixed price x quantity";
    } else {
      rule = "Follow-up quotation";
      note = "We will follow up after checking artwork and requirements.";
    }
  }

  const shipping = postage();
  const total = printing + addon + shipping;
  els.unitPrice.textContent = unitPrice ? money(unitPrice) : "To confirm";
  els.printingPrice.textContent = printing ? money(printing) : "To confirm";
  els.addonPrice.textContent = money(addon);
  els.postagePrice.textContent = money(shipping);
  els.totalPrice.textContent = printing ? money(total) : "To confirm";
  els.priceRule.textContent = rule;
  els.quoteNote.textContent = note;
  return { slug, qty, width, height, unit, unitPrice, printing, addon, shipping, total, rule, note };
}

function quoteSizeText() {
  const slug = els.productSelect.value;
  if (hasTierOptions(slug)) return els.labelSizeSelect.value || "-";
  if (isAreaProduct(slug)) return sizeLabel(selectedSize());
  if (productBaseSlug(slug) === "bunting") {
    return els.buntingTypeSelect.options[els.buntingTypeSelect.selectedIndex].textContent;
  }
  const row = rowsBySlug(slug)[0];
  return row ? row.size : "-";
}

function clearValidation() {
  els.formMessage.textContent = "";
  document.querySelectorAll(".field-error").forEach((label) => label.classList.remove("field-error"));
}

function markInvalid(input) {
  const label = input && input.closest("label");
  if (label) label.classList.add("field-error");
}

function validateQuoteForm() {
  clearValidation();
  const missing = [];
  const name = els.customerNameInput.value.trim();
  const phone = els.customerPhoneInput.value.trim();
  const email = els.customerEmailInput.value.trim();

  if (!name) {
    missing.push("name");
    markInvalid(els.customerNameInput);
  }
  if (!phone) {
    missing.push("phone");
    markInvalid(els.customerPhoneInput);
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    missing.push("email");
    markInvalid(els.customerEmailInput);
  }
  if (!els.productSelect.value) {
    missing.push("product");
    markInvalid(els.productSelect);
  }
  if (!els.labelSizeField.hidden && !els.labelSizeSelect.value) {
    missing.push("sticker size");
    markInvalid(els.labelSizeSelect);
  }
  if (!els.buntingTypeField.hidden && !els.buntingTypeSelect.value) {
    missing.push("bunting type");
    markInvalid(els.buntingTypeSelect);
  }
  if (!els.widthField.hidden && Number(els.widthInput.value || 0) <= 0) {
    missing.push("width");
    markInvalid(els.widthInput);
  }
  if (!els.heightField.hidden && Number(els.heightInput.value || 0) <= 0) {
    missing.push("height");
    markInvalid(els.heightInput);
  }
  if (quantityValue() <= 0) {
    missing.push("quantity");
    markInvalid(els.quantityInput);
  }
  if (!els.deliverySelect.value) {
    missing.push("delivery");
    markInvalid(els.deliverySelect);
  }

  if (missing.length) {
    els.formMessage.textContent = "Please complete customer details and all required product options before ordering.";
    return false;
  }

  return true;
}

function whatsappOrder() {
  if (!validateQuoteForm()) return;
  const quote = calculateQuote();
  if (!quote) return;
  const settings = state.pricing.settings || {};
  const productText = els.productSelect.options[els.productSelect.selectedIndex].textContent;
  const isSticker = isStickerProduct(quote.slug);
  const deliveryText = els.deliverySelect.options[els.deliverySelect.selectedIndex].textContent;
  const pickupLine = els.deliverySelect.value === "pickup" ? settings.pickupAddress || "-" : "-";
  const message = [
    "Hello, I would like to order:",
    "Product: " + productText,
    "Size: " + quoteSizeText(),
    "Quantity: " + quote.qty,
    "Material: " + (isSticker ? els.materialSelect.value : "-"),
    "Lamination: " + (isSticker ? els.laminationSelect.value : "-"),
    "Estimated Price: " + (quote.printing ? money(quote.total) : "To confirm"),
    "Postage: " + money(quote.shipping),
    "Name: " + els.customerNameInput.value.trim(),
    "Phone: " + els.customerPhoneInput.value.trim(),
    "Email: " + els.customerEmailInput.value.trim(),
    "Delivery: " + deliveryText,
    "Pickup Address: " + pickupLine,
    "Rule: " + quote.rule,
    "Remark: " + (els.remarkInput.value.trim() || "-")
  ].join("\n");
  const number = String(settings.whatsappNumber || "601117761934").replace(/\D/g, "");
  window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(message), "_blank", "noopener");
}

function updateInboxLink() {
  if (!els.inboxMoreButton) return;
  const settings = state.pricing && state.pricing.settings || {};
  const number = String(settings.whatsappNumber || "601117761934").replace(/\D/g, "");
  const message = "Hi PrintKing, I would like to know more about your printing services.";
  els.inboxMoreButton.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
}

function loadSavedCustomerDetails() {
  try {
    const saved = JSON.parse(localStorage.getItem("printkingCustomerDetails") || "{}");
    els.customerNameInput.value = saved.name || "";
    els.customerPhoneInput.value = saved.phone || "";
    els.customerEmailInput.value = saved.email || "";
  } catch (error) {
    localStorage.removeItem("printkingCustomerDetails");
  }
}

function saveCustomerDetails() {
  const payload = {
    name: els.customerNameInput.value.trim(),
    phone: els.customerPhoneInput.value.trim(),
    email: els.customerEmailInput.value.trim(),
  };
  try {
    localStorage.setItem("printkingCustomerDetails", JSON.stringify(payload));
  } catch (error) {
    // Customer details are only a convenience cache; quoting still works without it.
  }
}

async function loadPricing() {
  const response = await fetch("/api/pricing", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load pricing");
  const payload = await response.json();
  const selectedProduct = els.productSelect.value;
  const selectedLabelSize = els.labelSizeSelect.value;
  const selectedBuntingType = els.buntingTypeSelect.value;
  state.pricing = payload.pricing;
  state.publicRows = payload.pricing.rows;
  els.storageMode.textContent = payload.storageMode || "Default";
  els.updatedAt.textContent = payload.pricing.updatedAt ? new Date(payload.pricing.updatedAt).toLocaleString() : "-";
  renderProductSelect(selectedProduct);
  renderLabelSizes(els.productSelect.value, selectedLabelSize);
  if (selectedBuntingType) els.buntingTypeSelect.value = selectedBuntingType;
  renderFilters();
  renderProducts();
  updateFormVisibility();
  calculateQuote();
  updateInboxLink();
}

["change", "input"].forEach((eventName) => {
  document.addEventListener(eventName, (event) => {
    if (event.target.closest("#quoteForm")) {
      updateFormVisibility();
      calculateQuote();
      clearValidation();
      if ([els.customerNameInput, els.customerPhoneInput, els.customerEmailInput].includes(event.target)) saveCustomerDetails();
    }
  });
});

els.refreshButton.addEventListener("click", loadPricing);
els.whatsappButton.addEventListener("click", whatsappOrder);
setInterval(loadPricing, 30000);

loadSavedCustomerDetails();
loadPricing().catch((error) => {
  els.storageMode.textContent = "Error";
  els.quoteNote.textContent = error.message;
});
