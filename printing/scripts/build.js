const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(root, "index.html"), path.join(dist, "index.html"));
fs.cpSync(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });
fs.copyFileSync(path.join(root, "robots.txt"), path.join(dist, "robots.txt"));
fs.copyFileSync(path.join(root, "sitemap.xml"), path.join(dist, "sitemap.xml"));

console.log("Build complete: dist/");
