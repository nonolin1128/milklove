/* ═══════════════════════════════════════════════════════════
   trip.js ── 行程資料
   改行程只要動這個檔案

   每個項目的欄位：
     time    時刻（"07:00"）或時段詞（"午餐" "傍晚"），留空就不顯示
             總表靠它分上午／下午／晚上，留空的項目跟著上一項
     type    圖示與分色，見 js/config.js 的 TYPES；不填會用關鍵字猜
     name    地點名稱（必填）
     address 店名或地址，會顯示在名稱下面一行
     search  地圖搜尋用的字串，不顯示：名稱不適合直接拿去搜尋、又不想多一行地址時用
     coords  "緯度,經度"：路邊攤或沒有店名的落點針用這個，地圖連結優先吃它
     note    備註
     ig      Instagram 貼文連結，多一顆「📷 IG」按鈕
     video   影片連結（YouTube／Bilibili…），多一顆「▶ 影片」按鈕
     icon    單獨指定這一項的圖示（例 "💚"），不填就照 type
     nomap   true = 沒有實際地點，不顯示地圖/導航按鈕
     optional true = 備選（可去可不去），卡片變淡並標「備選」
     stops   一組行程（欄位同上）：整組收成一張可展開的卡片，總表只佔一格
             time 決定整組排在總表哪一格；可以再給 image 放一張照片（focus 同大圖），展開才載入

   每天的欄位：
     date / city / items
     image     頂部大圖（例 "images/day1.webp"），留空用純色漸層
     focus     大圖在 16:9 裁切時的垂直對齊（"10%" = 靠上）
               直式照片一定要給，不然置中裁切會把臉切掉
     highlight true = 主要活動日，強制粉色 + 柔光
     badge     大圖上的小標籤

   checklist（在最下面）：底部「清單」按鈕的內容
     每區 icon / title / items；項目的 name、address 同上，有 address 就有地圖按鈕
     打勾記錄用 name 當鑰匙，所以改名字後要重勾
   ═══════════════════════════════════════════════════════════ */

