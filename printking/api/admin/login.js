const { checkPassword, setSessionCookie } = require("../_lib/auth");
const { readJson, sendJson } = require("../_lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
  try {
    const body = await readJson(req);
    if (!checkPassword(body.password)) return sendJson(res, 401, { error: "Wrong password" });
    setSessionCookie(res);
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    return sendJson(res, 400, { error: error.message });
  }
};
