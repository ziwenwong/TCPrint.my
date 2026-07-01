const pickupAddress =
  "3424, Jalan Pekeliling Tanjung 27/1, Kawasan Perindustrian Indahpura, 81000 Kulai, Johor Darul Ta'zim";
const whatsappNumber = "601117761934";

// Replace placeholder images by adding an image path to the product or portfolio item below.
const productCategories = [
  {
    id: "label-sticker",
    title: "Label Sticker",
    category: "Sticker Printing",
    subtitle: "Waterproof label stickers for bottles, jars, packaging and product labels.",
    description: "Interactive sticker order with size, shape, material, usage and price estimate.",
    priceLabel: "From RM0.07/pcs",
    mode: "sticker",
    image: "assets/images/label-sticker.png",
    preset: { stickerType: "Label Sticker", usage: "product" },
  },
  {
    id: "waterproof-sticker",
    title: "Waterproof Sticker",
    category: "Sticker Printing",
    subtitle: "Durable waterproof stickers for packaging, bottles and outdoor-friendly labels.",
    description: "Glossy or matte waterproof sticker request with WhatsApp order summary.",
    priceLabel: "From RM0.07/pcs",
    mode: "sticker",
    image: "assets/images/label-sticker.png",
    preset: { stickerType: "Waterproof Sticker", material: "Waterproof", usage: "bottle" },
  },
  {
    id: "banner",
    title: "Banner",
    category: "Large Format",
    subtitle: "Tarpaulin banner printing calculated by square feet.",
    description: "Enter width, height, unit, quantity and artwork note for banner order.",
    priceLabel: "RM2.50/sq ft",
    mode: "banner",
    image: "assets/images/banner.png",
  },
  {
    id: "bunting",
    title: "Bunting / Roll Up Bunting",
    category: "Large Format",
    subtitle: "80cm x 200cm bunting for retail, events and promotion display.",
    description: "Roll up bunting, stand option or normal hanging bunting with WhatsApp order.",
    priceLabel: "From RM80",
    mode: "bunting",
    image: "assets/images/bunting-stand.png",
  },
  {
    id: "poster",
    title: "Poster",
    category: "General Printing",
    subtitle: "Poster printing request for campaigns, events and in-store promotion.",
    description: "Basic quote form for poster size, quantity and artwork follow-up.",
    priceLabel: "Get Quote",
    mode: "generic",
    placeholder: "Poster Printing",
  },
  {
    id: "business-card",
    title: "Business Card",
    category: "Business Printing",
    subtitle: "Name card printing request for teams, shops and service businesses.",
    description: "Choose quantity and send details for follow-up quotation.",
    priceLabel: "Get Quote",
    mode: "generic",
    placeholder: "Business Card",
  },
  {
    id: "packaging-sticker",
    title: "Packaging Sticker",
    category: "Sticker Printing",
    subtitle: "Sticker labels for product boxes, bags, jars and packaging seals.",
    description: "Interactive sticker order prepared for packaging use cases.",
    priceLabel: "From RM0.07/pcs",
    mode: "sticker",
    image: "assets/images/label-sticker.png",
    preset: { stickerType: "Label Sticker", usage: "packaging" },
  },
  {
    id: "custom-size-printing",
    title: "Custom Size Printing",
    category: "Custom Printing",
    subtitle: "Custom size printing requests that need manual follow-up.",
    description: "Send your custom print details and we will confirm final price.",
    priceLabel: "Inbox Quote",
    mode: "generic",
    placeholder: "Custom Size",
  },
  {
    id: "other-printing",
    title: "Other Printing",
    category: "Follow-Up Products",
    subtitle: "名片, flyer, 衣服, 扑克牌, 红包, 日历, flag, non woven bag, mouse pad and more.",
    description: "Choose an item and quantity; we will follow up after receiving your request.",
    priceLabel: "Inbox / Follow Up",
    mode: "other",
    image: "assets/images/other-printing.png",
  },
];

