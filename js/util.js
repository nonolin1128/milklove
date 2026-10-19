/* ═══════════════════════════════════════════════════════════
   util.js ── 跳脫、日期格式、Google Maps 搜尋字串
   ═══════════════════════════════════════════════════════════ */

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/* 行程文字是手打的，進 HTML 前一律跳脫 */
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ENTITIES[c]);

const WEEK = ["日", "一", "二", "三", "四", "五", "六"];

/* "2026-11-11" → { label: "11/11 (三)", iso: "2026-11-11" }
   用 new Date(y, m-1, d) 建本地時間，避免 UTC 時區把日期差一天 */
export function fmtDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return { label: String(iso), iso: String(iso) };
  const dt = new Date(y, m - 1, d);
  return {
    label: `${m}/${d} (${WEEK[dt.getDay()]})`,
    iso: `${y}-${pad(m)}-${pad(d)}`,
  };
}

export function todayISO() {
  const n = new Date();
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

/* 地圖搜尋字串，由準到不準依序取用：
     coords  "緯度,經度" —— 路邊攤、沒有店名的落點針只有這個找得到
     address 店名或地址
     名稱 + 城市
   Google Maps 的 query / destination 參數兩者都吃座標，所以不用分開處理。
   回傳空字串代表這項不該顯示地圖按鈕 */
export function mapQuery(item, city) {
  if (item.nomap) return "";
  const q = (item.coords || item.address || `${item.name || ""} ${city || ""}`).trim();
  return q ? encodeURIComponent(q) : "";
}
