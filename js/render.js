/* ═══════════════════════════════════════════════════════════
   render.js ── 把行程資料畫成 HTML
   純函式，不碰 DOM、不管捲動，方便單獨測
   ═══════════════════════════════════════════════════════════ */

import { TYPES, TINT, ACCENTS, guessType } from "./config.js";
import { esc, fmtDate, todayISO, mapQuery } from "./util.js";

const MAP_SEARCH = "https://www.google.com/maps/search/?api=1&query=";
const MAP_DIR    = "https://www.google.com/maps/dir/?api=1&destination=";

/* 一個行程項目 */
export function renderItem(item, city) {
  const type = TYPES[item.type] ? item.type : guessType(item.name || "");
  const { icon, group } = TYPES[type];
  const q = mapQuery(item, city);

  const acts = q
    ? `
        <div class="acts">
          <a class="act" target="_blank" rel="noopener"
             href="${MAP_SEARCH}${q}">📍 地圖</a>
          <a class="act act--primary" target="_blank" rel="noopener"
             href="${MAP_DIR}${q}">🧭 導航</a>
        </div>`
    : "";

  return `
      <li class="item">
        <div class="item__time">${esc(item.time || "")}</div>
        <div>
          <div class="item__name">
            <span class="item__icon" style="--tint:${TINT[group]}" aria-hidden="true">${icon}</span>
            <span>${esc(item.name)}</span>
          </div>
          ${item.address ? `<div class="item__addr">${esc(item.address)}</div>` : ""}
          ${item.note ? `<div class="item__note">${esc(item.note)}</div>` : ""}
          ${acts}
        </div>
      </li>`;
}

/* 一天一張卡 */
export function renderDay(day, i, tripTitle) {
  const a = accentFor(day, i);
  const { label, iso } = fmtDate(day.date);
  const n = i + 1;
  const where = day.city ? " · " + esc(day.city) : "";

  const hero = day.image
    ? `<img src="${esc(day.image)}" alt="Day ${n} ${esc(day.city || "")}"
            ${i === 0 ? "" : 'loading="lazy"'} decoding="async">`
    : "";

  return `
    <section class="day" id="day${n}"
             style="--accent:${a.bg};--accent-deep:${a.deep};--shadow:${a.shadow}">
      <div class="day__scroll">
        <header class="hero${day.image ? "" : " hero--blank"}">
          ${hero}
          <div class="hero__text">
            <div class="hero__trip">${esc(tripTitle)}</div>
            <div class="hero__day">DAY ${n}</div>
            <div class="hero__date">${label}${where}${
              day.badge ? `<span class="hero__badge">${esc(day.badge)}</span>` : ""
            }</div>
          </div>
        </header>
        <div class="daybar">
          <span class="daybar__dot" aria-hidden="true"></span>
          <span>Day ${n} · ${label}${where}</span>
          ${iso === todayISO() ? `<span class="daybar__today">今天</span>` : ""}
        </div>
        <ul class="items">${(day.items || []).map((it) => renderItem(it, day.city)).join("")}
        </ul>
      </div>
    </section>`;
}

/* 主要活動日強制用粉，其餘三色輪替 */
export function accentFor(day, i) {
  return day && day.highlight ? ACCENTS[0] : ACCENTS[i % ACCENTS.length];
}