const stickerSizes = {
  "5x5": {
    label: "5cm x 5cm",
    width: 5,
    height: 5,
    tiers: [
      { min: 1, max: 999, price: 0.15 },
      { min: 1000, max: 4999, price: 0.12 },
      { min: 5000, max: Infinity, price: 0.07 },
    ],
  },
  "6x6": {
    label: "6cm x 6cm",
    width: 6,
    height: 6,
    estimated: true,
    tiers: [
      { min: 1, max: 999, price: 0.17 },
      { min: 1000, max: 4999, price: 0.14 },
      { min: 5000, max: Infinity, price: 0.09 },
    ],
  },
  "7x7": {
    label: "7cm x 7cm",
    width: 7,
    height: 7,
    estimated: true,
    tiers: [
      { min: 1, max: 999, price: 0.19 },
      { min: 1000, max: 4999, price: 0.15 },
      { min: 5000, max: Infinity, price: 0.1 },
    ],
  },
  "10x10": {
    label: "10cm x 10cm",
    width: 10,
    height: 10,
    tiers: [
      { min: 1, max: 999, price: 0.25 },
      { min: 1000, max: 4999, price: 0.2 },
      { min: 5000, max: Infinity, price: 0.15 },
    ],
  },
  "15x15": {
    label: "15cm x 15cm",
    width: 15,
    height: 15,
    tiers: [
      { min: 1, max: 999, price: 0.35 },
      { min: 1000, max: 4999, price: 0.3 },
      { min: 5000, max: Infinity, price: 0.25 },
    ],
  },
  custom: {
    label: "Custom Size",
    width: 5,
    height: 5,
    quote: true,
  },
};

const portfolioItems = [
  { category: "Sticker", title: "Sticker Work Placeholder", text: "Replace with real sticker project photo.", color: "#00a6df" },
  { category: "Banner", title: "Banner Work Placeholder", text: "Replace with real banner project photo.", color: "#cf202b" },
  { category: "Bunting", title: "Bunting Work Placeholder", text: "Replace with real bunting project photo.", color: "#303744" },
  { category: "Packaging", title: "Packaging Work Placeholder", text: "Replace with real packaging work photo.", color: "#b8944d" },
  { category: "Poster", title: "Poster Work Placeholder", text: "Replace with real poster project photo.", color: "#e4148a" },
  { category: "Shop Decoration", title: "Shop Decoration Placeholder", text: "Replace with real installation photo.", color: "#18a058" },
];

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  minimumFractionDigits: 2,
});

const state = {
  activeProductId: "label-sticker",
  portfolioFilter: "All",
};

const selectors = {
  navToggle: document.querySelector("#navToggle"),
  primaryNav: document.querySelector("#primaryNav"),
  categoryGrid: document.querySelector("#categoryGrid"),
  portfolioTabs: document.querySelector("#portfolioTabs"),
  portfolioGrid: document.querySelector("#portfolioGrid"),
  breadcrumbProduct: document.querySelector("#breadcrumbProduct"),
  productCategory: document.querySelector("#productCategory"),
  productTitle: document.querySelector("#productTitle"),
  productSubtitle: document.querySelector("#productSubtitle"),
  activeProductId: document.querySelector("#activeProductId"),
  orderForm: document.querySelector("#orderForm"),
  stickerControls: document.querySelector("#stickerControls"),
  bannerControls: document.querySelector("#bannerControls"),
  buntingControls: document.querySelector("#buntingControls"),
  genericControls: document.querySelector("#genericControls"),
  otherControls: document.querySelector("#otherControls"),
  stickerTypeSelect: document.querySelector("#stickerTypeSelect"),
  stickerSizeSelect: document.querySelector("#stickerSizeSelect"),
  customSizeFields: document.querySelector("#customSizeFields"),
  customStickerWidth: document.querySelector("#customStickerWidth"),
  customStickerHeight: document.querySelector("#customStickerHeight"),
  stickerShapeSelect: document.querySelector("#stickerShapeSelect"),
  stickerQuantitySelect: document.querySelector("#stickerQuantitySelect"),
  customStickerQuantity: document.querySelector("#customStickerQuantity"),
  stickerMaterialSelect: document.querySelector("#stickerMaterialSelect"),
  stickerUsageSelect: document.querySelector("#stickerUsageSelect"),
  bannerWidth: document.querySelector("#bannerWidth"),
  bannerHeight: document.querySelector("#bannerHeight"),
  bannerUnit: document.querySelector("#bannerUnit"),
  bannerQuantity: document.querySelector("#bannerQuantity"),
  bannerEyelet: document.querySelector("#bannerEyelet"),
  buntingType: document.querySelector("#buntingType"),
  buntingSize: document.querySelector("#buntingSize"),
  buntingQuantity: document.querySelector("#buntingQuantity"),
  genericProductType: document.querySelector("#genericProductType"),
  genericQuantity: document.querySelector("#genericQuantity"),
  otherPrintingItem: document.querySelector("#otherPrintingItem"),
  otherQuantity: document.querySelector("#otherQuantity"),
  deliverySelect: document.querySelector("#deliverySelect"),
  pickupAddress: document.querySelector("#pickupAddress"),
  summaryUnitPrice: document.querySelector("#summaryUnitPrice"),
  summaryQuantity: document.querySelector("#summaryQuantity"),
  summaryPrintingPrice: document.querySelector("#summaryPrintingPrice"),
  summaryPostage: document.querySelector("#summaryPostage"),
  summaryTotal: document.querySelector("#summaryTotal"),
  pricingNote: document.querySelector("#pricingNote"),
  customerName: document.querySelector("#customerName"),
  customerPhone: document.querySelector("#customerPhone"),
  customerEmail: document.querySelector("#customerEmail"),
  customerAddress: document.querySelector("#customerAddress"),
  artworkInput: document.querySelector("#artworkInput"),
  fileStatus: document.querySelector("#fileStatus"),
  remarkInput: document.querySelector("#remarkInput"),
  previewStatus: document.querySelector("#previewStatus"),
  mockupStage: document.querySelector("#mockupStage"),
  mockupObject: document.querySelector("#mockupObject"),
  stickerShapePreview: document.querySelector("#stickerShapePreview"),
  stickerSizeBadge: document.querySelector("#stickerSizeBadge"),
  previewTitle: document.querySelector("#previewTitle"),
  previewDescription: document.querySelector("#previewDescription"),
  referenceImage: document.querySelector("#referenceImage"),
  directWhatsApp: document.querySelector("#directWhatsApp"),
};

