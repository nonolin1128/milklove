/* ═══════════════════════════════════════════════════════════
   app.js ── 掛上畫面、左右滑換天、圓點、鍵盤、hash
   ═══════════════════════════════════════════════════════════ */

import { TRIP } from "./trip.js";
import { renderDay, accentFor } from "./render.js";
import { fmtDate, todayISO } from "./util.js";

const deck    = document.getElementById("deck");
const dotsEl  = document.getElementById("dots");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
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
  if (e.key === "ArrowLeft")  goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
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
