const defaultPricing = {
  version: 1,
  updatedAt: "2026-07-07T00:00:00.000Z",
  settings: {
    whatsappNumber: "601117761934",
    postageWest: 8,
    postageEast: 30,
    pickupAddress: "3424, Jalan Pekeliling Tanjung 27/1, Kawasan Perindustrian Indahpura, 81000 Kulai, Johor Darul Ta'zim"
  },
  rows: [
    { id: "label-5x5-1", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "5cm x 5cm", basis: "pcs", minQty: 1, maxQty: 999, unitPrice: 0.15, unitCost: 0.05, formula: "tier", status: "Active", enabled: true, notes: "White Sticker - Essen; lamination fixed None" },
    { id: "label-5x5-2", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "5cm x 5cm", basis: "pcs", minQty: 1000, maxQty: 4999, unitPrice: 0.12, unitCost: 0.04, formula: "tier", status: "Active", enabled: true, notes: "White Sticker - Essen; lamination fixed None" },
    { id: "label-5x5-3", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "5cm x 5cm", basis: "pcs", minQty: 5000, maxQty: null, unitPrice: 0.07, unitCost: 0.03, formula: "tier", status: "Active", enabled: true, notes: "White Sticker - Essen; lamination fixed None" },
    { id: "label-6x6-1", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "6cm x 6cm", basis: "pcs", minQty: 1, maxQty: 999, unitPrice: 0.17, unitCost: 0.06, formula: "tier", status: "Estimated", enabled: true, notes: "Estimated reference price" },
    { id: "label-6x6-2", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "6cm x 6cm", basis: "pcs", minQty: 1000, maxQty: 4999, unitPrice: 0.14, unitCost: 0.05, formula: "tier", status: "Estimated", enabled: true, notes: "Estimated reference price" },
    { id: "label-6x6-3", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "6cm x 6cm", basis: "pcs", minQty: 5000, maxQty: null, unitPrice: 0.09, unitCost: 0.04, formula: "tier", status: "Estimated", enabled: true, notes: "Estimated reference price" },
    { id: "label-7x7-1", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "7cm x 7cm", basis: "pcs", minQty: 1, maxQty: 999, unitPrice: 0.19, unitCost: 0.07, formula: "tier", status: "Estimated", enabled: true, notes: "Estimated reference price" },
    { id: "label-7x7-2", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "7cm x 7cm", basis: "pcs", minQty: 1000, maxQty: 4999, unitPrice: 0.15, unitCost: 0.06, formula: "tier", status: "Estimated", enabled: true, notes: "Estimated reference price" },
    { id: "label-7x7-3", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "7cm x 7cm", basis: "pcs", minQty: 5000, maxQty: null, unitPrice: 0.10, unitCost: 0.04, formula: "tier", status: "Estimated", enabled: true, notes: "Estimated reference price" },
    { id: "label-10x10-1", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "10cm x 10cm", basis: "pcs", minQty: 1, maxQty: 999, unitPrice: 0.25, unitCost: 0.10, formula: "tier", status: "Active", enabled: true, notes: "White Sticker - Essen; lamination fixed None" },
    { id: "label-10x10-2", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "10cm x 10cm", basis: "pcs", minQty: 1000, maxQty: 4999, unitPrice: 0.20, unitCost: 0.08, formula: "tier", status: "Active", enabled: true, notes: "White Sticker - Essen; lamination fixed None" },
    { id: "label-10x10-3", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "10cm x 10cm", basis: "pcs", minQty: 5000, maxQty: null, unitPrice: 0.15, unitCost: 0.06, formula: "tier", status: "Active", enabled: true, notes: "White Sticker - Essen; lamination fixed None" },
    { id: "label-15x15-1", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "15cm x 15cm", basis: "pcs", minQty: 1, maxQty: 999, unitPrice: 0.35, unitCost: 0.16, formula: "tier", status: "Active", enabled: true, notes: "White Sticker - Essen; lamination fixed None" },
    { id: "label-15x15-2", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "15cm x 15cm", basis: "pcs", minQty: 1000, maxQty: 4999, unitPrice: 0.30, unitCost: 0.13, formula: "tier", status: "Active", enabled: true, notes: "White Sticker - Essen; lamination fixed None" },
    { id: "label-15x15-3", group: "sticker", category: "Sticker", product: "Label Sticker", productSlug: "label-sticker", size: "15cm x 15cm", basis: "pcs", minQty: 5000, maxQty: null, unitPrice: 0.25, unitCost: 0.10, formula: "tier", status: "Active", enabled: true, notes: "White Sticker - Essen; lamination fixed None" },
    { id: "large-format-sticker", group: "sticker", category: "Sticker", product: "Large Format Sticker", productSlug: "large-format-sticker", size: "Custom size in cm", basis: "sq ft", minQty: null, maxQty: null, unitPrice: 1.80, unitCost: 0.90, formula: "area_sqft", status: "Active", enabled: true, notes: "CM converted to sq ft automatically" },
    { id: "light-box-sticker", group: "sticker", category: "Sticker", product: "Light Box Sticker", productSlug: "light-box-sticker", size: "Custom size in cm", basis: "sq ft", minQty: null, maxQty: null, unitPrice: 6.00, unitCost: 3.00, formula: "area_sqft", status: "Active", enabled: true, notes: "CM converted to sq ft automatically" },
    { id: "foamboard-mounting", group: "sticker", category: "Sticker Mounting", product: "Printing Sticker + Foam Board Mounting", productSlug: "foamboard-mounting", size: "Custom / selected size", basis: "sq ft", minQty: null, maxQty: null, unitPrice: 24.00, unitCost: 12.00, formula: "area_sqft", status: "Active", enabled: true, notes: "RM21 sticker + RM3 foam board; 5mm active only" },
    { id: "banner", group: "banner", category: "Banner", product: "Banner - Tarpaulin", productSlug: "banner", size: "Custom width x height", basis: "sq ft", minQty: null, maxQty: null, unitPrice: 2.50, unitCost: 1.20, formula: "area_sqft", status: "Active", enabled: true, notes: "Unit can be cm or feet" },
    { id: "banner-eyelet", group: "banner", category: "Banner", product: "Banner Eyelet", productSlug: "banner-eyelet", size: "Add-on", basis: "each", minQty: null, maxQty: null, unitPrice: 5.00, unitCost: 1.00, formula: "addon_each", status: "Active", enabled: true, notes: "Optional banner add-on" },
    { id: "bunting-roll", group: "bunting", category: "Bunting", product: "Roll Up Bunting / Stand", productSlug: "bunting-roll", size: "80cm x 200cm", basis: "pcs", minQty: null, maxQty: null, unitPrice: 110.00, unitCost: 65.00, formula: "fixed", status: "Active", enabled: true, notes: "Standard size" },
    { id: "bunting-normal", group: "bunting", category: "Bunting", product: "Normal Hanging Bunting", productSlug: "bunting-normal", size: "80cm x 200cm", basis: "pcs", minQty: null, maxQty: null, unitPrice: 80.00, unitCost: 45.00, formula: "fixed", status: "Active", enabled: true, notes: "Standard size" },
    { id: "bunting-custom", group: "bunting", category: "Bunting", product: "Custom Size Bunting", productSlug: "bunting-custom", size: "Custom width x height", basis: "sq ft", minQty: null, maxQty: null, unitPrice: 2.50, unitCost: 1.20, formula: "area_sqft", status: "Active", enabled: true, notes: "Custom size calculated by sq ft" },
    { id: "poster", group: "poster", category: "General Printing", product: "Poster", productSlug: "poster", size: "To confirm", basis: "quote", minQty: null, maxQty: null, unitPrice: null, unitCost: null, formula: "quote", status: "Quote", enabled: true, notes: "Follow-up quotation" },
    { id: "business-card", group: "business", category: "Business Printing", product: "Business Card", productSlug: "business-card", size: "To confirm", basis: "quote", minQty: null, maxQty: null, unitPrice: null, unitCost: null, formula: "quote", status: "Quote", enabled: true, notes: "Follow-up quotation" },
    { id: "custom-printing", group: "custom", category: "Custom Printing", product: "Custom Size Printing", productSlug: "custom-printing", size: "To confirm", basis: "quote", minQty: null, maxQty: null, unitPrice: null, unitCost: null, formula: "quote", status: "Quote", enabled: true, notes: "Follow-up quotation" },
    { id: "other-printing", group: "other", category: "Other Printing", product: "Other Printing", productSlug: "other-printing", size: "Business card / flyer / clothing / playing cards / red packet / calendar / flag / non woven bag / mouse pad / others", basis: "quote", minQty: null, maxQty: null, unitPrice: null, unitCost: null, formula: "quote", status: "Quote", enabled: true, notes: "Follow-up quotation" }
  ],
  history: []
};

function cloneDefaultPricing() {
  return JSON.parse(JSON.stringify(defaultPricing));
}

module.exports = { defaultPricing, cloneDefaultPricing };