function formatMoney(value) {
  return money.format(Number(value || 0)).replace("MYR", "RM");
}

function activeProduct() {
  return productCategories.find((product) => product.id === state.activeProductId) || productCategories[0];
}

function selectedText(select) {
  return select.options[select.selectedIndex]?.textContent.trim() || "";
}

function numericValue(input, fallback = 1) {
  const value = Number(input.value);
  if (!Number.isFinite(value) || value <= 0) {
    input.value = fallback;
    return fallback;
  }
  return value;
}

function integerValue(input, fallback = 1) {
  const value = Math.floor(Number(input.value));
  if (!Number.isFinite(value) || value < 1) {
    input.value = fallback;
    return fallback;
  }
  input.value = value;
  return value;
}

function renderProductCategoryCard(product) {
  const imageMarkup = product.image
    ? `<img src="${product.image}" alt="${product.title}" loading="lazy" />`
    : `<div class="placeholder-art ${product.mode === "generic" ? "alt" : ""}">${product.placeholder || product.title}</div>`;

  return `
    <a class="category-card" href="#product=${product.id}" data-product-card="${product.id}">
      <span class="category-image">${imageMarkup}</span>
      <span class="category-body">
        <span class="category-meta">${product.category}</span>
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <span class="category-button">View Details / Order Now</span>
      </span>
    </a>
  `;
}

function renderProductCategories() {
  selectors.categoryGrid.innerHTML = productCategories.map(renderProductCategoryCard).join("");

  selectors.categoryGrid.querySelectorAll("[data-product-card]").forEach((card) => {
    card.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveProduct(card.dataset.productCard, true);
    });
  });
}

function renderPortfolioTabs() {
  const categories = ["All", ...new Set(portfolioItems.map((item) => item.category))];
  selectors.portfolioTabs.innerHTML = categories
    .map(
      (category) => `
        <button class="portfolio-tab ${category === state.portfolioFilter ? "active" : ""}" type="button" data-portfolio-filter="${category}">
          ${category}
        </button>
      `,
    )
    .join("");

  selectors.portfolioTabs.querySelectorAll("[data-portfolio-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.portfolioFilter = button.dataset.portfolioFilter;
      renderPortfolioTabs();
      renderPortfolioGrid();
    });
  });
}

