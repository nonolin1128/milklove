/* ═══════════════════════════════════════════════════════════
   app.js ── 掛上畫面、左右滑換天、圓點、鍵盤、hash、總表
   ═══════════════════════════════════════════════════════════ */

import { TRIP } from "./trip.js";
import { renderDay, renderOverview, accentFor } from "./render.js";
import { fmtDate, todayISO } from "./util.js";

const deck    = document.getElementById("deck");
const dotsEl  = document.getElementById("dots");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const overview = document.getElementById("overview");
const openOverviewBtn = document.getElementById("openOverview");
const days    = TRIP.days || [];

document.title = TRIP.title || document.title;

deck.innerHTML = days.map((d, i) => renderDay(d, i, TRIP.title)).join("");
dotsEl.innerHTML = days
  .map((d, i) => `<button class="dot" data-i="${i}" aria-label="Day ${i + 1}"></button>`)
  .join("");

const dayEls = [...deck.children];
const dots   = [...dotsEl.children];

let current = -1;

function setCurrent(i) {
  current = i;
  const a = accentFor(days[i], i);
  dots.forEach((dot, j) => {
    const on = j === i;
    dot.setAttribute("aria-current", on ? "true" : "false");
    dot.style.background = on ? a.deep : "";   /* 當前圓點跟著那天的主題色 */
  });
  prevBtn.disabled = i === 0;
  nextBtn.disabled = i === days.length - 1;

  const hash = `#day${i + 1}`;
  if (location.hash !== hash) history.replaceState(null, "", hash);
}

function goTo(i, smooth = true) {
  i = Math.max(0, Math.min(days.length - 1, i));
  deck.scrollTo({ left: i * deck.clientWidth, behavior: smooth ? "smooth" : "auto" });
  setCurrent(i);
}

/* 滑到哪天就亮哪個圓點 */
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const i = dayEls.indexOf(e.target);
      if (i >= 0 && i !== current) setCurrent(i);
    }
  },
  { root: deck, threshold: 0.55 }
);
dayEls.forEach((el) => io.observe(el));

dotsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".dot");
  if (btn) goTo(Number(btn.dataset.i));
});
prevBtn.addEventListener("click", () => goTo(current - 1));
nextBtn.addEventListener("click", () => goTo(current + 1));

document.addEventListener("keydown", (e) => {
  if (overview.open) return;          /* 總表開著時，方向鍵不要動到後面的日卡 */
  if (e.key === "ArrowLeft")  goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
});

/* 總表：每次打開都重畫，「今天」標籤才不會隔夜過期 */
function openOverview() {
  overview.innerHTML = renderOverview(days);
  overview.showModal();

  /* 窄螢幕放不下 5 欄，直接橫向捲到正在看的那天 */
  const scroll = overview.querySelector(".overview__scroll");
  const head = overview.querySelector(`[data-section="${current}"]`);
  const corner = overview.querySelector(".ov-corner");
  scroll.scrollLeft += head.getBoundingClientRect().left - corner.getBoundingClientRect().right;
}

/* 捲到那天的第 j 項（沒給 j 就回頂部），閃一下讓眼睛找得到 */
function showItem(i, j) {
  const scroller = dayEls[i].querySelector(".day__scroll");
  const item = scroller.querySelectorAll(".items > .item")[j];
  if (!item) {
    scroller.scrollTop = 0;
    return;
  }
  const group = item.querySelector("details");
  if (group) group.open = true;       /* 一組行程要先展開，高度才算得準 */
  const bar = scroller.querySelector(".daybar");
  scroller.scrollTop += item.getBoundingClientRect().top
    - scroller.getBoundingClientRect().top - bar.offsetHeight - 10;
  item.classList.remove("item--flash");
  void item.offsetWidth;              /* 強制重排，連點同一項也會重播動畫 */
  item.classList.add("item--flash");
}

openOverviewBtn.addEventListener("click", openOverview);
overview.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) {
    overview.close();
    return;
  }
  const btn = e.target.closest("[data-day]");
  if (!btn) return;
  overview.close();
  const i = Number(btn.dataset.day);
  goTo(i, false);
  showItem(i, Number(btn.dataset.item));
});

/* 轉向或改變視窗寬度後，重新對齊到當前那天 */
let rsz;
window.addEventListener("resize", () => {
  clearTimeout(rsz);
  rsz = setTimeout(() => goTo(current, false), 120);
});

/* 進場落點：#dayN 優先 → 今天 → 第一天 */
function initialIndex() {
  const m = /^#day(\d+)$/.exec(location.hash);
  if (m) {
    const i = Number(m[1]) - 1;
    if (i >= 0 && i < days.length) return i;
  }
  const t = todayISO();
  const i = days.findIndex((d) => fmtDate(d.date).iso === t);
  return i >= 0 ? i : 0;
}
goTo(initialIndex(), false);