export const TRIP = {
  title: "曼谷 5 日・奶愛FC踩點之旅",
  days: [
    /* ── Day 1 ─────────────────────────── */
    {
      date: "2026-11-11",
      city: "曼谷",
      image: "images/day1.webp",
      items: [
        { time: "16:45", type: "flight", name: "抵達曼谷", nomap: true },
        { time: "19:00", type: "hotel", name: "住宿 check-in", nomap: true },
        { time: "", type: "spa", name: "按摩", optional: true, address: "Thanomchai Aree Thai Massage",
          coords: "13.7465435,100.5018732",
          note: "來得及再去" },
        { time: "晚餐", type: "food", name: "Khao Tom Jay Suay", address: "",
          note: "唐人街・跟熊去，小愛很愛的 local 熱炒店" },
      ],
    },

    /* ── Day 2 ─────────────────────────── */
    {
      date: "2026-11-12",
      city: "曼谷",
      image: "images/day2.webp",
      focus: "20%",            /* 保住上排最高那顆頭 */
      items: [
        { time: "07:00", type: "food", name: "逛早市・吃粿雜",
          coords: "13.750697,100.499296",
          note: "hen好吃的粿雜" },
        { time: "", type: "cafe", name: "偷情咖啡廳", address: "PAULETTE BKK",
          coords: "13.7495233,100.4980413",
          ig: "https://www.instagram.com/p/Db2aKlOHROu/?img_index=5" },
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
        { time: "晚餐", type: "food", name: "372 Ramen And Sake",
          coords: "13.7632489,100.5002599",
          note: "熊想吃的拉麵" },
        { time: "", type: "bar", name: "Ku Bar", optional: true, address: "Ku Bar, Bangkok",
          note: "看要不要喝" },
        { time: "", type: "hotel", name: "回住宿點", nomap: true },
      ],
    },

    /* ── Day 3 ─────────────────────────── */
    {
      date: "2026-11-13",
      city: "曼谷",
      image: "images/day3.webp",
      focus: "55%",            /* 直式照：對準人臉和玩偶的臉，招牌和下半身讓它裁掉 */
      items: [
        { time: "10:30", type: "food", name: "壁畫粿雜",
          address: "ก๋วยจั๊บน้ำใสตรอกวัดพระพิเรนทร์ ฝั่งวรจักร (เจ๊เกียง)",
          coords: "13.7480824,100.5062635",
          note: "最好吃粿雜！" },
        { time: "", type: "cafe", name: "Siam Subway", optional: true, address: "Siam Subway, Bangkok",
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
      image: "images/day4.webp",
      items: [
        { time: "07:00", type: "food", name: "BARTELS", address: "Bartels, Bangkok",
          note: "酸種麵包吃早餐" },
        { time: "", type: "cafe", name: "Waraha Café", address: "",
          note: "英法的咖啡廳・巷子比較小，可能要摩托車過去，要走到 Asok Montri 路坐摩托車比較好" },
        { time: "12:00", type: "hotel", name: "check out", nomap: true,
          note: "12 點前・直接帶行李離開會比較順，但如果行李太重不想拿著移動，可以寄放再回來拿" },
        { time: "", type: "train", name: "坐 BTS 去 Phrom Phong",
          address: "Phrom Phong BTS Station, Bangkok",
          note: "面交寫真集" },
        { time: "午餐", type: "food", name: "Kanori Hand Roll Bar (EmQuartier)",
          coords: "13.7314398,100.5697312",
          note: "潘薩最愛手捲" },
        { time: "", type: "train", name: "坐 MRT 去 Ladprao", nomap: true,
          note: "約 30 分鐘" },
        { time: "14:00", type: "hotel", name: "The Quarter Ladprao by UHG check in",
          search: "The Quarter Ladprao by UHG, Bangkok" },
        { time: "下午", type: "tour", name: "潘薩踩點之旅", icon: "💚",
          image: "images/pansa.webp",
          focus: "10%",        /* 直式照：保住哈士奇和潘薩的臉 */
          stops: [
          { time: "", type: "train", name: "坐 BTS 到 Ari", address: "Ari BTS Station, Bangkok" },
        { time: "下午茶", type: "cafe", name: "Dog In Town Ari", address: "",
          ig: "https://www.instagram.com/p/DerD8fCk1tL/?img_index=1" },
        ] },
        { time: "晚餐", type: "tour", name: "小愛踩點之旅", icon: "💖",
          image: "images/love.webp",
          focus: "35%",        /* 直式照：保住臉和上半身 */
          stops: [
        { time: "晚餐", type: "food", name: "The Camping Ground", address: "",
          ig: "https://www.instagram.com/p/DUSxXc-ktJq/?img_index=1",
          note: "廣場好像有 Mu Kratha" },
        { time: "點心", type: "food", name: "香蕉煎餅", address: "Roti",
          coords: "13.7901267,100.5460538",
          note: "The Camping Ground 旁邊" },
        ] },
        { time: "22:00", type: "shop", name: "BigC Supercenter Sapankwai", optional: true,
          coords: "13.7913638,100.5495483",
          note: "逛 Big c 補貨" },
      ],
    },

    /* ── Day 5 ─────────────────────────── */
    {
      date: "2026-11-15",
      city: "曼谷",
      image: "images/day5.webp",
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

  checklist: [
    { icon: "🛒", title: "要買的", items: [
      { name: "泰奶粉" },
      { name: "胡椒粉" },
      { name: "蛇牌涼感噴霧" },
      { name: "英法咖啡豆" },
      { name: "小愛代言的洗面乳" },
      { name: "冬蔭功泡麵" },
      { name: "船麵泡麵" },
      { name: "榴槤乾" },
    ] },
    { icon: "📌", title: "有空再去", items: [
      { name: "換錢" },
      { name: "Central World 逛香水", address: "CentralWorld, Bangkok" },
    ] },
  ],
};