function renderPortfolioGrid() {
  const filteredItems =
    state.portfolioFilter === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === state.portfolioFilter);

  selectors.portfolioGrid.innerHTML = filteredItems
    .map(
      (item) => `
        <article class="portfolio-card reveal-layer" style="--portfolio-bg: ${item.color}">
          <span class="category-meta">${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join("");

  observeRevealLayers();
}

function stickerTierPrice(size, quantity) {
  const tier = size.tiers.find((item) => quantity >= item.min && quantity <= item.max);
  return tier ? tier.price : size.tiers.at(-1).price;
}

function getStickerQuantity() {
  if (selectors.stickerQuantitySelect.value === "custom") {
    return integerValue(selectors.customStickerQuantity, 100);
  }

  const value = Number(selectors.stickerQuantitySelect.value);
  selectors.customStickerQuantity.value = value;
  return value;
}

function getStickerSize() {
  const selected = stickerSizes[selectors.stickerSizeSelect.value] || stickerSizes["5x5"];

  if (selected.quote) {
    const width = numericValue(selectors.customStickerWidth, 5);
    const height = numericValue(selectors.customStickerHeight, 5);
    return { ...selected, label: `${width}cm x ${height}cm`, width, height };
  }

  return selected;
}

function deliveryCost() {
  return Number(selectors.deliverySelect.value);
}

function deliveryLabel() {
  return selectedText(selectors.deliverySelect);
}

function calculateStickerPrice(product) {
  const size = getStickerSize();
  const quantity = getStickerQuantity();
  const postage = deliveryCost();
  const shape = selectedText(selectors.stickerShapeSelect);
  const material = selectedText(selectors.stickerMaterialSelect);
  const usage = selectedText(selectors.stickerUsageSelect);
  const type = selectedText(selectors.stickerTypeSelect);

  if (size.quote) {
    return {
      product,
      mode: "sticker",
      quote: true,
      type,
      size: size.label,
      shape,
      quantity,
      material,
      usage,
      unitLabel: "To confirm",
      printing: 0,
      postage,
      total: 0,
      note: "Final price depends on artwork, size and finishing.",
    };
  }

  const unit = stickerTierPrice(size, quantity);
  const printing = unit * quantity;
  const total = printing + postage;

  return {
    product,
    mode: "sticker",
    quote: false,
    estimated: Boolean(size.estimated),
    type,
    size: size.label,
    shape,
    quantity,
    material,
    usage,
    unit,
    unitLabel: `${formatMoney(unit)} / pcs`,
    printing,
    postage,
    total,
    note: size.estimated
      ? "This size is an estimated reference. Final price depends on artwork, size and finishing."
      : "Final price depends on artwork, size and finishing.",
  };
}

function calculateBannerPrice(product) {
  const width = numericValue(selectors.bannerWidth, 3);
  const height = numericValue(selectors.bannerHeight, 2);
  const quantity = integerValue(selectors.bannerQuantity, 1);
  const unit = selectors.bannerUnit.value;
  const widthFeet = unit === "cm" ? width / 30.48 : width;
  const heightFeet = unit === "cm" ? height / 30.48 : height;
  const area = widthFeet * heightFeet;
  const unitPrice = 2.5;
  const printing = area * unitPrice * quantity;
  const eyelet = selectors.bannerEyelet.value === "1" ? 5 * quantity : 0;
  const postage = deliveryCost();

  return {
    product,
    mode: "banner",
    quote: false,
    type: "Banner - Tarpaulin",
    size: `${width}${unit} x ${height}${unit}`,
    shape: "-",
    quantity,
    material: "Tarpaulin",
    usage: "Promotion / Advertising",
    unitLabel: `${formatMoney(unitPrice)} / sq ft`,
    printing,
    addon: eyelet,
    postage,
    total: printing + eyelet + postage,
    note: "Final price depends on artwork, size and finishing.",
  };
}

function calculateBuntingPrice(product) {
  const type = selectedText(selectors.buntingType);
  const size = selectedText(selectors.buntingSize);
  const quantity = integerValue(selectors.buntingQuantity, 1);
  const isCustom = size.toLowerCase().includes("custom");
  const unitPrice = selectors.buntingType.value === "normal" ? 80 : 110;
  const postage = deliveryCost();
  const printing = isCustom ? 0 : unitPrice * quantity;

  return {
    product,
    mode: "bunting",
    quote: isCustom,
    type,
    size,
    shape: "-",
    quantity,
    material: "Bunting Material",
    usage: "Event / Promotion Display",
    unitLabel: isCustom ? "To confirm" : `${formatMoney(unitPrice)} / pcs`,
    printing,
    postage,
    total: isCustom ? 0 : printing + postage,
    note: "Final price depends on artwork, size and finishing.",
  };
}

function calculateGenericPrice(product) {
  const quantity = integerValue(selectors.genericQuantity, 100);
  const postage = deliveryCost();

  return {
    product,
    mode: "generic",
    quote: true,
    type: selectors.genericProductType.value,
    size: "To confirm",
    shape: "-",
    quantity,
    material: "To confirm",
    usage: "To confirm",
    unitLabel: "To confirm",
    printing: 0,
    postage,
    total: 0,
    note: "We will follow up with final pricing after checking artwork and requirements.",
  };
}

function calculateOtherPrice(product) {
  const quantity = integerValue(selectors.otherQuantity, 100);
  const postage = deliveryCost();

  return {
    product,
    mode: "other",
    quote: true,
    type: selectedText(selectors.otherPrintingItem),
    size: "N/A",
    shape: "-",
    quantity,
    material: "To confirm",
    usage: "Other Printing",
    unitLabel: "Follow Up",
    printing: 0,
    postage,
    total: 0,
    note: "We will follow up with you after receiving this request. 我们收到后会联系你跟进。",
  };
}

function calculateCurrentOrder() {
  const product = activeProduct();

  if (product.mode === "sticker") return calculateStickerPrice(product);
  if (product.mode === "banner") return calculateBannerPrice(product);
  if (product.mode === "bunting") return calculateBuntingPrice(product);
  if (product.mode === "other") return calculateOtherPrice(product);
  return calculateGenericPrice(product);
}

function estimatedPriceMessage(result) {
  if (result.quote) return "To confirm";

  const suffix =
    result.mode === "sticker" || result.mode === "banner" || result.estimated
      ? " (estimated, final price needs confirmation)"
      : "";

  return `${formatMoney(result.total)}${suffix}`;
}

function updateSummary(result) {
  selectors.summaryUnitPrice.textContent = result.unitLabel;
  selectors.summaryQuantity.textContent = `${result.quantity} pcs`;
  selectors.summaryPrintingPrice.textContent = result.quote
    ? "To confirm"
    : formatMoney((result.printing || 0) + (result.addon || 0));
  selectors.summaryPostage.textContent = formatMoney(result.postage);
  selectors.summaryTotal.textContent = result.quote ? "To confirm" : formatMoney(result.total);
  selectors.pricingNote.textContent = result.note;
}

function showControls(mode) {
  selectors.stickerControls.hidden = mode !== "sticker";
  selectors.bannerControls.hidden = mode !== "banner";
  selectors.buntingControls.hidden = mode !== "bunting";
  selectors.genericControls.hidden = mode !== "generic";
  selectors.otherControls.hidden = mode !== "other";
}

function objectClassForUsage(usageValue) {
  const map = {
    product: "jar",
    bottle: "bottle",
    jar: "jar",
    notebook: "notebook",
    packaging: "packaging",
  };

  return map[usageValue] || "jar";
}

function updateStickerPreview(result) {
  const selectedSize = getStickerSize();
  const usageValue = selectors.stickerUsageSelect.value;
  const shapeValue = selectors.stickerShapeSelect.value;
  const maxSide = Math.min(190, 88 + Math.max(selectedSize.width, selectedSize.height) * 7.5);
  let previewWidth = maxSide * (selectedSize.width / Math.max(selectedSize.width, selectedSize.height));
  let previewHeight = maxSide * (selectedSize.height / Math.max(selectedSize.width, selectedSize.height));

  if (shapeValue === "rectangle") {
    previewWidth = Math.max(previewWidth, previewHeight * 1.55);
    previewHeight = Math.min(previewHeight, previewWidth * 0.58);
  }

  if (shapeValue === "oval") {
    previewWidth = Math.max(previewWidth, previewHeight * 1.45);
  }

  if (shapeValue === "circle") {
    const circleSize = Math.max(previewWidth, previewHeight);
    previewWidth = circleSize;
    previewHeight = circleSize;
  }

  selectors.mockupObject.className = `mockup-object ${objectClassForUsage(usageValue)}`;
  selectors.stickerShapePreview.hidden = false;
  selectors.stickerShapePreview.className = `sticker-shape ${shapeValue}`;
  selectors.stickerShapePreview.style.setProperty("--sticker-w", `${previewWidth}px`);
  selectors.stickerShapePreview.style.setProperty("--sticker-h", `${previewHeight}px`);
  selectors.stickerSizeBadge.textContent = result.size;
  selectors.previewStatus.textContent = `${result.size} / ${result.usage}`;
  selectors.previewTitle.textContent = `${result.type} mockup`;
  selectors.previewDescription.textContent =
    "Preview changes based on selected size, shape and usage. You can replace this mockup with real product photos later.";
}

function updateBasicPreview(result) {
  const className =
    result.mode === "banner"
      ? "banner-print"
      : result.mode === "bunting"
        ? "bunting-print"
        : "generic-print";

  selectors.mockupObject.className = `mockup-object ${className}`;
  selectors.stickerShapePreview.hidden = false;
  selectors.stickerShapePreview.className = "sticker-shape rectangle";
  selectors.stickerShapePreview.style.setProperty("--sticker-w", result.mode === "bunting" ? "118px" : "190px");
  selectors.stickerShapePreview.style.setProperty("--sticker-h", result.mode === "bunting" ? "150px" : "112px");
  selectors.stickerSizeBadge.textContent = result.product.title;
  selectors.previewStatus.textContent = `${result.product.title} / ${result.quantity} pcs`;
  selectors.previewTitle.textContent = `${result.product.title} preview`;
  selectors.previewDescription.textContent =
    "This is a clean placeholder mockup. Replace it with real product images in the product data when available.";
}

function renderInteractiveProductPreview(result) {
  if (result.mode === "sticker") {
    updateStickerPreview(result);
  } else {
    updateBasicPreview(result);
  }

  const product = result.product;
  selectors.referenceImage.src = product.image || "assets/images/other-printing.png";
  selectors.referenceImage.alt = `${product.title} reference`;
}

function syncFormVisibility() {
  const product = activeProduct();
  const isCustomStickerSize = selectors.stickerSizeSelect.value === "custom";
  const isCustomStickerQuantity = selectors.stickerQuantitySelect.value === "custom";

  showControls(product.mode);
  selectors.customSizeFields.hidden = !isCustomStickerSize;
  selectors.customStickerQuantity.hidden = !isCustomStickerQuantity;
  selectors.pickupAddress.hidden = selectors.deliverySelect.value !== "0";

  if (!isCustomStickerQuantity) {
    selectors.customStickerQuantity.value = selectors.stickerQuantitySelect.value;
  }
}

function updateOrderForm() {
  syncFormVisibility();
  const result = calculateCurrentOrder();
  updateSummary(result);
  renderInteractiveProductPreview(result);
}

function setActiveProduct(productId, shouldScroll = false) {
  const product = productCategories.find((item) => item.id === productId);
  if (!product) return;

  state.activeProductId = product.id;
  selectors.activeProductId.value = product.id;
  selectors.breadcrumbProduct.textContent = product.title;
  selectors.productCategory.textContent = product.category;
  selectors.productTitle.textContent = product.title;
  selectors.productSubtitle.textContent = product.subtitle;
  selectors.genericProductType.value = product.title;

  if (product.preset?.stickerType) selectors.stickerTypeSelect.value = product.preset.stickerType;
  if (product.preset?.material) selectors.stickerMaterialSelect.value = product.preset.material;
  if (product.preset?.usage) selectors.stickerUsageSelect.value = product.preset.usage;

  document.querySelectorAll("[data-product-card]").forEach((card) => {
    card.classList.toggle("active", card.dataset.productCard === product.id);
  });

  document.querySelectorAll("[data-product-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.productLink === product.id);
  });

  updateOrderForm();

  if (location.hash !== `#product=${product.id}`) {
    history.replaceState(null, "", `#product=${product.id}`);
  }

  if (shouldScroll) {
    document.querySelector("#product-detail").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function customerAddressText() {
  const address = selectors.customerAddress.value.trim();
  if (selectors.deliverySelect.value === "0") {
    return address ? `${address} | Self pickup at ${pickupAddress}` : `Self pickup at ${pickupAddress}`;
  }
  return address || "-";
}

function remarkText(result) {
  const remarks = selectors.remarkInput.value.trim();
  const files = Array.from(selectors.artworkInput.files || []).map((file) => file.name);
  const parts = [];

  if (remarks) parts.push(remarks);
  if (files.length) parts.push(`Artwork file selected: ${files.join(", ")}`);
  if (result.quote) parts.push("Please follow up and confirm final price.");

  return parts.length ? parts.join(" | ") : "-";
}

function buildWhatsAppMessage(result) {
  return [
    "Hello, I would like to order:",
    `Product: ${result.product.title}`,
    `Type: ${result.type}`,
    `Size: ${result.size}`,
    `Shape: ${result.shape}`,
    `Quantity: ${result.quantity}`,
    `Material: ${result.material}`,
    `Usage: ${result.usage}`,
    `Estimated Price: ${estimatedPriceMessage(result)}`,
    `Delivery: ${deliveryLabel()}`,
    `Name: ${selectors.customerName.value.trim() || "-"}`,
    `Phone: ${selectors.customerPhone.value.trim() || "-"}`,
    `Email: ${selectors.customerEmail.value.trim() || "-"}`,
    `Address: ${customerAddressText()}`,
    `Remark: ${remarkText(result)}`,
  ].join("\n");
}

function openWhatsAppOrder(event) {
  event.preventDefault();
  const result = calculateCurrentOrder();
  const message = buildWhatsAppMessage(result);
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

function bindNavigation() {
  selectors.navToggle.addEventListener("click", () => {
    const isOpen = selectors.primaryNav.classList.toggle("is-open");
    selectors.navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  selectors.primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      selectors.primaryNav.classList.remove("is-open");
      selectors.navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });

  document.querySelectorAll("[data-product-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveProduct(link.dataset.productLink, true);
    });
  });
}

