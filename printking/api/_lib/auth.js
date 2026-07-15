const crypto = require("crypto");

const COOKIE_NAME = "printking_admin";
const SESSION_MS = 1000 * 60 * 60 * 8;

function getSecret() {
  return process.env.AUTH_SECRET || "printking-local-dev-secret-change-me";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin1234";
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function timingEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(header.split(";").map((part) => part.trim().split("=")).filter((parts) => parts.length === 2));
}

function createToken() {
  const expires = Date.now() + SESSION_MS;
  const payload = "admin." + expires;
  return payload + "." + sign(payload);
}

function verifyToken(token) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const payload = parts[0] + "." + parts[1];
  const expected = sign(payload);
  if (!timingEqual(parts[2], expected)) return false;
  return Number(parts[1]) > Date.now();
}

function isAuthenticated(req) {
  const cookies = parseCookies(req);
  return verifyToken(cookies[COOKIE_NAME]);
}

function setSessionCookie(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", COOKIE_NAME + "=" + createToken() + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + Math.floor(SESSION_MS / 1000) + secure);
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", COOKIE_NAME + "=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
}

function checkPassword(password) {
  return timingEqual(password || "", getAdminPassword());
}

module.exports = { checkPassword, clearSessionCookie, isAuthenticated, setSessionCookie };
