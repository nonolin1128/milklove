/* ═══════════════════════════════════════════════════════════
   csp-hash.mjs ── 重算 index.html 行內 script 的 CSP sha256
   只用 Node 內建模組，零依賴

   為什麼需要它：CSP 的 script-src 用 'sha256-…' 精確放行那一段
   行內 script，改動內容（連一個空白）hash 就不符、整段被擋掉。
   改完跑這行，<head> 裡的 hash 會自動更新。

   用法：npm run csp-hash
   ═══════════════════════════════════════════════════════════ */

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const FILE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "index.html");

const html = await readFile(FILE, "utf8");

const script = html.match(/<script>([\s\S]*?)<\/script>/);
if (!script) {
  console.error("index.html 裡找不到行內 <script>，沒事可做。");
  process.exit(1);
}

const want = createHash("sha256").update(script[1], "utf8").digest("base64");

/* CSP 裡現有的 sha256 值 */
const current = html.match(/'sha256-([A-Za-z0-9+/=]+)'/);
if (!current) {
  console.error("<head> 的 CSP 裡找不到 'sha256-…'，請先檢查 meta 標籤。");
  process.exit(1);
}

if (current[1] === want) {
  console.log(`  hash 已是最新  sha256-${want}`);
  process.exit(0);
}

await writeFile(FILE, html.replace(current[0], `'sha256-${want}'`));
console.log(`  舊  sha256-${current[1]}`);
console.log(`  新  sha256-${want}`);
console.log("  index.html 已更新。");
