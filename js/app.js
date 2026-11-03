/* ═══════════════════════════════════════════════════════════
   app.js ── 掛上畫面、左右滑換天、圓點、鍵盤、hash、總表、清單、浮動小狗、離線
   ═══════════════════════════════════════════════════════════ */

import { TRIP } from "./trip.js";
import { renderDay, renderOverview, renderChecklist, accentFor } from "./render.js";
import { fmtDate, todayISO, mergeChecklist } from "./util.js";

const deck    = document.getElementById("deck");
const dotsEl  = document.getElementById("dots");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const overview = document.getElementById("overview");
const openOverviewBtn = document.getElementById("openOverview");
const checklist = document.getElementById("checklist");
const openChecklistBtn = document.getElementById("openChecklist");
const days    = TRIP.days || [];

document.title = TRIP.title || document.title;

deck.innerHTML = days.map((d, i) => renderDay(d, i)).join("");
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
  if (overview.open || checklist.open) return;   /* 跳窗開著時，方向鍵不要動到後面的日卡 */
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

/* 清單的打勾記錄存在這支手機；私密模式等情況讀寫會失敗，那就只是記不住 */
const CHECK_KEY = "milklove-checked";

function loadChecked() {
  try {
    return new Set(JSON.parse(localStorage.getItem(CHECK_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveChecked(checked) {
  try {
    localStorage.setItem(CHECK_KEY, JSON.stringify([...checked]));
  } catch {
    /* 存不了就算了，畫面上的勾勾還在 */
  }
}

/* 手機上對清單的新增、刪除，格式見 util.js 的 mergeChecklist */
const LIST_KEY = "milklove-list";

function loadEdits() {
  try {
    return JSON.parse(localStorage.getItem(LIST_KEY)) || {};
  } catch {
    return {};
  }
}

function saveEdits(edits) {
  try {
    localStorage.setItem(LIST_KEY, JSON.stringify(edits));
  } catch {
    /* 存不了的話，這次的增刪重新整理後就會消失 */
  }
}

function currentSections() {
  return mergeChecklist(TRIP.checklist || [], loadEdits());
}

/* 重畫清單，捲動位置留在原地 */
function drawChecklist() {
  const top = checklist.querySelector(".checklist__body")?.scrollTop ?? 0;
  checklist.innerHTML = renderChecklist(currentSections(), loadChecked());
  checklist.querySelector(".checklist__body").scrollTop = top;
}

function addListItem(title, name) {
  const edits = loadEdits();
  const edit = (edits[title] ||= { added: [], removed: [] });
  if (edit.removed.includes(name)) {
    edit.removed = edit.removed.filter((n) => n !== name);   /* 預設項目刪掉又加回來 */
  } else {
    const section = currentSections().find((s) => s.title === title);
    if (section.items.some((item) => item.name === name)) return;   /* 已經有了 */
    edit.added.push(name);
  }
  saveEdits(edits);
}

function removeListItem(title, name) {
  const edits = loadEdits();
  const edit = (edits[title] ||= { added: [], removed: [] });
  if (edit.added.includes(name)) edit.added = edit.added.filter((n) => n !== name);
  else edit.removed.push(name);
  saveEdits(edits);

  const checked = loadChecked();
  checked.delete(name);
  saveChecked(checked);
}

openChecklistBtn.addEventListener("click", () => {
  drawChecklist();
  checklist.showModal();
});
checklist.addEventListener("click", (e) => {
  /* 點到跳窗外的暗色背景時，target 會是 dialog 本身 */
  if (e.target === checklist || e.target.closest("[data-close]")) {
    checklist.close();
    return;
  }
  const remove = e.target.closest("[data-remove]");
  if (remove) {
    removeListItem(remove.dataset.section, remove.dataset.remove);
    drawChecklist();
  }
});
checklist.addEventListener("change", (e) => {
  if (e.target.type !== "checkbox") return;
  const checked = loadChecked();
  if (e.target.checked) checked.add(e.target.dataset.name);
  else checked.delete(e.target.dataset.name);
  saveChecked(checked);
});
checklist.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target.dataset.section;
  const name = e.target.elements.entry.value.trim();
  if (name) {
    addListItem(title, name);
    drawChecklist();
  }
  /* 焦點留在輸入框，可以連續新增 */
  const form = [...checklist.querySelectorAll(".check__add")].find((f) => f.dataset.section === title);
  form.elements.entry.value = "";
  form.elements.entry.focus();
});

/* 浮動小狗：拖到哪就貼齊最近的左右邊，位置記在這支手機；點一下開選單 */
const BUDDY_KEY = "milklove-buddy";
const BUDDY_SIZE = 56;                /* 同 theme.css 的 --buddy-size */
const BUDDY_MARGIN = 12;
const BUDDY_BOTTOM = 44;              /* 預設位置離底部的距離，避開 iPhone 底部橫條 */

const buddy = document.getElementById("buddy");
const buddyBtn = document.getElementById("buddyBtn");
const buddyMenu = document.getElementById("buddyMenu");

let buddySide = "right";
let buddyRatio = null;                /* 垂直位置佔視窗高度的比例；null＝預設位置 */
let buddyX = 0;
let buddyY = 0;
let press = null;
let justDragged = false;

try {
  const saved = JSON.parse(localStorage.getItem(BUDDY_KEY));
  if (saved && (saved.side === "left" || saved.side === "right") && typeof saved.ratio === "number") {
    buddySide = saved.side;
    buddyRatio = saved.ratio;
  }
} catch {
  /* 讀不到就用預設位置 */
}

function moveBuddy(x, y) {
  buddyX = Math.max(BUDDY_MARGIN, Math.min(innerWidth - BUDDY_SIZE - BUDDY_MARGIN, x));
  buddyY = Math.max(BUDDY_MARGIN, Math.min(innerHeight - BUDDY_SIZE - BUDDY_MARGIN, y));
  buddy.style.transform = `translate(${buddyX}px, ${buddyY}px)`;
}

function placeBuddy() {
  const y = buddyRatio === null ? innerHeight - BUDDY_SIZE - BUDDY_BOTTOM : buddyRatio * innerHeight;
  moveBuddy(buddySide === "left" ? 0 : innerWidth, y);
}

function setBuddyMenu(open) {
  if (open) {
    buddyMenu.dataset.side = buddySide;
    buddyMenu.dataset.up = String(buddyY > innerHeight / 2);
  }
  buddyMenu.hidden = !open;
  buddyBtn.setAttribute("aria-expanded", String(open));
}

buddyBtn.addEventListener("pointerdown", (e) => {
  justDragged = false;
  press = { id: e.pointerId, startX: e.clientX, startY: e.clientY, x: buddyX, y: buddyY, moved: false };
  buddyBtn.setPointerCapture(e.pointerId);
  buddy.classList.remove("buddy--snap");
});
buddyBtn.addEventListener("pointermove", (e) => {
  if (!press || e.pointerId !== press.id) return;
  const dx = e.clientX - press.startX;
  const dy = e.clientY - press.startY;
  if (!press.moved && Math.hypot(dx, dy) < 6) return;   /* 手指抖一下不算拖曳 */
  press.moved = true;
  setBuddyMenu(false);
  moveBuddy(press.x + dx, press.y + dy);
});
buddyBtn.addEventListener("pointerup", (e) => {
  if (!press || e.pointerId !== press.id) return;
  if (press.moved) {
    justDragged = true;               /* 放開後瀏覽器可能補一個 click，別讓它開選單 */
    buddySide = buddyX + BUDDY_SIZE / 2 < innerWidth / 2 ? "left" : "right";
    buddyRatio = buddyY / innerHeight;
    buddy.classList.add("buddy--snap");
    placeBuddy();
    try {
      localStorage.setItem(BUDDY_KEY, JSON.stringify({ side: buddySide, ratio: buddyRatio }));
    } catch {
      /* 存不了就算了，只是下次回到預設位置 */
    }
  }
  press = null;
});
buddyBtn.addEventListener("pointercancel", () => {
  press = null;
  placeBuddy();
});
buddyBtn.addEventListener("click", () => {
  if (justDragged) {
    justDragged = false;
    return;
  }
  setBuddyMenu(buddyMenu.hidden);
});
buddyMenu.addEventListener("click", () => setBuddyMenu(false));
document.addEventListener("pointerdown", (e) => {
  if (!buddy.contains(e.target)) setBuddyMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setBuddyMenu(false);
});
window.addEventListener("resize", placeBuddy);
placeBuddy();

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

/* 離線用的 Service Worker；註冊失敗只是不能離線，網站照常 */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
