/* ═══════════════════════════════════════════════════════════
   dev-server.mjs ── 本機預覽用的最小靜態 server
   只用 Node 內建模組，零依賴

   為什麼需要它：ES module 不能用 file:// 載入（瀏覽器把 file://
   的來源記為 null，CORS 檢查永遠不過），所以本機預覽需要一個
   真正的 http 位址。上線後 GitHub Pages 就是這個角色。
   ═══════════════════════════════════════════════════════════ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, resolve, dirname, extname, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

/* resolve 不會留下結尾斜線 —— 留著會讓底下的 startsWith 檢查永遠失敗 */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const START_PORT = Number(process.env.PORT) || 8000;

/* 副檔名 → Content-Type
   .js 一定要是 text/javascript，否則瀏覽器會拒絕當成模組執行 */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".mjs":  "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt":  "text/plain; charset=utf-8",
  ".md":   "text/markdown; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico":  "image/x-icon",
  ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let rel = decodeURIComponent(url.pathname);

    /* 擋掉 ../ 跳出專案資料夾 */
    rel = normalize(rel).replace(/^(\.\.[/\\])+/, "");
    let file = join(ROOT, rel);

    const info = await stat(file).catch(() => null);
    if (info?.isDirectory()) file = join(file, "index.html");

    /* 只允許專案資料夾底下的檔案 */
    if (!file.startsWith(ROOT + sep)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("403 Forbidden");
      return;
    }

    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",   /* 改完檔案重新整理就看到新的 */
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
  }
});

/* 連接埠被占用就換下一個 */
let port = START_PORT;
server.on("error", (e) => {
  if (e.code === "EADDRINUSE" && port < START_PORT + 20) {
    server.listen(++port, "127.0.0.1");
  } else {
    console.error(e.message);
    process.exit(1);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`\n  預覽網址  http://localhost:${port}`);
  console.log(`  停止      Control + C\n`);
});
