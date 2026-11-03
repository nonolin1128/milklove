/* ═══════════════════════════════════════════════════════════
   render.js ── 把行程資料畫成 HTML
   純函式，不碰 DOM、不管捲動，方便單獨測
   ═══════════════════════════════════════════════════════════ */

import { TYPES, TINT, ACCENTS, SLOTS, guessType, slotsFor } from "./config.js";
import { esc, fmtDate, todayISO, mapQuery, safeUrl } from "./util.js";

const MAP_SEARCH = "https://www.google.com/maps/search/?api=1&query=";
const MAP_DIR    = "https://www.google.com/maps/dir/?api=1&destination=";

/* 項目的圖示與分色：有填 type 就用，沒填就照名稱猜；icon 可以單獨覆寫圖示 */
function typeOf(item) {
  const type = TYPES[TYPES[item.type] ? item.type : guessType(item.name || "")];
  return { ...type, icon: item.icon || type.icon };
}

/* 一組行程：收成一張卡片，點開才看到照片和每一站 */
function renderGroup(item, city) {
  const { icon, group } = typeOf(item);
  return `
      <li class="item">
        <div class="item__time">${esc(item.time || "")}</div>
        <details class="group">
          <summary class="item__name group__head">
            <span class="item__icon" style="--tint:${TINT[group]}" aria-hidden="true">${icon}</span>
            <span>${esc(item.name)}</span>
            <span class="group__count">${item.stops.length} 項</span>
          </summary>
          ${item.image ? `<img class="group__img" src="${esc(item.image)}" alt="${esc(item.name)}"
                style="object-position:center ${esc(item.focus || "center")}" loading="lazy" decoding="async">` : ""}
          <ul class="group__stops">${item.stops.map((stop) => renderItem(stop, city)).join("")}
          </ul>
        </details>
      </li>`;
}

/* 一個行程項目 */
export function renderItem(item, city) {
  if (item.stops) return renderGroup(item, city);
  const { icon, group } = typeOf(item);
  const q = mapQuery(item, city);

  /* 按鈕列：有地點就給地圖／導航，有連結就多一顆。全空則整列不出現 */
  const btn = (href, label, cls = "act") =>
    `<a class="${cls}" target="_blank" rel="noopener" href="${href}">${label}</a>`;

  const btns = [];
  if (q) {
    btns.push(btn(`${MAP_SEARCH}${q}`, "📍 地圖"));
    btns.push(btn(`${MAP_DIR}${q}`, "🧭 導航", "act act--primary"));
  }
  const ig = safeUrl(item.ig);
  if (ig) btns.push(btn(esc(ig), "📷 IG"));
  const video = safeUrl(item.video);
  if (video) btns.push(btn(esc(video), "▶ 影片"));

  const acts = btns.length
    ? `
        <div class="acts">${btns.join("")}</div>`
    : "";

  return `
      <li class="item${item.optional ? " item--optional" : ""}">
        <div class="item__time">${esc(item.time || "")}</div>
        <div>
          <div class="item__name">
            <span class="item__icon" style="--tint:${TINT[group]}" aria-hidden="true">${icon}</span>
            <span>${esc(item.name)}</span>
            ${item.optional ? `<span class="tag-optional">備選</span>` : ""}
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

  /* focus 決定 16:9 裁切時保住畫面的哪一段（直式照片一定要給，
     不然置中裁切會把臉和招牌切掉）。沒給就置中。 */
  const hero = day.image
    ? `<img src="${esc(day.image)}" alt="Day ${n} ${esc(day.city || "")}"
            style="object-position:center ${esc(day.focus || "center")}"
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

/* 總表：直欄是每一天、橫列是上午／下午／晚上。每格都能點，跳到那天的詳細頁
   類型看圖示就夠了，所以總表不分色；只有 highlight 的主要活動日用玫瑰色 */
export function renderOverview(days) {
  const today = todayISO();

  const heads = days.map((day, i) => {
    const { label, iso } = fmtDate(day.date);
    return `
          <th scope="col" data-section="${i}"${day.highlight ? ' class="ov-head--highlight"' : ""}>
            <button class="ov-day" data-day="${i}">
              <strong>Day ${i + 1}</strong>
              <span>${label}</span>
              ${day.badge ? `<span class="ov-day__tag">${esc(day.badge)}</span>` : ""}
              ${iso === today ? `<span class="ov-day__tag">今天</span>` : ""}
            </button>
          </th>`;
  }).join("");

  const cell = (day, i, slot) => {
    const items = day.items || [];
    const slots = slotsFor(items);
    const chips = items.map((item, j) => {
      if (slots[j] !== slot) return "";
      const { icon } = typeOf(item);
      return `
              <button class="ov-item${day.highlight ? " ov-item--highlight" : ""}${item.optional ? " ov-item--optional" : ""}" data-day="${i}" data-item="${j}">
                <span class="ov-item__icon" aria-hidden="true">${icon}</span>
                <span>
                  ${item.time ? `<span class="ov-item__time">${esc(item.time)}</span>` : ""}
                  <span class="ov-item__name">${esc(item.name)}</span>
                  ${item.optional ? `<span class="tag-optional">備選</span>` : ""}
                </span>
              </button>`;
    }).join("");
    return `
          <td>${chips}
          </td>`;
  };

  const rows = SLOTS.map((name, slot) => `
        <tr>
          <th scope="row" class="ov-slot">${name}</th>${days.map((day, i) => cell(day, i, slot)).join("")}
        </tr>`).join("");

  return `
    <header class="overview__head">
      <h2 class="overview__title" id="overviewTitle">行程總表</h2>
      <button class="overview__close" data-close aria-label="關閉總表">✕</button>
    </header>
    <div class="overview__scroll">
      <table class="ov-table" style="--ov-days:${days.length}">
        <thead>
          <tr>
            <td class="ov-corner"></td>${heads}
          </tr>
        </thead>
        <tbody>${rows}
        </tbody>
      </table>
    </div>`;
}

/* 清單跳窗：checked 是已打勾的名字（Set） */
export function renderChecklist(sections, checked) {
  const row = (item) => {
    const q = mapQuery(item, "");
    return `
          <li class="check">
            <label class="check__label">
              <input type="checkbox" data-name="${esc(item.name)}"${checked.has(item.name) ? " checked" : ""}>
              <span>${esc(item.name)}</span>
            </label>
            ${item.address && q ? `<div class="acts">
              <a class="act" target="_blank" rel="noopener" href="${MAP_SEARCH}${q}">📍 地圖</a>
              <a class="act act--primary" target="_blank" rel="noopener" href="${MAP_DIR}${q}">🧭 導航</a>
            </div>` : ""}
          </li>`;
  };

  const blocks = sections.map((s) => `
      <section class="checklist__section">
        <h3 class="checklist__heading"><span aria-hidden="true">${s.icon}</span> ${esc(s.title)}</h3>
        <ul>${s.items.map(row).join("")}
        </ul>
      </section>`).join("");

  return `
    <header class="overview__head">
      <h2 class="overview__title" id="checklistTitle">清單</h2>
      <button class="overview__close" data-close aria-label="關閉清單">✕</button>
    </header>
    <div class="checklist__body">${blocks}
    </div>`;
}

/* 主要活動日強制用粉，其餘三色輪替 */
export function accentFor(day, i) {
  return day && day.highlight ? ACCENTS[0] : ACCENTS[i % ACCENTS.length];
}