function bindFormEvents() {
  [
    selectors.stickerTypeSelect,
    selectors.stickerSizeSelect,
    selectors.customStickerWidth,
    selectors.customStickerHeight,
    selectors.stickerShapeSelect,
    selectors.stickerQuantitySelect,
    selectors.customStickerQuantity,
    selectors.stickerMaterialSelect,
    selectors.stickerUsageSelect,
    selectors.bannerWidth,
    selectors.bannerHeight,
    selectors.bannerUnit,
    selectors.bannerQuantity,
    selectors.bannerEyelet,
    selectors.buntingType,
    selectors.buntingSize,
    selectors.buntingQuantity,
    selectors.genericQuantity,
    selectors.otherPrintingItem,
    selectors.otherQuantity,
    selectors.deliverySelect,
  ].forEach((element) => {
    element.addEventListener("input", updateOrderForm);
    element.addEventListener("change", updateOrderForm);
  });

  selectors.artworkInput.addEventListener("change", () => {
    const files = Array.from(selectors.artworkInput.files || []);
    selectors.fileStatus.textContent = files.length
      ? files.map((file) => file.name).join(", ")
      : "Click to select artwork file";
  });

  selectors.orderForm.addEventListener("submit", openWhatsAppOrder);
}

function bindHashRouting() {
  window.addEventListener("hashchange", () => {
    const params = new URLSearchParams(location.hash.replace(/^#/, ""));
    const productId = params.get("product");
    if (productId) setActiveProduct(productId, true);
  });
}

let revealObserver;
function observeRevealLayers() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal-layer").forEach((element) => element.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );
  }

  document.querySelectorAll(".reveal-layer:not(.is-visible)").forEach((element) => {
    revealObserver.observe(element);
  });
}

function updateDirectWhatsAppLink() {
  const text = "Hello, I would like to ask about printing service.";
  selectors.directWhatsApp.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function initFromHash() {
  const params = new URLSearchParams(location.hash.replace(/^#/, ""));
  const productId = params.get("product");

  if (productId && productCategories.some((product) => product.id === productId)) {
    setActiveProduct(productId);
    requestAnimationFrame(() => {
      document.querySelector("#product-detail").scrollIntoView({ behavior: "auto", block: "start" });
    });
    return;
  }

  setActiveProduct("label-sticker");
}

function init() {
  renderProductCategories();
  renderPortfolioTabs();
  renderPortfolioGrid();
  bindNavigation();
  bindFormEvents();
  bindHashRouting();
  updateDirectWhatsAppLink();
  initFromHash();
  observeRevealLayers();
}

init();
