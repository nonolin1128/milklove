/* ═══════════════════════════════════════════════════════════
   trip.js ── 行程資料
   改行程只要動這個檔案

   每個項目的欄位：
     time    時刻（"07:00"）或時段詞（"午餐" "傍晚"），留空就不顯示
     type    圖示與分色，見 js/config.js 的 TYPES；不填會用關鍵字猜
     name    地點名稱（必填）
     address 有地址最好；沒有就用「name + city」去 Google Maps 搜
     note    備註
     nomap   true = 沒有實際地點，不顯示地圖/導航按鈕

   每天的欄位：
     date / city / items
     image     頂部大圖（例 "images/day1.jpg"），留空用純色漸層
     highlight true = 主要活動日，強制粉色 + 柔光
     badge     大圖上的小標籤
   ═══════════════════════════════════════════════════════════ */

export const TRIP = {
  title: "曼谷 5 日・ML-FC",
  days: [
    /* ── Day 1 ─────────────────────────── */
    {
      date: "2026-11-11",
      city: "曼谷",
      image: "",
      items: [
        { time: "19:00", type: "hotel", name: "住宿 check-in", nomap: true,
          note: "飯店名稱待補" },
        { time: "", type: "spa", name: "按摩", nomap: true,
          note: "來得及再去" },
        { time: "晚餐", type: "food", name: "Khao Tom Jay Suay", address: "",
          note: "唐人街・跟熊去，小愛很愛的 local 熱炒店" },
      ],
    },

    /* ── Day 2 ─────────────────────────── */
    {
      date: "2026-11-12",
      city: "曼谷",
      image: "",
      items: [
        { time: "07:00", type: "food", name: "逛早市・吃粿雜", nomap: true,
          note: "市場位置待確認" },
        { time: "", type: "cafe", name: "偷情咖啡廳", address: "",
          note: "店名是暱稱，正式名稱待補" },
        { time: "", type: "sight", name: "臥佛寺（擼貓）", address: "Wat Pho, Bangkok" },
        { time: "", type: "spa", name: "臥佛寺按摩學校",
          address: "Wat Pho Thai Traditional Medical and Massage School, Bangkok" },
        { time: "午餐", type: "food", name: "Medium Rare Tha Tian", address: "",
          note: "小愛喜歡的烤牛肉" },
        { time: "", type: "sight", name: "河邊看鄭王廟河景", address: "Wat Arun, Bangkok" },
        { time: "", type: "shop", name: "帕空鮮花市場", address: "Pak Khlong Talat, Bangkok" },
        { time: "", type: "food", name: "班蘭蛋捲", nomap: true,
          note: "鮮花市場附近・攤位位置待補" },
        { time: "", type: "food", name: "阿姨果汁店", nomap: true,
          note: "位置待補" },
        { time: "", type: "shop", name: "三聘市場", address: "Sampeng Lane Market, Bangkok",
          note: "買隨身攜帶胡椒粉（熊感覺會喜歡）" },
        { time: "", type: "hotel", name: "回住宿點放東西休息", nomap: true },
        { time: "傍晚", type: "sight", name: "金山寺看夕陽", address: "Wat Saket, Bangkok",
          note: "找 som" },
        { time: "晚餐", type: "food", name: "拉麵（熊想吃的）", nomap: true,
          note: "店名待補" },
        { time: "", type: "bar", name: "Ku Bar", address: "Ku Bar, Bangkok",
          note: "看要不要喝" },
        { time: "", type: "hotel", name: "回住宿點", nomap: true },
      ],
    },

    /* ── Day 3 ─────────────────────────── */
    {
      date: "2026-11-13",
      city: "曼谷",
      image: "",
      items: [
        { time: "10:30", type: "food", name: "壁畫粿雜", nomap: true,
          note: "店名是暱稱，正式名稱待補" },
        { time: "", type: "cafe", name: "Siam Subway", address: "Siam Subway, Bangkok",
          note: "喝抹茶" },
        { time: "12:00", type: "hotel", name: "check out", nomap: true },
        { time: "", type: "train", name: "坐 MRT 去 Taipan Hotel", nomap: true },
        { time: "", type: "hotel", name: "Taipan Hotel check in",
          address: "Taipan Hotel, Bangkok" },
        { time: "午餐", type: "food", name: "สมยงตำซั่ว สุขุมวิท-อโศก", address: "",
          note: "奶愛吃過的餐廳" },
        { time: "14:30", type: "cafe", name: "GMM 咖啡廳", address: "",
          note: "正式店名待確認" },
        { time: "", type: "park", name: "班嘉奇蒂公園", address: "Benjakitti Park, Bangkok" },
        { time: "18:00", type: "park", name: "倫披尼公園・跳大會操",
          address: "Lumphini Park, Bangkok",
          note: "從班嘉奇蒂公園散步過去" },
        { time: "", type: "hotel", name: "回住宿點洗澡", nomap: true },
        { time: "晚餐", type: "food", name: "Baan E-sarn Muangyos", address: "",
          note: "糖推薦的餐廳" },
        { time: "", type: "bar", name: "喝酒", nomap: true },
      ],
    },

    /* ── Day 4 ─────────────────────────── */
    {
      date: "2026-11-14",
      city: "曼谷",
      image: "",
      items: [
        { time: "07:00", type: "food", name: "BARTELS", address: "Bartels, Bangkok",
          note: "酸種麵包吃早餐" },
        { time: "", type: "cafe", name: "Waraha Café", address: "",
          note: "英法的咖啡廳" },
        { time: "12:00", type: "hotel", name: "check out", nomap: true,
          note: "12 點前" },
        { time: "", type: "train", name: "坐 MRT 去 Ladprao", nomap: true,
          note: "約 30 分鐘" },
        { time: "", type: "hotel", name: "The Quarter Ladprao by UHG check in",
          address: "The Quarter Ladprao by UHG, Bangkok" },
        { time: "", type: "train", name: "坐 BTS 到 Ari", address: "Ari BTS Station, Bangkok",
          note: "開始潘薩之旅" },
        { time: "午餐", type: "food", name: "Poet House Cafe", address: "" },
        { time: "下午茶", type: "cafe", name: "Dog In Town Ari", address: "" },
        { time: "", type: "other", name: "小愛踩點之旅", nomap: true },
        { time: "晚餐", type: "food", name: "The Camping Ground", address: "" },
        { time: "點心", type: "food", name: "香蕉煎餅", nomap: true,
          note: "The Camping Ground 旁邊" },
      ],
    },

    /* ── Day 5 ─────────────────────────── */
    {
      date: "2026-11-15",
      city: "曼谷",
      image: "",
      highlight: true,
      badge: "ML-FC",
      items: [
        { time: "", type: "show", name: "ML-FC", nomap: true,
          note: "時間、場地、座位待補" },
      ],
    },
  ],
};
