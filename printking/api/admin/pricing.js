const { isAuthenticated } = require("../_lib/auth");
const { readJson, sendJson } = require("../_lib/http");
const { getPricing, savePricing, storageMode } = require("../_lib/storage");

module.exports = async function handler(req, res) {
  if (!isAuthenticated(req)) return sendJson(res, 401, { error: "Unauthorized" });

  try {
    if (req.method === "GET") {
      const pricing = await getPricing();
      return sendJson(res, 200, { pricing, storageMode: storageMode() });
    }

    if (req.method === "PUT") {
      const body = await readJson(req);
      const pricing = await savePricing(body);
      return sendJson(res, 200, { pricing, storageMode: storageMode() });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
};
