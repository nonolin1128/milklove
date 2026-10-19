/* ═══════════════════════════════════════════════════════════
   config.js ── 圖示、分色規則、每天輪替的主題色
   想換圖示或調整分類邏輯，改這裡
   ═══════════════════════════════════════════════════════════ */

/* 圖示 + 分色群組
   group 決定圖示底色：move＝綠、food＝橘、other＝粉 */
export const TYPES = {
  flight: { icon: "✈",  group: "move"  },
  train:  { icon: "🚇", group: "move"  },
  bus:    { icon: "🚌", group: "move"  },
  car:    { icon: "🚗", group: "move"  },
  boat:   { icon: "⛴",  group: "move"  },
  walk:   { icon: "🚶", group: "move"  },
  food:   { icon: "🍜", group: "food"  },
  cafe:   { icon: "☕", group: "food"  },
  bar:    { icon: "🍸", group: "food"  },
  sight:  { icon: "⛩",  group: "other" },
  park:   { icon: "🌳", group: "other" },
  hotel:  { icon: "🏨", group: "other" },
  shop:   { icon: "🛍", group: "other" },
  spa:    { icon: "💆", group: "other" },
  show:   { icon: "🎟",  group: "other" },
  other:  { icon: "📍", group: "other" },
};

/* 圖示底色 ── 掃一眼就知道這項是在趕路、吃東西、還是其他 */
export const TINT = {
  move:  "var(--mint)",
  food:  "var(--apricot)",
  other: "var(--peach)",
};

/* 每天輪替的主題色：粉 → 綠 → 橘
   highlight 的那天強制用第一組（粉） */
export const ACCENTS = [
  { bg: "var(--peach)",   deep: "var(--peach-deep)",   shadow: "#D98C8533" },
  { bg: "var(--mint)",    deep: "var(--mint-deep)",    shadow: "#7FAE6B33" },
  { bg: "var(--apricot)", deep: "var(--apricot-deep)", shadow: "#E09B5B33" },
];

/* 沒填 type 時，用名稱關鍵字猜 ── 由上往下第一個命中的勝出 */
const GUESS = [
  [/機場|空港|airport|航廈|T\d/i,                     "flight"],
  [/地鐵|電車|鐵道|車站|MRT|BTS|AREX|新幹線/i,         "train"],
  [/巴士|客運|bus/i,                                   "bus"],
  [/船|遊船|boat|ferry/i,                              "boat"],
  [/計程車|包車|租車|taxi|grab/i,                      "car"],
  [/步行|散步|walk/i,                                  "walk"],
  [/咖啡|cafe|café|甜點|下午茶|抹茶/i,                 "cafe"],
  [/酒吧|喝酒|\bbar\b|調酒/i,                          "bar"],
  [/按摩|spa|massage/i,                                "spa"],
  [/公園|park/i,                                       "park"],
  [/餐|吃|拉麵|烤肉|炸雞|午餐|晚餐|宵夜|粿雜|食堂|丼|壽司|煎餅/i, "food"],
  [/入住|飯店|旅館|hotel|hostel|民宿|退房|check ?(in|out)|住宿/i, "hotel"],
  [/逛|購物|週邊|商店|市場|百貨|shop|store|market/i,   "shop"],
  [/演唱會|concert|見面會|fan ?meeting|簽售|公演|\bFC\b/i, "show"],
  [/宮|寺|塔|博物館|美術館|展|神社|城/i,               "sight"],
];

export function guessType(name) {
  for (const [re, type] of GUESS) if (re.test(name)) return type;
  return "other";
}

/* 給驗證腳本用：合法的 type 清單 */
export const VALID_TYPES = Object.keys(TYPES);
