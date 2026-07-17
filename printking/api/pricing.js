const { sendJson } = require("./_lib/http");
const { getPricing, publicPricing, storageMode } = require("./_lib/storage");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });
  try {
    const pricing = await getPricing();
    return sendJson(res, 200, { pricing: publicPricing(pricing), storageMode: storageMode() });
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
};
