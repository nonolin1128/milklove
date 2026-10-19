/* ═══════════════════════════════════════════════════════════
   trip.js ── 行程資料
   改行程只要動這個檔案

   每個項目的欄位：
     time    時刻（"07:00"）或時段詞（"午餐" "傍晚"），留空就不顯示
     type    圖示與分色，見 js/config.js 的 TYPES；不填會用關鍵字猜
     name    地點名稱（必填）
     address 店名或地址，會顯示在名稱下面一行
     coords  "緯度,經度"：路邊攤或沒有店名的落點針用這個，地圖連結優先吃它
     note    備註
     ig      Instagram 貼文連結，多一顆「📷 IG」按鈕
     video   影片連結（YouTube／Bilibili…），多一顆「▶ 影片」按鈕
     nomap   true = 沒有實際地點，不顯示地圖/導航按鈕

   每天的欄位：
     date / city / items
     image     頂部大圖（例 "images/day1.jpg"），留空用純色漸層
     focus     大圖在 16:9 裁切時的垂直對齊（"10%" = 靠上）
               直式照片一定要給，不然置中裁切會把臉切掉
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
      image: "images/day1.jpg",
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
      image: "images/day2.jpg",
      focus: "20%",            /* 保住上排最高那顆頭 */
      items: [
        { time: "07:00", type: "food", name: "逛早市・吃粿雜",
          coords: "13.750697,100.499296",
          note: "hen好吃的粿雜" },
        { time: "", type: "cafe", name: "偷情咖啡廳", address: "PAULETTE BKK",
          coords: "13.7495233,100.4980413",
          ig: "https://www.instagram.com/p/Db2aKlOHROu/?img_index=5",
          note: "「偷情咖啡廳」是暱稱，正式店名 PAULETTE BKK" },
        { time: "", type: "sight", name: "臥佛寺（擼貓）", address: "Wat Pho, Bangkok",
          ig: "https://www.instagram.com/p/C5p4Ys-BYAs/?img_index=1" },
        { time: "", type: "spa", name: "臥佛寺按摩學校",
          address: "Wat Pho Thai Traditional Medical and Massage School, Bangkok" },
        { time: "午餐", type: "food", name: "Medium Rare Tha Tian", address: "",
          ig: "https://www.instagram.com/p/C5srlDxPLmV/?img_index=5",
          note: "小愛喜歡的烤牛肉" },
        { time: "", type: "sight", name: "河邊看鄭王廟河景", address: "Wat Arun Viewing Point",
          coords: "13.7448659,100.4909543",
          ig: "https://www.instagram.com/p/Dc-9Hhek1vm/?img_index=4",
          note: "潘薩Vogue" },
        { time: "", type: "shop", name: "帕空鮮花市場", address: "Pak Khlong Talat, Bangkok",
          ig: "https://www.instagram.com/p/Dc-9Hhek1vm/?img_index=1",
          note: "潘薩Vogue" },
        { time: "", type: "food", name: "班蘭蛋捲", address: "班斕蛋捲",
          coords: "13.744068,100.499268",
          note: "鮮花市場附近" },
        { time: "", type: "food", name: "阿姨果汁店",
          address: "Auntie Mhoo's Juice & Smoothies",
          coords: "13.7439049,100.5023993" },
        { time: "", type: "shop", name: "三聘市場", address: "Sampeng Lane Market, Bangkok",
          note: "買隨身攜帶胡椒粉（熊感覺會喜歡）" },
        { time: "", type: "hotel", name: "回住宿點放東西休息", nomap: true },
        { time: "傍晚", type: "sight", name: "金山寺看夕陽", address: "Wat Saket, Bangkok",
          note: "找 som" },
        { time: "晚餐", type: "food", name: "拉麵（熊想吃的）", address: "372 Ramen And Sake",
          coords: "13.7632489,100.5002599" },
        { time: "", type: "bar", name: "Ku Bar", address: "Ku Bar, Bangkok",
          note: "看要不要喝" },
        { time: "", type: "hotel", name: "回住宿點", nomap: true },
      ],
    },

    /* ── Day 3 ─────────────────────────── */
    {
      date: "2026-11-13",
      city: "曼谷",
      image: "images/day3.jpg",
      focus: "55%",            /* 直式照：對準人臉和玩偶的臉，招牌和下半身讓它裁掉 */
      items: [
        { time: "10:30", type: "food", name: "壁畫粿雜",
          address: "ก๋วยจั๊บน้ำใสตรอกวัดพระพิเรนทร์ ฝั่งวรจักร (เจ๊เกียง)",
          coords: "13.7480824,100.5062635",
          note: "最好吃粿雜！" },
        { time: "", type: "cafe", name: "Siam Subway", address: "Siam Subway, Bangkok",
          note: "喝抹茶" },
        { time: "12:00", type: "hotel", name: "check out", nomap: true },
        { time: "", type: "train", name: "坐 MRT 去 Taipan Hotel", nomap: true },
        { time: "", type: "hotel", name: "Taipan Hotel check in",
          address: "Taipan Hotel, Bangkok" },
        { time: "午餐", type: "food", name: "สมยงตำซั่ว สุขุมวิท-อโศก", address: "",
          video: "https://www.bilibili.com/video/BV1pv421C7WM/",
          note: "奶愛吃過的餐廳" },
        { time: "14:30", type: "cafe", name: "GMM 咖啡廳", address: "GEMM HOUSE",
          coords: "13.7434165,100.5629013",
          note: "看孫孫 花錢錢" },
        { time: "", type: "park", name: "班嘉奇蒂公園", address: "Benjakitti Park, Bangkok",
          note: "要穿全身黑！" },
        { time: "18:00", type: "park", name: "倫披尼公園・跳大會操",
          address: "Lumphini Park, Bangkok",
          note: "從班嘉奇蒂公園散步過去" },
        { time: "", type: "hotel", name: "回住宿點洗澡", nomap: true },
        { time: "晚餐", type: "food", name: "Baan E-sarn Muangyos", address: "",
          note: "糖推薦的餐廳" },
        { time: "", type: "bar", name: "喝酒", address: "WYWS Cocktail Bar - Asoke",
          coords: "13.7464976,100.5623218" },
      ],
    },

    /* ── Day 4 ─────────────────────────── */
    {
      date: "2026-11-14",
      city: "曼谷",
      image: "images/day4.jpg",
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
        { time: "下午茶", type: "cafe", name: "Dog In Town Ari", address: "",
          ig: "https://www.instagram.com/p/DerD8fCk1tL/?img_index=1" },
        { time: "", type: "other", name: "小愛踩點之旅", nomap: true },
        { time: "晚餐", type: "food", name: "The Camping Ground", address: "" },
        { time: "點心", type: "food", name: "香蕉煎餅", address: "Roti",
          coords: "13.7901267,100.5460538",
          note: "The Camping Ground 旁邊" },
      ],
    },

    /* ── Day 5 ─────────────────────────── */
    {
      date: "2026-11-15",
      city: "曼谷",
      image: "images/day5.jpg",
      focus: "10%",            /* 直式海報：保住標題和兩個人，底部售票資訊讓它裁掉 */
      highlight: true,
      badge: "ML-FC",
      items: [
        { time: "17:00", type: "show", name: "Milk Love Whimsical House Fancon",
          address: "Union Hall, Union Mall, Bangkok",
          note: "看奶愛！！！！！！" },
      ],
    },
  ],
};
